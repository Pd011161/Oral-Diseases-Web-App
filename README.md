# Oral Diseases Web App

A web application for detecting and managing oral diseases using deep learning (YOLOv8), with support for image upload, analysis, and user-friendly management.

---

## 📚 Project Description

This project provides a web interface for users to upload oral images and automatically detect diseases such as **Leukoplakia, Lichen planus, Candidiasis, Other White Lesions,** and **Ulcer** using state-of-the-art YOLO models.  
It also allows for convenient log management, image history, and usage for clinics or research.

---

## 🚀 Features

- **Oral Disease Detection**: Upload an image and receive predictions with highlighted bounding boxes.
- **Multiple Disease Classes**: Detects Leukoplakia, Lichen planus, Candidiasis, Other White Lesions, and Ulcer.
- **Modern UI**: Responsive, easy-to-use interface built with React & Tailwind CSS.
- **Attendance & Image Management**: View, search, edit, and delete historical records.
- **API Integration**: FastAPI backend for image analysis and data storage.
- **Security**: Basic validation and CORS configuration.
- **Multi-platform**: Usable on desktop and mobile devices.

---

## 🖥️ Tech Stack

- **Frontend:** React, Next.js, Tailwind CSS
- **Backend:** FastAPI (Python)
- **Deep Learning:** YOLOv8
- **Database:** SQLite (for attendance/image logs)
- **Deployment:** Docker, Uvicorn, Node.js
- **Other:** OpenCV, Pandas

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/oral-diseases-webapp.git
cd oral-diseases-webapp
```

### 2. Setup Docker

```bash
docker build -t oral-yolo-backend .
docker run -p 8000:8000 oral-yolo-backend
```
---

## 📦 How to Use

**1.Start the backend (FastAPI):** Make sure port 8000 is available.

**2.Start the frontend (Next.js):** App will run at http://localhost:3000.

**3.Upload an oral image or snapshot oral image on webcam** via the web UI.

**4.Review prediction results** with bounding boxes and disease labels.

---

## 📁 Project Structure

```bash
oral-diseases-web-app/
├── backend/
│   ├── app/
│   │   └── api.py
│   ├── models/
│   │   └── yolov8.pt
│   ├── data/
│   │   └── pattern.csv
│   ├── attendance.db
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   └── page.tsx
│   ├── components/
│   ├── public/
│   ├── styles/
│   ├── tailwind.config.js
│   └── next.config.js
├── .gitignore
├── README.md
└── docker-compose.yml
```
---

## 🧑‍💻 Example Usage

1. Collecting and Managing Images
- Upload an image for detection.
- Images are automatically saved and logged in the database.
- Use the management page to edit the name, review detection results, or delete an entry.

2. Real-time Attendance Logging
- For each upload, logs are generated with name, date, time, and location.
- Attendance records can be viewed, searched, or exported.

3. Disease Detection
- After uploading, results show detected disease regions with bounding boxes and confidence scores.

---

## 📝 Notes
- Make sure YOLO model weights are placed in backend/models/.
- Default database is SQLite, but you can swap it out for another by modifying the backend.
- For best accuracy, use high-quality oral images.
- Ensure backend and frontend run on compatible ports and allow CORS.

---

## ⚡ Quick Summary
Oral Diseases Web App is an end-to-end solution for automatic detection and management of oral diseases using deep learning.
With a modern UI, real-time analysis, and easy record-keeping, it's ideal for clinics, research, and education.

