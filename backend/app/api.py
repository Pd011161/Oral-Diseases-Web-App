from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import cv2, numpy as np, base64, os, torch, pandas as pd, io, json
from ultralytics import YOLO

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"]
)
MODEL_PATHS = {"yolov8": "./model/yolov8.pt"}
device = 'mps' if torch.backends.mps.is_available() else 'cpu'

# Load pattern table on startup (ไม่ต้องโหลดใหม่ทุก request)
pattern_path = "data/Diagnistic_Oral_Disease_Pattern_01.csv"  # เปลี่ยน path ให้ตรงไฟล์จริง
df_pattern = pd.read_csv(pattern_path)

def cal_fault3(df_feature_score, df_pattern):
    df_export = df_feature_score.copy()
    df_pattern['behavior'] = df_pattern['behavior'].str.lower().str.strip()
    for fault in df_pattern['fault'].unique():
        df_export[f'fault_{fault}'] = 0
        for c in df_feature_score.columns[0:]:
            df_export[f'{c}_{fault}'] = df_export[c]
            sum_weight = sum(df_pattern[(df_pattern['fault'] == fault)]['weight'])
            weight_percent = 0
            if sum_weight > 0:
                weight_percent = df_pattern[(df_pattern['fault'] == fault) & (df_pattern['behavior'] == c)]['weight'].iloc[0]/sum_weight
            df_export[f'fault_{fault}'] = df_export[f'fault_{fault}'] + df_export[f'{c}_{fault}'] * (weight_percent)
    return df_export

@app.post("/diagnose")
async def diagnose(
    file: UploadFile = File(...),
    model_name: str = Form(...),
    feature_score: str = Form(...)
):
    # Load model
    if model_name not in MODEL_PATHS:
        return JSONResponse({"error": "Model not found"}, status_code=400)
    model_path = MODEL_PATHS[model_name]
    img_bytes = await file.read()
    model = YOLO(model_path)
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    result = model(img, verbose=False, device=device)
    info = []
    cs_list, conf_list = [], []

    # YOLO Detect
    for r in result:
        for box in r.boxes:
            b = box.xyxy[0]
            x, y, x1, y1 = map(int, b)
            cls = int(box.cls)
            confidence = round(float(box.conf), 2)
            label = model.names[cls]
            cs_list.append(label.lower())
            conf_list.append(confidence)
            # วาดกรอบ (เหมือนเดิม)
            color = (0, 255, 0)
            cv2.rectangle(img, (x, y), (x1, y1), color, 2)
            cv2.putText(img, f"{label} {confidence}", (x, y-5), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
            info.append({"label": label, "confidence": confidence})

    _, img_encoded = cv2.imencode('.jpg', img)
    img_base64 = base64.b64encode(img_encoded.tobytes()).decode('utf-8')

    # Feature Score
    # features_dict = json.loads(feature_score)
    # df_feature_score = pd.DataFrame([features_dict])
    features_dict = json.loads(feature_score)
    print("features_dict:", features_dict)  # debug
    df_feature_score = pd.DataFrame([features_dict])
    # Fix: ensure all values are numeric (int)
    for col in df_feature_score.columns:
        df_feature_score[col] = pd.to_numeric(df_feature_score[col], errors='coerce').fillna(0).astype(int)
    print("df_feature_score", df_feature_score.head())
    print("dtypes:", df_feature_score.dtypes)

    df_weight_sum_method = cal_fault3(df_feature_score, df_pattern)
    df_weight_sum_method = df_weight_sum_method[[col for col in df_weight_sum_method.columns if col.startswith('fault_')]]
    df_weight_sum_method.columns = df_weight_sum_method.columns.str.replace('fault_', '')

    # Weight sum final calculation
    end_list = []
    form_score_list = []
    for disease, conf in zip(cs_list, conf_list):
        # 1. ค่าฟอร์ม score = weight sum ตามโรค
        form_score = float(df_weight_sum_method[disease][0]) if disease in df_weight_sum_method.columns else 0
        form_score_list.append(form_score)
        # 2. รวมกับ conf (weight_sum)
        if disease in df_weight_sum_method.columns:
            val = (form_score * 0.2) + (conf * 0.8)
            end_list.append(val)
        else:
            end_list.append(conf)  # fallback

    return JSONResponse({
        "image": img_base64,
        "results": info,
        "cs_list": cs_list,
        "conf_list": conf_list,
        "form_score": form_score_list,
        "weight_sum": end_list,
        "diseases": [d for d in cs_list]
    })