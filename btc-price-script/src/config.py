import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent


def _load_env_files() -> None:
    """Load .env then .env.local (local overrides). Skipped if python-dotenv missing."""
    try:
        from dotenv import load_dotenv
    except ImportError:
        return

    env_file = PROJECT_ROOT / ".env"
    local_env_file = PROJECT_ROOT / ".env.local"

    if env_file.exists():
        load_dotenv(env_file, override=False)

    if local_env_file.exists():
        load_dotenv(local_env_file, override=True)


_load_env_files()

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
