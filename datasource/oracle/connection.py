from datasource.base.connection import Connection as BaseConn
from datasource.exceptions import ImportException
from datasource.utils import dictfetchall, CRYPTOR

from datasource.oracle.utils import Oracle_datetime

import datetime

from django.conf import settings
from django.utils.encoding import force_bytes, force_text

try:
    import cx_Oracle as Database
except ImportError as e:
    raise ImportException("Error loading cx_Oracle module: %s" % e)


class Connection(BaseConn):

    def __init__(self, conn_dict, *args, **kwargs):
        super(Connection, self).__init__(conn_dict, args, kwargs)

    # ##### Backend-specific methods for creating connections and cursors #####

    def connect(self):
        """Connect to the database. Assume that the connection is closed."""
        conn_params = self.get_connection_params()
        self.connection = self.get_new_connection(conn_params)
        return self

    def _connect_string(self):
        conn_dict = self.conn_dict
        if not conn_dict.get('host', '').strip():
            conn_dict['host'] = 'localhost'
        if conn_dict.get('host'):
            dsn = Database.makedsn(conn_dict['host'],
                                   int(conn_dict.get('port', 1521)),
                                   conn_dict['dbname'])
        else:
            dsn = conn_dict['dsn']
        return "%s/%s@%s" % (conn_dict['username'],
                             CRYPTOR.decrypt(conn_dict['password']), dsn)

    def get_connection_params(self):
        return {'encoding': self.conn_dict.get('charset', 'UTF-8'), 'nencoding': self.conn_dict.get('charset', 'UTF-8')}

    def get_new_connection(self, conn_params):
        print(self._connect_string())
        return Database.connect(self._connect_string(), **conn_params)

    def cursor(self):
        self.cursor_wrapper = FormatStylePlaceholderCursor(self.connection.cursor())
        return self

    def execute(self, query, args=None):
        self.cursor()
        self.cursor_wrapper.execute(query, args)
        return self

    def values(self, *args):
        return self.cursor_wrapper.values(*args)


class FormatStylePlaceholderCursor:
    """
    Django uses "format" (e.g. '%s') style placeholders, but Oracle uses ":var"
    style. This fixes it -- but note that if you want to use a literal "%s" in
    a query, you'll need to use "%%s".

    We also do automatic conversion between Unicode on the Python side and
    UTF-8 -- for talking to Oracle -- in here.
    """
    charset = 'utf-8'

    def __init__(self, cursor):
        self.cursor = cursor
        # The default for cx_Oracle < 5.3 is 50.
        self.cursor.arraysize = 100

    def _format_params(self, params):
        try:
            return {k: OracleParam(v, self, True) for k, v in params.items()}
        except AttributeError:
            return tuple(OracleParam(p, self, True) for p in params)

    def _param_generator(self, params):
        # Try dict handling; if that fails, treat as sequence
        if hasattr(params, 'items'):
            return {k: v.force_bytes for k, v in params.items()}
        else:
            return [p.force_bytes for p in params]

    def _fix_for_params(self, query, params, unify_by_values=False):
        # cx_Oracle wants no trailing ';' for SQL statements.  For PL/SQL, it
        # it does want a trailing ';' but not a trailing '/'.  However, these
        # characters must be included in the original query in case the query
        # is being passed to SQL*Plus.
        if query.endswith(';') or query.endswith('/'):
            query = query[:-1]
        if params is None:
            params = []
        elif hasattr(params, 'keys'):
            # Handle params as dict
            args = {k: ":%s" % k for k in params}
            query = query % args
        elif unify_by_values and len(params) > 0:
            # Handle params as a dict with unified query parameters by their
            # values. It can be used only in single query execute() because
            # executemany() shares the formatted query with each of the params
            # list. e.g. for input params = [0.75, 2, 0.75, 'sth', 0.75]
            # params_dict = {0.75: ':arg0', 2: ':arg1', 'sth': ':arg2'}
            # args = [':arg0', ':arg1', ':arg0', ':arg2', ':arg0']
            # params = {':arg0': 0.75, ':arg1': 2, ':arg2': 'sth'}
            params_dict = {param: ':arg%d' % i for i, param in enumerate(set(params))}
            args = [params_dict[param] for param in params]
            params = {value: key for key, value in params_dict.items()}
            query = query % tuple(args)
        else:
            # Handle params as sequence
            args = [(':arg%d' % i) for i in range(len(params))]
            query = query % tuple(args)
        return query, self._format_params(params)

    def execute(self, query, params=None):
        query, params = self._fix_for_params(query, params, unify_by_values=True)
        return self.cursor.execute(query, self._param_generator(params))

    def values(self, *args):
        return dictfetchall(self.cursor)


class OracleParam:
    """
    Wrapper object for formatting parameters for Oracle. If the string
    representation of the value is large enough (greater than 4000 characters)
    the input size needs to be set as CLOB. Alternatively, if the parameter
    has an `input_size` attribute, then the value of the `input_size` attribute
    will be used instead. Otherwise, no input size will be set for the
    parameter when executing the query.
    """

    def __init__(self, param, cursor, strings_only=False):
        # With raw SQL queries, datetimes can reach this function
        # without being converted by DateTimeField.get_db_prep_value.
        if settings.USE_TZ and (isinstance(param, datetime.datetime) and
                                not isinstance(param, Oracle_datetime)):
            param = Oracle_datetime.from_datetime(param)

        string_size = 0
        # Oracle doesn't recognize True and False correctly.
        if param is True:
            param = 1
        elif param is False:
            param = 0
        if hasattr(param, 'bind_parameter'):
            self.force_bytes = param.bind_parameter(cursor)
        elif isinstance(param, (Database.Binary, datetime.timedelta)):
            self.force_bytes = param
        else:
            # To transmit to the database, we need Unicode if supported
            # To get size right, we must consider bytes.
            self.force_bytes = force_text(param, cursor.charset, strings_only)
            if isinstance(self.force_bytes, str):
                # We could optimize by only converting up to 4000 bytes here
                string_size = len(force_bytes(param, cursor.charset, strings_only))
        if hasattr(param, 'input_size'):
            # If parameter has `input_size` attribute, use that.
            self.input_size = param.input_size
        elif string_size > 4000:
            # Mark any string param greater than 4000 characters as a CLOB.
            self.input_size = Database.CLOB
        else:
            self.input_size = None


class VariableWrapper:
    """
    An adapter class for cursor variables that prevents the wrapped object
    from being converted into a string when used to instantiate an OracleParam.
    This can be used generally for any other object that should be passed into
    Cursor.execute as-is.
    """

    def __init__(self, var):
        self.var = var

    def bind_parameter(self, cursor):
        return self.var

    def __getattr__(self, key):
        return getattr(self.var, key)

    def __setattr__(self, key, value):
        if key == 'var':
            self.__dict__[key] = value
        else:
            setattr(self.var, key, value)
