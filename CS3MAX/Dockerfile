FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System deps (optional, kept minimal). Uncomment for MySQL/Postgres native drivers if needed.
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     libpq-dev \
#     default-libmysqlclient-dev \
#   && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

# Collect static for production-style serving.
RUN python manage.py collectstatic --noinput || true

EXPOSE 8000

# For local docker compose we keep it simple (gunicorn for production; runserver for dev).
CMD ["gunicorn", "greeting_project.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2"]
