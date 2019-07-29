import datetime
from datasource.exceptions import ImportException
try:
    import cx_Oracle as Database
except ImportError as e:
    raise ImportException("Error loading cx_Oracle module: %s" % e)


class Oracle_datetime(datetime.datetime):
    """
    A datetime object, with an additional class attribute
    to tell cx_Oracle to save the microseconds too.
    """
    input_size = Database.TIMESTAMP

    @classmethod
    def from_datetime(cls, dt):
        return Oracle_datetime(
            dt.year, dt.month, dt.day,
            dt.hour, dt.minute, dt.second, dt.microsecond,
        )