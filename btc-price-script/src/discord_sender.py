import requests

from config import DISCORD_WEBHOOK


def send_to_discord(message):
    if not DISCORD_WEBHOOK:
        raise ValueError("DISCORD_WEBHOOK environment variable is not set")

    payload = {"content": message}

    response = requests.post(DISCORD_WEBHOOK, json=payload, timeout=30)
    response.raise_for_status()
