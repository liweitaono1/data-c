import random
from importlib import import_module
from Crypto.Cipher import AES
from binascii import b2a_hex, a2b_hex
import hashlib


class ConnectionPool(object):
    def __init__(self):
        self.pool = {}

    def get_connection(self, name, conn_dict):
        # if not self.pool.get(name):
        #     self.pool.setdefault(name, self.new_connection(conn_dict))
        return self.new_connection(conn_dict)

    @staticmethod
    def new_connection(conn_dict):
        name = conn_dict.get('type') and conn_dict.pop('type')
        return load_backend(name)(conn_dict).connect()


conn_pool = ConnectionPool()


def load_backend(name):
    module_name = 'datasource.' + name + '.connection'
    module = import_module(module_name)
    return getattr(module, 'Connection')


def dictfetchall(cursor):
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]


class CursorWrapper:
    def __init__(self, cursor):
        self.cursor = cursor

    def execute(self, query, args=None):
        self.cursor.execute(query, args)
        return self

    def values(self, *args):
        return dictfetchall(self.cursor)

    def close(self):
        self.cursor.close()


class PyCrypt(object):
    """
    This class used to encrypt and decrypt password.
    加密类
    """

    def __init__(self, key):
        self.key = key.encode('utf-8')
        self.mode = AES.MODE_CBC

    @staticmethod
    def gen_rand_pass(length=16, especial=False):
        """
        random password
        随机生成密码
        """
        salt_key = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
        symbol = '!@$%^&*()_'
        salt_list = []
        if especial:
            for i in range(length - 4):
                salt_list.append(random.choice(salt_key))
            for i in range(4):
                salt_list.append(random.choice(symbol))
        else:
            for i in range(length):
                salt_list.append(random.choice(salt_key))
        salt = ''.join(salt_list)
        return salt

    @staticmethod
    def md5_crypt(string):
        """
        md5 encrypt method
        md5非对称加密方法
        """
        return hashlib.new("md5", string).hexdigest()

    @staticmethod
    def gen_sha512(salt, password):
        """
        generate sha512 format password
        生成sha512加密密码
        """
        # return crypt.crypt(password, '$6$%s$' % salt)

    def encrypt(self, passwd=None, length=32):
        """
        encrypt gen password
        对称加密之加密生成密码
        """
        if not passwd:
            passwd = self.gen_rand_pass()

        cryptor = AES.new(self.key, self.mode, b'8122ca7d906ad5e1')
        try:
            count = len(passwd)
        except TypeError:
            raise BaseException('Encrypt password error, TYpe error.')

        add = (length - (count % length))
        passwd += ('\0' * add)
        # if isinstance(passwd, unicode):
        #     passwd = str(passwd)
        cipher_text = cryptor.encrypt(passwd)

        return str(b2a_hex(cipher_text), encoding='utf-8').rstrip('\0')

    def decrypt(self, text):
        """
        decrypt pass base the same key
        对称加密之解密，同一个加密随机数
        """
        cryptor = AES.new(self.key, self.mode, b'8122ca7d906ad5e1')

        try:
            plain_text = cryptor.decrypt(a2b_hex(text))
        except TypeError:
            raise BaseException('Decrypt password error, TYpe error.')

        return str(plain_text, encoding='utf-8').rstrip('\0')
CRYPTOR = PyCrypt('841enj9neshd1wes')