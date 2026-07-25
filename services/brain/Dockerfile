FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app
ENV BRAIN_DATA_ROOT=/data
ENV BRAIN_HOST=0.0.0.0
ENV BRAIN_PORT=8090
EXPOSE 8090
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8090"]
