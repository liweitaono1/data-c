import time

from datasource.utils import CRYPTOR


class Connection(object):
    """
    连接基类
    """

    def __init__(self, conn_dict, *args, **kwargs):
        self.conn_dict = conn_dict
        self.connection = None
        self.cursor_wrapper = None

    # ##### Backend-specific methods for creating connections and cursors #####

    def get_connection_params(self):
        """Return a dict of parameters suitable for get_new_connection."""
        raise NotImplementedError('subclasses of BaseDatabaseWrapper may require a get_connection_params() method')

    def get_new_connection(self, conn_params):
        """Open a connection to the database."""
        raise NotImplementedError('subclasses of BaseDatabaseWrapper may require a get_new_connection() method')

    def connect(self):
        """Connect to the database. Assume that the connection is closed."""
        conn_params = self.get_connection_params()
        print(conn_params)
        conn_params['passwd'] = CRYPTOR.decrypt(conn_params['passwd'])
        self.connection = self.get_new_connection(conn_params)
        return self

    def testing(self):
        """测试连接"""
        try:
            self.connect()
        except Exception as e:
            return False, e
        return True, self.connection
