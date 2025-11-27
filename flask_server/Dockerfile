
FROM tensorflow/tensorflow:2.13.0


WORKDIR /app


COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt


COPY . .


EXPOSE 5001


CMD ["python", "app.py"]
