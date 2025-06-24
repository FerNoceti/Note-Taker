import datetime
import time

from app import db

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

start_time = time.time()


def calculate_uptime():
    current_time = time.time()
    uptime_seconds = current_time - start_time
    return str(datetime.timedelta(seconds=int(uptime_seconds)))


def check_db_connection():
    try:
        result = db.session.execute(text('SELECT 1'))
        return result.scalar() == 1
    except SQLAlchemyError as e:
        return False
