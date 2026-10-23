from config import API_URL
from discord_sender import send_to_discord
from logger import log_error, log_info
from repository import save_price
from service import fetch_data


def main():
    try:
        data = fetch_data(API_URL)
        price = data.get("bitcoin", {}).get("eur")

        if price is None:
            raise ValueError("BTC price in EUR not found in API response")

        save_price(price)
        send_to_discord(f"BTC price: {price} EUR")
        log_info(f"BTC price saved and sent: {price} EUR")

    except Exception as e:
        log_error(str(e))


if __name__ == "__main__":
    main()
