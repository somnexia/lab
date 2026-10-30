FROM python:3.11-slim

WORKDIR /btc-price-script

RUN apt-get update \
    && apt-get install -y --no-install-recommends cron \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN crontab cronjob \
    && touch /var/log/cron.log

CMD ["sh", "-c", "cron && tail -f /var/log/cron.log"]
