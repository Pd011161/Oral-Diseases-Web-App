# 🦷 Oral Diseases Web App

🎬 Demo Video

[![Watch the demo](https://img.youtube.com/vi/JOHIZm7slEk/hqdefault.jpg)](https://youtu.be/JOHIZm7slEk)

A full-stack web application for **automatic oral disease detection and case review** using deep learning (YOLOv8), combined with clinical input forms for more accurate scoring.  
Upload intraoral images, fill out a clinical form, receive weighted AI predictions with bounding boxes, and review case history and statistics — all in a modern, user-friendly interface.

Detects: **Leukoplakia, Lichen planus, Candidiasis, Other White Lesions,** and **Ulcer**.  
Designed for clinics, research, and educational purposes.

---

## 🚀 Features

- **Oral Disease Detection**: Upload oral images and get instant detection results with highlighted regions and disease labels.
- **Patient/Case Clinical Form**: Enter patient name, demographics, and oral findings (via checklist/form) before image submission. The clinical input is combined with AI predictions for a final weighted result.
- **Integrated Scoring**: The system calculates the final diagnosis by combining manual input from the form with model predictions.
- **Image Results Table**: View a table of all previously analyzed images, including clinical details, result, and timestamp.
- **Statistics Dashboard**: Visualize disease distribution via charts (Pie/Bar Chart) summarizing detection frequencies.
- **Modern UI**: Responsive Next.js & Tailwind CSS frontend with “Upload”, “History”, and “Summary” tabs.
- **API Integration**: FastAPI backend serving YOLOv8 inference and database management.
- **Secure and Reliable**: Input validation, CORS configuration, Docker-based deployment.
- **Mobile & Desktop Ready**: Works on any device.

---

## 🖥️ Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS, Chart.js (for graphs)
- **Backend:** FastAPI (Python 3)
- **Deep Learning:** YOLOv8 (Ultralytics)
- **Database:** SQLite (image/case logs)
- **Deployment:** Docker, Uvicorn
- **Utilities:** OpenCV, Pandas

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
# Clone this repository
git clone https://github.com/yourusername/oral-diseases-webapp.git

# Move into the project directory
cd oral-diseases-webapp
```

### 2. Setup Docker

```bash
# Build the Docker images
docker compose build

# Start the containers in detached mode
docker compose up -d
```
---

## 📦 How to Use

- Go to the Upload tab:
Upload an oral image (or capture with webcam), then fill out the patient/case form (name, demographics, oral findings).

- View results:
The system combines clinical input from the form with model prediction to provide a weighted diagnosis and highlight detected regions.

- Review history:
The “History” tab shows a table of all past results, including both manual and AI input data (for review only).

- Analyze statistics:
The “Summary” tab shows graphical statistics of disease cases (Pie/Bar Chart).

---

## 📁 Project Structure

```bash
Oral-Diseases-Web-App/
├── backend/
│   ├── app/
│   │   ├── api.py
│   │   └── ... (other backend modules)
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

1. **Uploading and Analyzing an Image:**  
   - Upload an intraoral image (or capture with webcam).
   - Click “Submit” to run the detection.
   - The system analyzes the image with YOLOv8 and immediately combines the form input with the model’s output to generate a **weighted diagnosis**.
   - The result shows: the uploaded image with bounding boxes, detected disease class, confidence score, and the combined final result.
     
2. **Filling the Patient/Case Form:**  
   - Navigate to the “Upload” tab.
   - Enter required information: patient or case name, age, sex, and check oral findings or symptoms as prompted by the form (e.g., lesion type, appearance).
   - This information will be used together with the AI prediction.

3. **Reviewing Case History:**  
   - Go to the “History” tab.
   - Review all previously analyzed cases in a table: you’ll see patient/case name, date/time, model prediction, and clinical input.
   - This table is view-only (cannot search or delete).

4. **Visualizing Disease Statistics:**  
   - Switch to the “Summary” tab.
   - See real-time graphs (Pie Chart / Bar Chart) showing the distribution of detected disease classes across all cases.
     
---

## 📝 Notes

- YOLOv8 weights: Place your trained model (*.pt) in backend/models/.
- Database: Default is SQLite (backend/attendance.db). Can be swapped for another DB.
- Charts: Disease statistics are automatically updated as new cases are added.
- Form Data: Manual form input is integrated with AI results for better accuracy.
- CORS: Make sure backend and frontend ports are correctly configured.
- Image Quality: High-resolution images produce more accurate results.

---

## ⚡ Quick Summary
Oral Diseases Web App is an AI-powered tool for oral disease screening and case review, integrating clinical form input and automated analysis.
Ideal for clinics, researchers, and educators seeking reliable, automated diagnosis with transparent, auditable results and real-time statistics.
