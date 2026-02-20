# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy backend requirements and install dependencies
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend ./backend

# Set environment variables
ENV PYTHONPATH=/app/backend

# Expose port (Railway sets $PORT at runtime)
EXPOSE 8000

# Default command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "$PORT"]
