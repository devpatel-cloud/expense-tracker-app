FROM python:3.12-slim

# Set Working Directory
WORKDIR /app

# Copy Requirements
COPY requirements.txt .

# Install Dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy Full Project
COPY . .

# Expose FastAPI Port
EXPOSE 8000

# Start FastAPI Application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]