import React, { useState } from "react";
import { UserRole } from "../types";
import { Sprout, Camera, CloudRain, ShieldAlert, Sparkles, Volume2, Mic, Check, ArrowRight } from "lucide-react";

const PRESETS = [
  {
    name: "Tomato",
    symptoms: "Circular yellow patches on the outer leaf edges, turning into dark brown spots.",
    image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Mango",
    symptoms: "Black pustules on leaf margins, leaf drying, and stem cracking.",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Rice/Paddy",
    symptoms: "Grayish spindle-shaped lesions on leaves with dark borders.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"
  }
];

export default function AIFarmingAssistant() {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [customCropName, setCustomCropName] = useState("");
  const [customSymptoms, setCustomSymptoms] = useState("");
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [ttsActive, setTtsActive] = useState(false);
  const [voiceInputSim, setVoiceInputSim] = useState(false);

  // File Uploader
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runDiagnosis = async () => {
    setIsScanning(true);
    setAnalysisResult(null);

    const payload = {
      imageBase64: imageFile || selectedPreset.image,
      cropName: customCropName || selectedPreset.name,
      observedSymptoms: customSymptoms || selectedPreset.symptoms
    };

    try {
      const res = await fetch("/api/ai/crop-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  // Browser-based Voice simulation (Kisan Voice Sahayak)
  const speakAdvice = () => {
    if (!analysisResult) return;
    setTtsActive(true);
    const synth = window.speechSynthesis;
    const textToSpeak = `Namaste Kisan! I have analyzed your ${customCropName || selectedPreset.name} crop. The diagnosis indicates ${analysisResult.diagnosis} with ${analysisResult.confidence} confidence. My organic recommendation is: ${analysisResult.fertilizerRecommendation}. Please take care regarding: ${analysisResult.irrigationAdvice}. Have a healthy harvest!`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.onend = () => setTtsActive(false);
    synth.speak(utterance);
  };

  const simulateVoiceIn = () => {
    setVoiceInputSim(true);
    setTimeout(() => {
      setCustomCropName("Cotton");
      setCustomSymptoms("Reddish spots on lower leaves with microscopic insect webbing.");
      setVoiceInputSim(false);
    }, 2000);
  };

  return (
    <div className="space-y-6" id="farming-assistant-container">
      {/* Title */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
          <Sprout className="text-emerald-600 h-7 w-7 animate-bounce" /> AI Farming Assistant (Krishi Advisor)
        </h2>
        <p className="text-sm text-slate-500">
          State-of-the-art agricultural advisory: crop disease detection, organic treatments, weather suggestions, and voice companions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input parameters panel (4 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-white p-5 border border-slate-100 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <Camera className="h-4 w-4 text-emerald-600" /> Image & Symptoms Scanner
            </h3>

            {/* Presets Selectors */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-500 block">Select a crop preset to test scan:</span>
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(p);
                      setCustomCropName("");
                      setCustomSymptoms("");
                      setImageFile(null);
                    }}
                    className={`py-1.5 px-2.5 text-xs font-medium rounded-lg border transition cursor-pointer text-center ${
                      selectedPreset.name === p.name && !imageFile
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom or file upload */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500">Or capture / upload leaf image:</span>
                <button
                  type="button"
                  onClick={simulateVoiceIn}
                  className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded cursor-pointer"
                >
                  <Mic className="h-3 w-3" /> {voiceInputSim ? "Listening..." : "Voice Input"}
                </button>
              </div>

              <div className="relative border-2 border-dashed border-slate-200 hover:border-emerald-300 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Camera className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-medium text-slate-500 block">Click to select photo</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Supports leaf, crop, or soil pictures</span>
              </div>
            </div>

            {/* Text details */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Crop Name</label>
                <input
                  type="text"
                  placeholder={imageFile ? "e.g. Cotton, Apple" : selectedPreset.name}
                  value={customCropName}
                  onChange={(e) => setCustomCropName(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Symptoms Description</label>
                <textarea
                  rows={3}
                  placeholder={imageFile ? "Describe what you see (spots, insects, colors)" : selectedPreset.symptoms}
                  value={customSymptoms}
                  onChange={(e) => setCustomSymptoms(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-800"
                />
              </div>
            </div>
          </div>

          <button
            onClick={runDiagnosis}
            disabled={isScanning}
            className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            {isScanning ? "AI Agronomist analyzing leaf..." : "Scan Crop Health & Advise"}
          </button>
        </div>

        {/* Results Panel (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-5 border border-slate-800 text-slate-100 flex flex-col justify-between min-h-[420px]">
          {analysisResult ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Diagnosis Result</span>
                  <h3 className="text-lg font-bold text-slate-100">{analysisResult.diagnosis}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Confidence Rating</span>
                  <span className="text-sm font-extrabold text-emerald-400">{analysisResult.confidence}</span>
                </div>
              </div>

              {/* Symptoms breakdown */}
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-semibold block">Diagnosed Symptoms</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                  {analysisResult.symptoms}
                </p>
              </div>

              {/* Key recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-xl">
                  <span className="text-xs text-emerald-400 font-semibold block mb-1">🌿 Organic Treatment Recipe</span>
                  <p className="text-xs text-emerald-200 leading-relaxed">{analysisResult.fertilizerRecommendation}</p>
                </div>

                <div className="bg-amber-950/20 border border-amber-900/40 p-3 rounded-xl">
                  <span className="text-xs text-amber-400 font-semibold block mb-1">💧 Irrigation Action</span>
                  <p className="text-xs text-amber-200 leading-relaxed">{analysisResult.irrigationAdvice}</p>
                </div>
              </div>

              {/* Weather & impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                <div className="flex items-start gap-2.5 bg-slate-800/30 p-3 rounded-xl border border-slate-800/50">
                  <CloudRain className="h-5 w-5 text-sky-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-slate-300 block">Met/Weather Tip</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{analysisResult.weatherActionable}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-800/30 p-3 rounded-xl border border-slate-800/50">
                  <ShieldAlert className="h-5 w-5 text-rose-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-slate-300 block">Projected Yield Impact</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{analysisResult.yieldImpact}</p>
                  </div>
                </div>
              </div>

              {/* Audio synthesis voice command */}
              <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs text-slate-400">Voice Assistant is ready</span>
                </div>
                <button
                  type="button"
                  onClick={speakAdvice}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition ${
                    ttsActive ? "bg-emerald-500 text-slate-900" : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                  }`}
                >
                  <Volume2 className="h-4 w-4" />
                  {ttsActive ? "Speaking advice..." : "Listen to advice in Voice"}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
              {isScanning ? (
                <div className="space-y-3">
                  <div className="relative h-16 w-16 mx-auto">
                    <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <Sprout className="absolute inset-0 m-auto h-7 w-7 text-emerald-400 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200">Krishi AI Engine scanning photo</h4>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Comparing symptoms against regional disease registries using Gemini model diagnostics...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-14 w-14 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
                    <Sprout className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Awaiting Crop Diagnosis Input</h4>
                    <p className="text-xs text-slate-400 max-w-sm mt-1 mx-auto leading-relaxed">
                      Select any crop on the left or upload a customized plant image, then press the advisor button to run full AI crop diagnostics.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
