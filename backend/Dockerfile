FROM python:3.9-slim

# ติดตั้ง libGL และ libglib2.0-0
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0

# Set work directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

RUN pip install --upgrade pip
# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Expose port (FastAPI default)
EXPOSE 8000

# Command to run API (แก้ชื่อไฟล์ตามของจริง)
CMD ["uvicorn", "app.api:app", "--host", "0.0.0.0", "--port", "8000"]
