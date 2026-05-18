# BTC Price Bot

Fetches the current Bitcoin price in EUR, stores it in MySQL, and posts updates to Discord. Runs on a cron schedule inside Docker and deploys via Coolify.

## Requirements

- Python 3.11+
- MySQL
- Discord webhook URL
- Docker / Coolify (for production)

## Project structure

```
btc-price-script/
├── src/
│   ├── main.py
│   ├── service.py
│   ├── repository.py
│   ├── database.py
│   ├── config.py
│   ├── logger.py
│   └── discord_sender.py
├── logs/
├── requirements.txt
├── Dockerfile
├── cronjob
├── schema.sql
├── .env.example
└── README.md
```

## Local setup

1. Copy environment template:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your MySQL and Discord values.

3. Create the database table (see `schema.sql`) in phpMyAdmin or MySQL CLI.

4. Install dependencies and run once:

   ```bash
   pip install -r requirements.txt
   cd src && python main.py
   ```

## Coolify environment variables

| Variable | Example | Notes |
|----------|---------|--------|
| `API_URL` | CoinGecko URL | Optional; default is built in |
| `MYSQL_HOST` | `mysql` | Service name in Coolify, **not** `localhost` |
| `MYSQL_PORT` | `3306` | |
| `MYSQL_USER` | `root` | |
| `MYSQL_PASSWORD` | *(from Coolify)* | |
| `MYSQL_DATABASE` | `btc` | |
| `DISCORD_WEBHOOK` | `https://discord.com/api/webhooks/...` | Required |

Link the app service to the MySQL service in Coolify so the hostname resolves.

## Logs (Grafana / Loki)

Stdout uses structured prefixes for log pipelines:

```
[INFO] service=btc-bot BTC price saved and sent: 65000 EUR
[ERROR] service=btc-bot connection refused
```

In Coolify, open application logs or connect Loki/Grafana to the container log stream and filter on `service=btc-bot`.

## Cron

The container runs `cron` every minute (`cronjob` file). Cron output is appended to `/var/log/cron.log`.

## Deployment

Push to the connected Git branch; Coolify rebuilds and redeploys automatically.
