import os

API_URL = os.environ.get(
    "API_URL",
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur",
)

MYSQL_HOST = os.environ.get("MYSQL_HOST")
MYSQL_PORT = int(os.environ.get("MYSQL_PORT", "3306"))
MYSQL_USER = os.environ.get("MYSQL_USER")
MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD")
MYSQL_DATABASE = os.environ.get("MYSQL_DATABASE")

DISCORD_WEBHOOK = os.environ.get("DISCORD_WEBHOOK")
