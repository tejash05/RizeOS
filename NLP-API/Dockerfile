FROM python:3.10-slim

WORKDIR /app

COPY . /app

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    python -m nltk.downloader stopwords wordnet omw-1.4

EXPOSE 6000

CMD ["python", "app.py"]
