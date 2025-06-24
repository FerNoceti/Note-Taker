import os

from dotenv import load_dotenv

load_dotenv()


class DBConfig:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://challenge:challenge@localhost:5433/challenge-db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
