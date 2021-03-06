import threading

from datasource.base.connection import Connection as BaseConn
from datasource.exceptions import ImportException
from datasource.utils import CursorWrapper

try:
    import MySQLdb as Database
except ImportError as err:
    raise ImportException(
        'Error loading MySQLdb module.\n'
        'Did you install mysqlclient?'
    ) from err


class Connection(BaseConn):

    def __init__(self, conn_dict, *args, **kwargs):
        super(Connection, self).__init__(conn_dict, args, kwargs)

    # ##### Backend-specific methods for creating connections and cursors #####

    def get_connection_params(self):
        kwargs = {
            'charset': 'utf8',
        }
        conn_dict = self.conn_dict
        if conn_dict.get('username'):
            kwargs['user'] = conn_dict['username']
        if conn_dict.get('dbname'):
            kwargs['db'] = conn_dict['dbname']
        if conn_dict.get('password'):
            kwargs['passwd'] = conn_dict['password']
        if conn_dict.get('host', '').startswith('/'):
            kwargs['unix_socket'] = conn_dict['host']
        elif conn_dict.get('host'):
            kwargs['host'] = conn_dict['host']
        if conn_dict.get('port', 3306):
            kwargs['port'] = int(conn_dict.get('port', 3306))
        # We need the number of potentially affected rows after an
        # "UPDATE", not the number of changed rows.
        # Validate the transaction isolation level, if specified.
        # options = conn_dict.get(.copy()
        # kwargs.update(options)
        return kwargs

    def get_new_connection(self, conn_params):
        return Database.connect(**conn_params)

    def cursor(self):
        self.cursor_wrapper = CursorWrapper(self.connection.cursor())
        return self

    def execute(self, query, args=None):
        self.cursor()
        self.cursor_wrapper.execute(query, args)
        return self

    def values(self, *args):
        return self.cursor_wrapper.values(*args)

