FROM python:3.8-slim

RUN apt-get update && apt-get install -y \
    libgl1

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5001

CMD ["python", "app.py"]
