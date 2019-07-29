from datasource.base.connection import Connection as BaseConn
from datasource.exceptions import ImportException
from datasource.utils import CursorWrapper

import json

try:
    import pymongo as Database
except ImportError as err:
    raise ImportException(
        'Error loading MySQLdb module.\n'
        'Did you install mysqlclient?'
    ) from err


class Connection(BaseConn):

    def __init__(self, conn_dict, *args, **kwargs):
        super(Connection, self).__init__(conn_dict, args, kwargs)
        self.result = None

    # ##### Backend-specific methods for creating connections and cursors #####

    def get_connection_params(self):
        kwargs = {
        }
        conn_dict = self.conn_dict
        # if conn_dict['dbname']:
        #     kwargs['db'] = conn_dict['dbname']
        if conn_dict.get('host'):
            kwargs['host'] = conn_dict['host']
        if conn_dict.get('port'):
            kwargs['port'] = int(conn_dict['port'])
        # We need the number of potentially affected rows after an
        # "UPDATE", not the number of changed rows.
        # Validate the transaction isolation level, if specified.
        # options = conn_dict.get(.copy()
        # kwargs.update(options)
        return kwargs

    def get_new_connection(self, conn_params):
        return Database.MongoClient(**conn_params)[self.conn_dict['dbname']]

    def cursor(self):
        self.cursor_wrapper = CursorWrapper(self.connection.cursor())
        return self

    def connect(self):
        """Connect to the database. Assume that the connection is closed."""
        conn_params = self.get_connection_params()
        self.connection = self.get_new_connection(conn_params)
        return self

    def execute(self, query):
        """
        自定义mongo执行方法
        :param query:
        :return:
        """
        query_list = query.split('.')
        result_list = []
        for i, q in enumerate(query_list):
            if i == 0:
                result_list.append(getattr(self.connection, q))
            else:
                m, args, kwargs = self.parse_params(q)
                result_list.append(getattr(result_list[i - 1], m)(*args, **kwargs))
        self.result = result_list[len(result_list) - 1]
        return self

    @staticmethod
    def parse_params(q):
        """
        自定参数处理
        :param q:
        :return:
        """
        mq = q.split('(')
        args, kwargs = [], {}
        if len(mq) >= 2:
            params = mq[1]
            params = params.endswith(')') and params[:-1] or params
            ps = params.split(',')
            for i, p in enumerate(ps):
                try:
                    if i == 0:
                        args.append(json.loads(p))
                    else:
                        kwargs.update(json.loads(p))
                except ValueError:
                    raise ValueError('查询参数格式不正确')

            print(args, kwargs)
        return mq[0], args, kwargs

    def values(self, *args):
        """序列化游标"""
        if isinstance(self.result, (dict, list)):
            return self.result
        elif isinstance(self.result, Database.cursor.Cursor):
            return [d for d in self.result]
