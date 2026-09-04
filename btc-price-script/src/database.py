import mysql.connector

from config import (
    MYSQL_DATABASE,
    MYSQL_HOST,
    MYSQL_PASSWORD,
    MYSQL_PORT,
    MYSQL_USER,
)


def get_connection():
    missing = [
        name
        for name, value in (
            ("MYSQL_HOST", MYSQL_HOST),
            ("MYSQL_USER", MYSQL_USER),
            ("MYSQL_PASSWORD", MYSQL_PASSWORD),
            ("MYSQL_DATABASE", MYSQL_DATABASE),
        )
        if not value
    ]
    if missing:
        raise ValueError(
            f"Missing env: {', '.join(missing)}. "
            "Create .env.local from .env.local.example for local runs."
        )

    return mysql.connector.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DATABASE,
    )
