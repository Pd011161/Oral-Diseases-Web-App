"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList
} from "recharts";

// Use key --> backend, Use label display
const FEATURES = [
  { key: 'drink alcohol', label: 'Alcohol Consumption' },
  { key: 'smoking', label: 'Smoking' },
  { key: 'chew betel nut', label: 'Chew Betel Nut' },
  { key: 'eat spicy food', label: 'Spicy Food Consumption' },
  { key: 'can be wiped off', label: 'Lesion Can Be Wiped Off' },
  { key: 'no symptoms', label: 'No Symptoms' },
  { key: 'it always hurts', label: 'Persistent Pain' },
  { key: 'oral injury', label: 'Oral Injury' },
  { key: 'immune deficiency', label: 'Immune Deficiency' },
  { key: 'immunosuppression', label: 'Immunosuppression' },
  { key: 'use steroid medication', label: 'Steroid Medication Use' },
  { key: 'oral health problems', label: 'Existing Oral Health Problems' },
];

function LoadingOverlay({ show = false }: { show?: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center transition">
      <div className="flex flex-col items-center">
        <svg className="animate-spin h-12 w-12 text-blue-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <div className="mt-4 text-lg text-white font-bold animate-pulse">Processing...</div>
      </div>
    </div>
  );
}

export default function OralDiseaseFlow() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [mode, setMode] = useState<'webcam' | 'upload'>('webcam');
  const [file, setFile] = useState<File | Blob | null>(null);
  const [resultImg, setResultImg] = useState<string | null>(null);
  const [labels, setLabels] = useState<any>({});
  const [featureScore, setFeatureScore] = useState<{ [k: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"image" | "form" | "result">("image");

  // Webcam
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (mode === 'webcam') {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((s) => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        });
    } else if (videoRef.current) {
      if (videoRef.current.srcObject) {
        // @ts-ignore
        videoRef.current.srcObject.getTracks().forEach((track: any) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    }
  }, [mode]);

  // Chart data
  const barData = labels?.diseases && labels?.weight_sum
    ? labels.diseases.map((d: string, idx: number) => ({
      disease: d,
      value: Number(labels.weight_sum[idx]?.toFixed(2)) * 100,
    }))
    : [];

  // ---- Event Handlers ----
  const handleFeatureChange = (f: string, val: number) => {
    setFeatureScore(prev => ({ ...prev, [f.toLowerCase()]: val }));
  };
  const capture = () => {
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      setFile(blob);
      setStep("form");
      setResultImg(null);
      setLabels({});
    }, "image/jpeg");
  };
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStep("form");
      setResultImg(null);
      setLabels({});
    }
  };

  // Re-send submit 
  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setResultImg(null);
    setLabels({});
    const form = new FormData();
    form.append("file", file, "snap.jpg");
    form.append("model_name", "yolov8");
    form.append("feature_score", JSON.stringify(featureScore));
    const res = await fetch("http://localhost:8000/diagnose", {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    setResultImg("data:image/jpeg;base64," + data.image);
    setLabels(data);
    setLoading(false);
    setStep("result");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-sky-50 via-white to-blue-100 py-8 relative">
      <LoadingOverlay show={loading} />
      <div className="max-w-6xl mx-auto px-2 flex flex-col gap-10">
        {/* HEADER */}
        <div className="flex flex-col items-center mb-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 tracking-tight">Oral Disease Diagnosis</h1>
          <div className="text-base text-blue-600 mt-2">AI-powered oral disease risk screening</div>
        </div>
        {/* 1. Image Upload/Snap + Form */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* --- IMAGE --- */}
          <div className="rounded-2xl bg-white/95 shadow-xl p-8 flex flex-col items-center min-h-[440px]">
            <h2 className="text-2xl font-bold mb-3 tracking-wide text-gray-900 text-center">Step 1: Capture or Upload Image</h2>
            <div className="flex gap-4 mb-5">
              <button onClick={() => { setMode('webcam'); setFile(null); setStep("image"); setResultImg(null); setLabels({}); }}
                className={`px-7 py-2 rounded-full font-bold text-lg shadow transition-all border border-blue-300 ${mode === 'webcam'
                  ? 'bg-white text-blue-900 scale-110 ring-2 ring-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-blue-50'}`}>Webcam</button>
              <button onClick={() => { setMode('upload'); setFile(null); setStep("image"); setResultImg(null); setLabels({}); }}
                className={`px-7 py-2 rounded-full font-bold text-lg shadow transition-all border border-blue-300 ${mode === 'upload'
                  ? 'bg-blue-600 text-white scale-110 ring-2 ring-blue-300' : 'bg-gray-100 text-gray-600 hover:bg-blue-50'}`}>Upload</button>
            </div>
            {mode === 'webcam' ? (
              <div className="w-full flex flex-col items-center">
                <video ref={videoRef} autoPlay className="w-72 md:w-80 aspect-video rounded-xl border" />
                <button onClick={capture}
                  className="mt-3 px-8 py-2 bg-green-600 hover:bg-green-700 transition text-white rounded-full font-bold shadow-lg text-lg"
                  disabled={loading}
                >Snap</button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="block border border-blue-200 p-3 rounded-xl w-80 bg-white shadow text-base font-semibold text-gray-900 text-center mx-auto"
                  disabled={loading}
                  style={{ textAlign: "center" }}
                />
              </div>
            )}
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {file && (
              <div className="mt-3 text-green-600 font-semibold animate-pulse text-center">
                Image ready, please fill in the form &amp; submit!
              </div>
            )}
            {resultImg && (
              <div className="mt-6 w-full">
                <h3 className="font-semibold mb-2 text-gray-700">Prediction Result</h3>
                <div className="rounded-xl shadow border bg-gray-50 p-2 flex justify-center">
                  <img src={resultImg} className="rounded-xl max-h-64 object-contain" />
                </div>
              </div>
            )}
          </div>
          
          {/* --- FORM --- */}
          <div className={`rounded-2xl bg-white/95 shadow-xl p-8 min-h-[440px] flex flex-col justify-between 
            ${!file ? "opacity-50 pointer-events-none select-none" : ""}
          `}>
            <h2 className="text-2xl font-bold mb-4 tracking-wide text-gray-900 text-center">
              Step 2: Fill Health Information
            </h2>
            <div className="flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                {FEATURES.map(f => (
                  <div
                    key={f.key}
                    className="flex flex-col justify-end mb-2 w-full min-w-0 min-h-[90px]"
                  >
                    <label className="text-base font-semibold mb-1 text-gray-900 w-full">{f.label}</label>
                    <select
                      className="border border-blue-200 rounded-lg px-2 py-2 bg-gray-50 shadow-sm text-base font-semibold text-gray-800 focus:ring-2 focus:ring-blue-300 transition w-full"
                      value={featureScore[f.key] ?? 0}
                      disabled={!file}  
                      onChange={e => handleFeatureChange(f.key, Number(e.target.value))}
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
            <button
              disabled={!file || loading}
              className="mt-8 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-full font-bold shadow-lg text-lg tracking-wide"
              onClick={handleSubmit}
            >
              {step === "result" ? "Resubmit" : "Submit Form & Analyze"}
            </button>
          </div>

        </div>
        {/* 2. RESULT & CHART */}
        <div className={`mt-8 grid md:grid-cols-2 gap-6`}>
          {/* BAR CHART */}
          <div className="rounded-2xl bg-white/95 shadow-xl p-6">
            <h3 className="text-lg font-bold mb-4 text-blue-900 tracking-wide">Oral Disease Weighted Score</h3>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="disease" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1771a3">
                    <LabelList
                      dataKey="value"
                      position="top"
                      content={(props) => {
                        const { x, y, width, value } = props;
                        return (
                          <text
                            x={Number(x) + (Number(width) ? Number(width) / 2 : 0)}
                            y={y}
                            fill="#222"
                            textAnchor="middle"
                            fontSize={14}
                            // fontWeight="bold"
                            dy={-4}
                          >
                            {typeof value === "number" ? `${value.toFixed(1)}%` : value}
                          </text>
                        );
                      }}
                    />



                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400 text-center py-8">No data available</div>
            )}
          </div>
          {/* TABLE */}
          <div className="rounded-2xl bg-white/95 shadow-xl p-6 flex flex-col justify-center h-96">
            <h3 className="text-lg font-bold mb-4 text-blue-900 tracking-wide text-left">Prediction Score Table</h3>
            <div className="flex-1 flex flex-col justify-center">
              {labels?.results?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border rounded-xl shadow">
                    <thead>
                      <tr>
                        <th className="border px-4 py-2 text-blue-900 bg-blue-50">Disease</th>
                        <th className="border px-4 py-2 text-blue-900 bg-blue-50">Prediction Score</th>
                        <th className="border px-4 py-2 text-blue-900 bg-blue-50">Health Score</th>
                        <th className="border px-4 py-2 text-blue-900 bg-blue-50">Weighted Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {labels.results.map?.((l: any, idx: number) => (
                        <tr key={idx} className="hover:bg-blue-50 transition">
                          <td className="border px-2 py-1 font-semibold text-gray-900">{l.label}</td>
                          <td className="border px-2 py-1 text-right font-semibold text-gray-900">{l.confidence}</td>
                          <td className="border px-2 py-1 text-right font-semibold text-gray-900">{labels.form_score?.[idx]}</td>
                          <td className="border px-2 py-1 text-right font-semibold text-gray-900">{labels.weight_sum?.[idx]?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-400 text-center py-8">No results found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
