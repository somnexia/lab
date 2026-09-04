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

## Local setup (Windows / Linux)

1. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Create local env file (never commit it):

   ```bash
   cp .env.local.example .env.local
   ```

3. Edit `.env.local`:

   | Variable | Local value |
   |----------|-------------|
   | `MYSQL_HOST` | `127.0.0.1` (not the Coolify internal hostname) |
   | `MYSQL_PORT` | `3306` (or your forwarded port) |
   | `MYSQL_USER` | user you created in MySQL |
   | `MYSQL_PASSWORD` | your local password |
   | `MYSQL_DATABASE` | `btc` |

4. Create DB and table (`schema.sql`) in local MySQL or phpMyAdmin.

5. Run from project root:

   ```bash
   python src/main.py
   ```

`.env.local` overrides `.env` when both exist. On Coolify only dashboard env vars are used (`.env.local` is not in the image).

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
