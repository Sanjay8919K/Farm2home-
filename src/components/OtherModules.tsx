import React, { useState, useEffect } from "react";
import { UserRole, ForumPost, WalletTransaction, Order, Product } from "../types";
import { PLATFORM_BLUEPRINTS, MOCK_LOANS, LEARNING_VIDEOS } from "../data";
import {
  TrendingUp, Award, Box, DollarSign, Send, ArrowRight, ShieldCheck, Map, Truck,
  HelpCircle, Video, Search, ChevronRight, CheckCircle2, Sparkles, BookOpen, Clock, Globe, FileText,
  QrCode, Camera, RefreshCw, Copy, Check
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from "recharts";

// ========================================================
// 1. AI BUSINESS ASSISTANT
// ========================================================
interface AIBusinessAssistantProps {
  profileLocation?: string;
}

export function AIBusinessAssistant({ profileLocation = "Nashik Mandi" }: AIBusinessAssistantProps) {
  const [productCategory, setProductCategory] = useState("Vegetables");
  const [monthlySales, setMonthlySales] = useState("120");
  const [currentInventory, setCurrentInventory] = useState("45");
  const [localRegion, setLocalRegion] = useState(profileLocation);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    if (profileLocation) {
      setLocalRegion(profileLocation);
    }
  }, [profileLocation]);

  const getBusinessAnalysis = async () => {
    setIsAnalyzing(true);
    setReport(null);
    try {
      const res = await fetch("/api/ai/business-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productCategory, monthlySales, currentInventory, localRegion })
      });
      const data = await res.json();
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6" id="business-assistant-view">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
          <TrendingUp className="text-emerald-600 h-7 w-7" /> AI Business Assistant (Gramin Vyapaar)
        </h2>
        <p className="text-sm text-slate-500">
          Smart insights to grow your business: dynamic pricing, inventory optimization, and regional demand forecasting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white p-5 border border-slate-100 rounded-2xl space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm">Enter Local Business Metrics</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Product Category</label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
              >
                <option value="Vegetables">Organic Vegetables</option>
                <option value="Fruits">Fresh Fruits</option>
                <option value="Spices">Spices & Powders</option>
                <option value="Handicrafts">Artisanal Handicrafts</option>
                <option value="Handloom Saree">Premium Silk Weaves</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Monthly Sales Volume (units)</label>
              <input
                type="number"
                value={monthlySales}
                onChange={(e) => setMonthlySales(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Current Inventory level</label>
              <input
                type="number"
                value={currentInventory}
                onChange={(e) => setCurrentInventory(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Local Mandi / Market Reference</label>
              <input
                type="text"
                value={localRegion}
                onChange={(e) => setLocalRegion(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={getBusinessAnalysis}
            disabled={isAnalyzing}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            {isAnalyzing ? "AI Consulting Report loading..." : "Generate Business Growth Advisory"}
          </button>
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between min-h-[350px]">
          {report ? (
            <div className="space-y-4 animate-fade-in text-slate-700">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Vyapaar AI Forecast</span>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed italic">
                  "{report.demandForecast}"
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                <span className="text-xs font-semibold text-emerald-800 block">💡 Smart Dynamic Pricing Suggestion</span>
                <p className="text-xs text-emerald-700 mt-1 leading-relaxed">{report.smartPricing}</p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-800 block">🚀 Recommended Growth Strategy Roadmap</span>
                <ul className="space-y-2">
                  {report.growthStrategies?.map((s: string, idx: number) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 bg-slate-50 p-2 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                <span className="font-semibold text-slate-500 block">Competitor & Mandi Arbitrage Insights:</span>
                <p className="mt-1 leading-relaxed">{report.competitorInsights}</p>
              </div>
            </div>
          ) : (
            <div className="my-auto text-center space-y-3">
              <div className="h-12 w-12 bg-slate-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-lg">
                📈
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">No Advisory Report Generated Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1 mx-auto leading-relaxed">
                  Enter your monthly metrics on the left, then click analyze to query Gemini model dynamic business forecasts tailored to local mandis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================================
// 2. AI BRANDING STUDIO
// ========================================================
interface AIBrandingStudioProps {
  profileLocation?: string;
}

export function AIBrandingStudio({ profileLocation = "Rajasthan" }: AIBrandingStudioProps) {
  const [businessType, setBusinessType] = useState("Farm2Home Platform");
  const [productDetails, setProductDetails] = useState("A direct farm-to-table supply chain platform bridging smallholder Indian farmers and conscious urban homes, focusing on trust, community, and rural empowerment.");
  const [stateOrigin, setStateOrigin] = useState("National / Rural India");
  const [language, setLanguage] = useState("English");
  const [isGenerating, setIsGenerating] = useState(false);
  const [brandingResult, setBrandingResult] = useState<any>(null);

  useEffect(() => {
    if (profileLocation && businessType !== "Farm2Home Platform") {
      setStateOrigin(profileLocation);
    }
  }, [profileLocation]);

  const applyPreset = (type: string) => {
    if (type === "farm2home") {
      setBusinessType("Farm2Home Platform");
      setProductDetails("A direct farm-to-table supply chain platform bridging smallholder Indian farmers and conscious urban homes, focusing on trust, community, and rural empowerment.");
      setStateOrigin("National / Rural India");
    } else if (type === "pickle") {
      setBusinessType("Handmade Mango Pickle");
      setProductDetails("Chemical-free sour mango pickle spiced with traditional Rajasthani oil-rich spices.");
      setStateOrigin(profileLocation || "Rajasthan");
    } else if (type === "handloom") {
      setBusinessType("Pure Handloom Saree");
      setProductDetails("Exquisite, authentic handwoven silk sarees created by master village weavers on traditional wooden looms.");
      setStateOrigin("Varanasi, UP");
    }
    setBrandingResult(null);
  };

  const generateBranding = async () => {
    setIsGenerating(true);
    setBrandingResult(null);
    try {
      const res = await fetch("/api/ai/branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessType, productDetails, stateOrigin, language })
      });
      const data = await res.json();
      setBrandingResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6" id="branding-studio-view">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
          <Sparkles className="text-amber-600 h-7 w-7" /> AI Branding Studio
        </h2>
        <p className="text-sm text-slate-500">
          Professional micro-branding in seconds: automatic premium brand names, slogan taglines, packaging layout details, label text, social media campaigns, and custom vector logos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white p-5 border border-slate-100 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 text-sm">Product Specifications</h3>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block w-full mb-1">Select Preset:</span>
            <button
              type="button"
              onClick={() => applyPreset("farm2home")}
              className={`px-2 py-1 text-[10px] rounded-lg font-bold border transition cursor-pointer ${businessType === "Farm2Home Platform" ? "bg-amber-100 text-amber-900 border-amber-300" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"}`}
            >
              🌱 Farm2Home Platform
            </button>
            <button
              type="button"
              onClick={() => applyPreset("pickle")}
              className={`px-2 py-1 text-[10px] rounded-lg font-bold border transition cursor-pointer ${businessType === "Handmade Mango Pickle" ? "bg-amber-100 text-amber-900 border-amber-300" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"}`}
            >
              🥭 Mango Pickle
            </button>
            <button
              type="button"
              onClick={() => applyPreset("handloom")}
              className={`px-2 py-1 text-[10px] rounded-lg font-bold border transition cursor-pointer ${businessType === "Pure Handloom Saree" ? "bg-amber-100 text-amber-900 border-amber-300" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"}`}
            >
              🧣 Silk Saree
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Product / Business Type</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                placeholder="e.g. Pure Silk Saree, Ghee"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Product Details & Tradition</label>
              <textarea
                rows={3}
                value={productDetails}
                onChange={(e) => setProductDetails(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                placeholder="Describe your craft, materials, or farm ingredients"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Origin State/Region</label>
                <input
                  type="text"
                  value={stateOrigin}
                  onChange={(e) => setStateOrigin(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Response Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi / हिंदी</option>
                  <option value="Tamil">Tamil / தமிழ்</option>
                  <option value="Telugu">Telugu / తెలుగు</option>
                  <option value="Marathi">Marathi / मराठी</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={generateBranding}
            disabled={isGenerating}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? "AI Creative Director designing..." : "Launch Generative Studio"}
          </button>
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between min-h-[380px]">
          {brandingResult ? (
            <div className="space-y-4 animate-fade-in text-slate-700">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                {brandingResult.simulatedLogoSvg ? (
                  <div
                    className="w-20 h-20 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center shrink-0 p-1"
                    dangerouslySetInnerHTML={{ __html: brandingResult.simulatedLogoSvg }}
                  />
                ) : (
                  <div className="w-20 h-20 bg-amber-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    🏷️
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-amber-800">{brandingResult.brandName}</h3>
                  <p className="text-xs text-slate-500 italic mt-0.5">"{brandingResult.tagline}"</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <span className="text-xs font-bold text-slate-800 block mb-1">📦 Eco-Packaging Structure</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{brandingResult.packagingConcept}</p>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <span className="text-xs font-bold text-slate-800 block mb-1">🏷️ Physical Label Copy</span>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{brandingResult.productLabelText}</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl">
                <span className="text-xs font-bold text-amber-800 block mb-1">📱 Ready Social Launch Campaign</span>
                <p className="text-xs text-amber-900 leading-relaxed whitespace-pre-line">{brandingResult.marketingPost}</p>
              </div>
            </div>
          ) : (
            <div className="my-auto text-center space-y-3">
              <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto text-lg animate-pulse">
                🏷️
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Awaiting Creative Blueprint</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1 mx-auto leading-relaxed">
                  Provide your product traditional background, hit register on the studio form, and let Gemini craft complete brand packages, slogans, and SVGs instantly.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================================
// 3. SMART LOGISTICS NETWORK
// ========================================================
export function SmartLogisticsNetwork() {
  const [pickupScheduled, setPickupScheduled] = useState(false);
  const [optRoute, setOptRoute] = useState(false);

  return (
    <div className="space-y-6" id="logistics-network-view">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
          <Truck className="text-emerald-600 h-7 w-7" /> Smart Logistics Network
        </h2>
        <p className="text-sm text-slate-500">
          Last-mile delivery and cold storage logistics synchronization. Optimize carrier routing, reduce perishability wastage, and track deliveries in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-100 rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-slate-800 text-sm">Schedule On-Farm Pickup</h3>
            <p className="text-xs text-slate-500">
              Arrange for a regional collection truck to pick up harvested fresh produce from your local center.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Pickup Date</label>
                <input type="date" className="w-full text-xs bg-slate-50 border border-slate-200 p-2 rounded focus:outline-none" defaultValue="2026-06-30" />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Crop Type</label>
                <input type="text" className="w-full text-xs bg-slate-50 border border-slate-200 p-2 rounded focus:outline-none" defaultValue="Mangoes" />
              </div>
            </div>

            <button
              onClick={() => {
                setPickupScheduled(true);
                setTimeout(() => setPickupScheduled(false), 3000);
              }}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              {pickupScheduled ? "✓ Scheduled Successfully" : "Schedule Carrier Pickup"}
            </button>
          </div>

          {/* Route optimization trigger */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-slate-800 text-sm">AI Route Optimization</h3>
            <p className="text-xs text-slate-500">
              Calculate the most carbon-efficient path from the local cluster hub to city wholesalers, saving transport costs.
            </p>
            <button
              onClick={() => setOptRoute(!optRoute)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              {optRoute ? "Reset Optimization" : "Optimize Delivery Path"}
            </button>
          </div>

          {/* Cold storage temp ledger */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 space-y-2">
            <h3 className="font-semibold text-slate-800 text-sm">Cold Chain Telemetry (Storage #3)</h3>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { time: "08:00", temp: 4.2 },
                  { time: "10:00", temp: 4.1 },
                  { time: "12:00", temp: 4.5 },
                  { time: "14:00", temp: 4.3 },
                  { time: "16:00", temp: 4.2 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="temp" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <span className="text-[9px] text-emerald-600 block text-center font-semibold animate-pulse">● TEMPERATURE STABLE AT 4.2°C</span>
          </div>
        </div>

        {/* Map simulation (7 cols) */}
        <div className="lg:col-span-7 bg-slate-100 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between min-h-[400px] relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-200/50 flex flex-col justify-between p-4">
            {/* Header indicator */}
            <div className="bg-white/90 backdrop-blur-xs p-3 border border-slate-300 rounded-xl shadow-xs z-10 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">ACTIVE SHIPMENT TRACKER</span>
                <span className="text-xs font-bold text-slate-800">Route #Nashik-Mumbai B2B Direct</span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">In Transit</span>
            </div>

            {/* Simulated Road Path */}
            <div className="my-auto h-40 relative flex items-center justify-center">
              <svg viewBox="0 0 400 200" className="w-full h-full max-w-sm">
                {/* Simulated route line */}
                <path
                  d="M 50 150 Q 150 50 250 120 T 350 50"
                  fill="none"
                  stroke={optRoute ? "#10b981" : "#94a3b8"}
                  strokeWidth="6"
                  strokeLinecap="round"
                  className={optRoute ? "stroke-dasharray-anim" : ""}
                />
                
                {/* Nashik Hub Point */}
                <circle cx="50" cy="150" r="10" fill="#1e293b" />
                <text x="35" y="180" fontSize="10" fontWeight="bold" fill="#1e293b">Nashik Hub</text>

                {/* Storage Warehouse point */}
                <circle cx="220" cy="100" r="8" fill="#d97706" />
                <text x="180" y="85" fontSize="9" fontWeight="bold" fill="#d97706">Cold Storage #3</text>

                {/* Destination Mumbai */}
                <circle cx="350" cy="50" r="10" fill="#10b981" />
                <text x="310" y="35" fontSize="10" fontWeight="bold" fill="#10b981">Mumbai Store</text>

                {/* Moving carrier */}
                <circle cx={optRoute ? "220" : "110"} cy={optRoute ? "100" : "90"} r="6" fill="#ef4444" className="animate-ping" />
                <circle cx={optRoute ? "220" : "110"} cy={optRoute ? "100" : "90"} r="5" fill="#ef4444" />
              </svg>
            </div>

            {/* Bottom Metrics */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-white z-10 grid grid-cols-3 gap-2">
              <div className="text-center">
                <span className="text-[9px] text-slate-400 block uppercase">ETA</span>
                <span className="text-xs font-bold text-slate-200">{optRoute ? "2 hrs 15 mins" : "3 hrs 40 mins"}</span>
              </div>
              <div className="text-center border-x border-slate-800">
                <span className="text-[9px] text-slate-400 block uppercase">Transit Fuel Save</span>
                <span className="text-xs font-bold text-emerald-400">{optRoute ? "18.5% SAVED" : "Calculating..."}</span>
              </div>
              <div className="text-center">
                <span className="text-[9px] text-slate-400 block uppercase">Driver Contact</span>
                <span className="text-xs font-bold text-slate-200">Shambu Nath</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================================
// 4. FINANCIAL SERVICES
// ========================================================
interface FinancialServicesProps {
  walletBalance: number;
  transactions: WalletTransaction[];
  onCashOut: (amount: number, upiId: string) => Promise<void>;
  profileUpi?: string;
  onP2PTransfer?: (amount: number, peerName: string, peerUpi: string, isPayment: boolean) => Promise<void>;
  profileName?: string;
}

export function FinancialServices({ 
  walletBalance, 
  transactions, 
  onCashOut, 
  profileUpi = "",
  onP2PTransfer,
  profileName = "Sanjay Korrakuti"
}: FinancialServicesProps) {
  const [cashOutAmt, setCashOutAmt] = useState("");
  const [upiId, setUpiId] = useState(profileUpi);
  const [msg, setMsg] = useState("");

  // P2P QuickPay States
  const [p2pTab, setP2pTab] = useState<"scan" | "generate">("scan");
  
  // Generate QR states
  const [qrAmount, setQrAmount] = useState("");
  const [qrNote, setQrNote] = useState("");
  const [receivedSimMsg, setReceivedSimMsg] = useState("");

  // Scan QR states
  const [scanStream, setScanStream] = useState<MediaStream | null>(null);
  const [scanActive, setScanActive] = useState(false);
  const [scannedPeer, setScannedPeer] = useState<{ name: string; upi: string; amount?: number; note?: string } | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payNote, setPayNote] = useState("");
  const [payStatusMsg, setPayStatusMsg] = useState("");
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any | null>(null);

  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (profileUpi) {
      setUpiId(profileUpi);
    }
  }, [profileUpi]);

  useEffect(() => {
    if (scanActive) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          setScanStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn("Camera not accessible or permission denied. Mock simulation mode is active.", err);
          setPayStatusMsg("Notice: Camera stream blocked or not found. Please use simulation controls.");
        });
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [scanActive]);

  const stopCamera = () => {
    if (scanStream) {
      scanStream.getTracks().forEach((track) => track.stop());
      setScanStream(null);
    }
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashOutAmt || !upiId) {
      setMsg("Please provide cashout amount and UPI address.");
      return;
    }
    const amount = Number(cashOutAmt);
    if (amount <= 0 || amount > walletBalance) {
      setMsg("Invalid cashout amount.");
      return;
    }

    try {
      await onCashOut(amount, upiId);
      setMsg("Withdrawal processed successfully!");
      setCashOutAmt("");
      setUpiId("");
    } catch (err: any) {
      setMsg("Failed: " + err.message);
    }
  };

  // P2P Payment Actions
  const handleP2PSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedPeer) return;
    
    const amount = Number(payAmount || scannedPeer.amount);
    if (isNaN(amount) || amount <= 0) {
      setPayStatusMsg("Please enter a valid payment amount.");
      return;
    }

    if (amount > walletBalance) {
      setPayStatusMsg("Insufficient balance in your Farm2Home wallet.");
      return;
    }

    setIsProcessingPay(true);
    setPayStatusMsg("");
    try {
      if (onP2PTransfer) {
        await onP2PTransfer(amount, scannedPeer.name, scannedPeer.upi, true);
        setPaymentSuccess({
          txnId: "TXN-P2P-" + Math.floor(1000 + Math.random() * 9000),
          recipient: scannedPeer.name,
          upi: scannedPeer.upi,
          amount,
          date: new Date().toISOString()
        });
        setScannedPeer(null);
        setPayAmount("");
      }
    } catch (err: any) {
      setPayStatusMsg("Payment failed: " + err.message);
    } finally {
      setIsProcessingPay(false);
    }
  };

  const handleSimulateScan = (name: string, upi: string, amount?: number, note?: string) => {
    setPayStatusMsg("");
    setScannedPeer({ name, upi, amount, note });
    if (amount) {
      setPayAmount(amount.toString());
    } else {
      setPayAmount("");
    }
    if (note) {
      setPayNote(note);
    } else {
      setPayNote("");
    }
    setScanActive(false);
  };

  const handleSimulateIncomingPayment = async () => {
    const receiveAmount = qrAmount ? Number(qrAmount) : 1500;
    if (isNaN(receiveAmount) || receiveAmount <= 0) {
      setReceivedSimMsg("Please enter a valid mock requested amount first.");
      return;
    }

    setReceivedSimMsg("Processing simulator transaction...");
    try {
      if (onP2PTransfer) {
        await onP2PTransfer(receiveAmount, "Shree Balaji Exporters & Retail", "balaji@upi", false);
        setReceivedSimMsg(`Success! Simulated incoming payment of ₹${receiveAmount.toLocaleString("en-IN")} received from Shree Balaji Exporters.`);
        setTimeout(() => setReceivedSimMsg(""), 5000);
      }
    } catch (err: any) {
      setReceivedSimMsg("Simulator error: " + err.message);
    }
  };

  const dynamicQRData = JSON.stringify({
    name: profileName,
    upi: profileUpi || "kisan@upi",
    amount: qrAmount ? Number(qrAmount) : undefined,
    note: qrNote || "P2P Payment"
  });
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=12&data=${encodeURIComponent(dynamicQRData)}`;

  return (
    <div className="space-y-6" id="financial-services-view">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
          <DollarSign className="text-emerald-600 h-7 w-7" /> Financial Services & Ledger
        </h2>
        <p className="text-sm text-slate-500">
          Escrow payment clearances, transparent ledger auditing, easy UPI cashout, micro-loans, and crop insurance integration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Balances and Cashout (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-emerald-900 text-white rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <span className="text-xs font-medium text-emerald-200 block">FARM2HOME WALLET BALANCE</span>
            <span className="text-3xl font-extrabold block mt-2">₹{walletBalance.toLocaleString("en-IN")}</span>
            <span className="text-[10px] text-emerald-100/70 block mt-1">Escrow clearing instant settlements active</span>
            
            <div className="absolute right-4 bottom-4 h-12 w-12 bg-white/10 rounded-full flex items-center justify-center font-bold text-sm">
              UPI
            </div>
          </div>

          <form onSubmit={handleWithdrawal} className="bg-white border border-slate-100 rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-slate-800 text-sm">Instant UPI Payout Cashout</h3>
            
            <div className="space-y-2">
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Amount to Cashout</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={cashOutAmt}
                  onChange={(e) => setCashOutAmt(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 p-2 rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-400 mb-0.5">UPI ID Address (VPA)</label>
                <input
                  type="text"
                  placeholder="e.g. kisan@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 p-2 rounded focus:outline-none"
                />
              </div>
            </div>

            {msg && <p className="text-[11px] font-semibold text-emerald-600">{msg}</p>}

            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Transfer Funds to Bank
            </button>
          </form>

          {/* Micro loan programs list */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-slate-800 text-sm">Recommended Rural Micro-Loans</h3>
            <div className="space-y-2.5">
              {MOCK_LOANS.map((l) => (
                <div key={l.id} className="border border-slate-100 p-2.5 rounded-lg space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-slate-800">{l.provider}</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">{l.rate}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Range: {l.amount}</span>
                    <span>For: {l.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gramin P2P QuickPay Hub (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-150 rounded-2xl p-5 flex flex-col space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <QrCode className="text-emerald-600 h-4 w-4" /> Rural P2P QuickPay
              </h3>
              <span className="text-[10px] text-slate-400 block mt-0.5">Offline-ready direct QR wallet transfers</span>
            </div>
            
            <div className="bg-slate-100 p-0.5 rounded-lg flex">
              <button 
                onClick={() => { setP2pTab("scan"); setPaymentSuccess(null); }}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition cursor-pointer ${p2pTab === "scan" ? "bg-white text-emerald-800 shadow-2xs" : "text-slate-500 hover:text-slate-700"}`}
              >
                Scan Peer QR
              </button>
              <button 
                onClick={() => { setP2pTab("generate"); }}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition cursor-pointer ${p2pTab === "generate" ? "bg-white text-emerald-800 shadow-2xs" : "text-slate-500 hover:text-slate-700"}`}
              >
                My Receive QR
              </button>
            </div>
          </div>

          {/* TAB 1: SCAN QR (PAYING) */}
          {p2pTab === "scan" && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              {paymentSuccess ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 text-center space-y-3 flex-1 flex flex-col justify-center items-center animate-fade-in">
                  <div className="h-12 w-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-1 shadow-xs animate-bounce">
                    ✓
                  </div>
                  <h4 className="font-bold text-emerald-950 text-sm">P2P Payment Success!</h4>
                  <p className="text-[11px] text-emerald-800 leading-normal max-w-[240px]">
                    Successfully transferred <span className="font-bold">₹{paymentSuccess.amount.toLocaleString("en-IN")}</span> directly to the retailer's wallet escrow.
                  </p>
                  
                  <div className="bg-white/80 border border-emerald-100 rounded-lg p-3 text-left w-full text-[10px] font-mono text-slate-600 space-y-1 shadow-2xs">
                    <div><span className="font-semibold text-slate-500">TXN ID:</span> {paymentSuccess.txnId}</div>
                    <div><span className="font-semibold text-slate-500">PAID TO:</span> {paymentSuccess.recipient}</div>
                    <div><span className="font-semibold text-slate-500">UPI:</span> {paymentSuccess.upi}</div>
                    <div><span className="font-semibold text-slate-500">DATE:</span> {new Date(paymentSuccess.date).toLocaleTimeString("en-IN")}</div>
                  </div>

                  <button
                    onClick={() => setPaymentSuccess(null)}
                    className="mt-2 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg cursor-pointer transition shadow-2xs"
                  >
                    Make Another Payment
                  </button>
                </div>
              ) : scannedPeer ? (
                /* DECODED PEER - PRE-PAY CONFIRMATION SCREEN */
                <form onSubmit={handleP2PSubmit} className="space-y-3 bg-slate-50 border border-slate-150 p-4 rounded-xl animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirm P2P Payment</span>
                    <button 
                      type="button" 
                      onClick={() => setScannedPeer(null)}
                      className="text-[10px] text-slate-400 hover:text-slate-600 font-bold"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-extrabold text-sm shadow-2xs">
                        {scannedPeer.name[0]}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug">{scannedPeer.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono block leading-none mt-0.5">{scannedPeer.upi}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="block text-[9px] font-semibold text-slate-400 uppercase">Transfer Amount (₹)</label>
                        <input
                          type="number"
                          required
                          placeholder="Amount in ₹"
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                          className="w-full text-xs bg-white border border-slate-200 p-1.5 rounded font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-semibold text-slate-400 uppercase">Payment Note</label>
                        <input
                          type="text"
                          placeholder="e.g. seeds buying"
                          value={payNote}
                          onChange={(e) => setPayNote(e.target.value)}
                          className="w-full text-xs bg-white border border-slate-200 p-1.5 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600 mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {payStatusMsg && (
                    <p className="text-[10px] font-semibold text-rose-600 leading-snug bg-rose-50 px-2 py-1 rounded border border-rose-100 mt-2 animate-fade-in">
                      ⚠️ {payStatusMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isProcessingPay}
                    className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition disabled:opacity-50"
                  >
                    {isProcessingPay ? "Processing Secure Payment..." : `Proceed & Pay ₹${payAmount || "0"} Now`}
                  </button>
                </form>
              ) : (
                /* INSTRUCTION / ACTIVE SCANNING SCREEN */
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Instant, direct-wallet clearing. Scan any local mandi exporter, logistics agent, or seed retailer's QR passport to initiate an instant P2P peer transaction.
                    </p>
                  </div>

                  {/* Real video feed or simulated scanner box */}
                  <div className="relative bg-slate-950 rounded-xl overflow-hidden aspect-video border border-slate-800 flex items-center justify-center shadow-inner group">
                    {scanActive ? (
                      <>
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          className="w-full h-full object-cover transform scale-x-[-1]"
                        />
                        {/* Animated scanning box laser */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 md:w-32 md:h-32 border-2 border-dashed border-emerald-400 rounded-lg flex items-center justify-center shadow-lg relative animate-pulse">
                            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400"></span>
                            <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400"></span>
                            <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-400"></span>
                            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400"></span>
                            <div className="w-full h-0.5 bg-emerald-400 absolute top-1/2 left-0 shadow-[0_0_10px_#10b981] animate-[bounce_2s_infinite]"></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4 space-y-2">
                        <Camera className="h-8 w-8 text-slate-600 mx-auto animate-pulse" />
                        <span className="text-[11px] font-semibold text-slate-400 block">Camera Feed Offline</span>
                        <button
                          onClick={() => setScanActive(true)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer transition shadow-2xs"
                        >
                          Start Real Camera Scanner
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Scan Simulation Quick Triggers */}
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 block tracking-wider uppercase">
                      📡 Rural P2P Quick-Scanners (Demo simulation)
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSimulateScan("Mahratta Seeds & Fertilizer", "mahratta@upi", 1250, "Fertilizer purchase")}
                        className="text-left text-[10px] bg-white hover:bg-emerald-50 hover:border-emerald-200 border border-slate-100 p-2 rounded-lg transition"
                      >
                        <span className="font-bold block text-slate-700 truncate">Mahratta Fertilizer</span>
                        <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">Pay ₹1,250</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleSimulateScan("Nashik Mandi Logistics Corp", "nashiklog@upi", 4200, "Grain haulage transport")}
                        className="text-left text-[10px] bg-white hover:bg-emerald-50 hover:border-emerald-200 border border-slate-100 p-2 rounded-lg transition"
                      >
                        <span className="font-bold block text-slate-700 truncate">Mandi Logistics</span>
                        <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">Pay ₹4,200</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSimulateScan("Pune Fresh Food Retailers", "puneorganic@upi", 800, "Box packaging supply")}
                        className="text-left text-[10px] bg-white hover:bg-emerald-50 hover:border-emerald-200 border border-slate-100 p-2 rounded-lg transition"
                      >
                        <span className="font-bold block text-slate-700 truncate">Pune Food Retail</span>
                        <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">Pay ₹800</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSimulateScan("Village Cooperative Union", "coop@upi", undefined, "Direct contribution")}
                        className="text-left text-[10px] bg-white hover:bg-emerald-50 hover:border-emerald-200 border border-slate-100 p-2 rounded-lg transition"
                      >
                        <span className="font-bold block text-slate-700 truncate">Cooperative Union</span>
                        <span className="text-[9px] text-slate-500 font-medium block mt-0.5">Set Custom Amount</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY RECEIVE QR */}
          {p2pTab === "generate" && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="text-xs text-slate-500 leading-normal">
                Let local buyers, exporters, or neighboring farmers scan this QR code to transfer funds directly into your secure wallet.
              </div>

              {/* Generated QR View passport card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden animate-fade-in shadow-2xs">
                <span className="absolute left-2.5 top-2.5 text-[8px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  Gramin Secure QR
                </span>

                <div className="flex items-center gap-4 mt-3">
                  <div className="bg-white border border-slate-100 p-2.5 rounded-xl shadow-xs flex justify-center items-center">
                    <img 
                      src={qrImageSrc} 
                      alt="P2P Receive QR Code" 
                      className="h-36 w-36 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Camera Icon Button to launch scanner */}
                  <button
                    type="button"
                    onClick={() => {
                      setP2pTab("scan");
                      setScanActive(true);
                      setPaymentSuccess(null);
                    }}
                    title="Launch Scanner"
                    className="flex flex-col items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Camera className="h-6 w-6 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1">Scan QR</span>
                  </button>
                </div>

                <div className="mt-3.5 text-center space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block leading-none mb-1">{profileName}</span>
                  <span className="text-[9px] font-mono text-slate-400 block leading-none">{profileUpi || "kisan@upi"}</span>
                  {qrAmount && (
                    <span className="text-sm font-extrabold text-emerald-700 block pt-1.5 leading-none">
                      Requesting ₹{Number(qrAmount).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>

              {/* Dynamic QR Controls */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-semibold text-slate-400 uppercase mb-0.5">Request Amount (Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={qrAmount}
                    onChange={(e) => setQrAmount(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 p-1.5 rounded focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-semibold text-slate-400 uppercase mb-0.5">Request Note</label>
                  <input
                    type="text"
                    placeholder="e.g. potato load"
                    value={qrNote}
                    onChange={(e) => setQrNote(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 p-1.5 rounded focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Simulated Customer Payment triggers */}
              <div className="bg-emerald-50 border border-emerald-100/50 p-3 rounded-xl text-center space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block">
                    📲 Test QR: Simulated Buyer scan
                  </span>
                  {receivedSimMsg && (
                    <span className="text-[8px] bg-white text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-100">
                      Processing...
                    </span>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={handleSimulateIncomingPayment}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded text-[10px] cursor-pointer transition shadow-2xs"
                >
                  Simulate Buyer Scanning My QR & Paying
                </button>

                {receivedSimMsg && (
                  <p className="text-[9px] text-emerald-800 font-semibold leading-normal bg-white py-1 px-2 rounded-md border border-emerald-50 animate-fade-in">
                    {receivedSimMsg}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Ledger history (12 cols full width for deep audit visibility) */}
        <div className="lg:col-span-12 bg-white border border-slate-100 rounded-2xl p-5 flex flex-col">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Real-time Transaction Audit Ledger
              </h3>
              <span className="text-[10px] text-slate-400 block mt-0.5">Immutable transparent financial records of settlements</span>
            </div>
            <span className="text-[10px] bg-slate-100 font-semibold text-slate-600 px-2 py-1 rounded">
              Audited Ledger Mode (Safe)
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3.5 mt-4 max-h-[420px]">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-medium">
                No ledger transaction records found.
              </div>
            ) : (
              transactions.map((t) => (
                <div key={t.id} className="flex justify-between items-center border-b border-slate-50 pb-2.5 hover:bg-slate-50/50 p-1.5 rounded-lg transition">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${t.type === "credit" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
                      {t.description}
                    </h4>
                    <span className="text-[10px] text-slate-400 block font-mono mt-0.5 ml-4">
                      {t.id} • {new Date(t.date).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <span className={`text-xs font-extrabold ${t.type === "credit" ? "text-green-600" : "text-rose-500"} mr-1`}>
                    {t.type === "credit" ? "+" : "-"} ₹{t.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================================
// 5. COMMUNITY FORUM
// ========================================================
interface CommunityPlatformProps {
  profileName?: string;
  userRole?: string;
}

export function CommunityPlatform({ profileName = "Gurpreet Singh", userRole = "Farmer" }: CommunityPlatformProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Farming Tips");
  const [newContent, setNewContent] = useState("");
  const [activeTab, setActiveTab] = useState<"Forum" | "Learn">("Forum");
  const [showReplyId, setShowReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const loadForums = async () => {
    try {
      const res = await fetch("/api/forums");
      const data = await res.json();
      setPosts(data.forums);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadForums();
  }, []);

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    try {
      const res = await fetch("/api/forums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, category: newCategory, content: newContent, author: `${profileName} (${userRole})` })
      });
      await res.json();
      setNewTitle("");
      setNewContent("");
      loadForums();
    } catch (e) {
      console.error(e);
    }
  };

  const submitReply = async (postId: string) => {
    if (!replyText) return;
    try {
      const res = await fetch(`/api/forums/${postId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: `${profileName} (${userRole})`, content: replyText })
      });
      await res.json();
      setReplyText("");
      setShowReplyId(null);
      loadForums();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6" id="community-platform-view">
      <div className="flex border-b border-slate-200 gap-1 bg-slate-50/50 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab("Forum")}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "Forum" ? "bg-white text-emerald-700 shadow-sm font-semibold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <HelpCircle className="h-4 w-4" /> Discussion Forum
        </button>
        <button
          onClick={() => setActiveTab("Learn")}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "Learn" ? "bg-white text-emerald-700 shadow-sm font-semibold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Video className="h-4 w-4" /> Learning Center (Training Videos)
        </button>
      </div>

      {activeTab === "Forum" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Post box (5 cols) */}
          <form onSubmit={createPost} className="lg:col-span-5 bg-white p-5 border border-slate-100 rounded-2xl space-y-3 self-start">
            <h3 className="font-semibold text-slate-800 text-sm">Ask the Rural Community</h3>
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Discussion Title</label>
              <input
                type="text"
                placeholder="e.g. Best timing for basmati harvest?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 p-2.5 rounded focus:outline-none focus:border-emerald-500 text-slate-800 font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 p-2 rounded focus:outline-none text-slate-800"
              >
                <option value="Farming Tips">Farming Tips</option>
                <option value="Logistics">Logistics & Storage</option>
                <option value="SHG Commerce">SHG & Artisan Sales</option>
                <option value="Financial Help">Financial / Loans help</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-0.5">Your Question details</label>
              <textarea
                rows={4}
                placeholder="Explain what help you need..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 p-2 rounded focus:outline-none text-slate-800"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Post to Discussion Board
            </button>
          </form>

          {/* Posts list (7 cols) */}
          <div className="lg:col-span-7 space-y-4 max-h-[500px] overflow-y-auto">
            {posts.map((p) => (
              <div key={p.id} className="bg-white border border-slate-100 rounded-xl p-4 space-y-3 hover:border-emerald-100 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                    <h4 className="font-semibold text-slate-800 text-xs mt-1.5">{p.title}</h4>
                  </div>
                  <span className="text-[10px] text-slate-400">{p.date}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{p.content}</p>
                <div className="text-[10px] text-slate-400">Asked by: <span className="font-medium text-slate-600">{p.author}</span></div>

                {/* Replies */}
                {p.replies && p.replies.length > 0 && (
                  <div className="bg-slate-50 p-2.5 rounded-lg border-l-2 border-emerald-500 space-y-1 mt-2.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                      <span>{p.replies[0].author}</span>
                      <span className="text-slate-400 font-normal">{p.replies[0].date}</span>
                    </div>
                    <p className="text-xs text-slate-600">{p.replies[0].content}</p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                  <button
                    onClick={() => setShowReplyId(showReplyId === p.id ? null : p.id)}
                    className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
                  >
                    {showReplyId === p.id ? "Cancel Reply" : "Reply as Expert"}
                  </button>
                </div>

                {showReplyId === p.id && (
                  <div className="flex gap-2 items-center pt-2">
                    <input
                      type="text"
                      placeholder="Write your advice..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 text-xs bg-slate-50 border border-slate-200 p-2 rounded focus:outline-none text-slate-800"
                    />
                    <button
                      onClick={() => submitReply(p.id)}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold cursor-pointer"
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
          {LEARNING_VIDEOS.map((v) => (
            <div key={v.id} className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-sm transition">
              <div className="h-40 bg-slate-900 relative flex items-center justify-center text-3xl">
                📺
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {v.duration}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-semibold text-slate-800 text-xs leading-relaxed">{v.title}</h4>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>Author: {v.author}</span>
                  <span>{v.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ========================================================
// 6. MARKET INTELLIGENCE SYSTEM
// ========================================================
export function MarketIntelligence() {
  const MOCK_PRICE_TRENDS = [
    { month: "Jan", Alphonso: 420, Basmati: 65, Potato: 18 },
    { month: "Feb", Alphonso: 390, Basmati: 68, Potato: 19 },
    { month: "Mar", Alphonso: 350, Basmati: 70, Potato: 22 },
    { month: "Apr", Alphonso: 320, Basmati: 72, Potato: 25 },
    { month: "May", Alphonso: 290, Basmati: 75, Potato: 24 },
    { month: "Jun", Alphonso: 350, Basmati: 78, Potato: 28 }
  ];

  return (
    <div className="space-y-6" id="market-intel-view">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
          <BookOpen className="text-emerald-600 h-7 w-7" /> Market Intelligence & Forecasting
        </h2>
        <p className="text-sm text-slate-500">
          Real-time dynamic mandi pricing logs, demand analytics, and projected crop yield analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 p-5 rounded-2xl space-y-3">
          <h3 className="font-semibold text-slate-800 text-sm">Historical Mandi Price Index (₹/kg)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_PRICE_TRENDS}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="Alphonso" stroke="#d97706" strokeWidth={2.5} name="Alphonso Mango" />
                <Line type="monotone" dataKey="Basmati" stroke="#10b981" strokeWidth={2} name="Basmati Rice" />
                <Line type="monotone" dataKey="Potato" stroke="#6366f1" strokeWidth={1.5} name="Organic Potato" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl space-y-3">
          <h3 className="font-semibold text-slate-800 text-sm">Regional Sales Volume Demand (Monthly tons)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { region: "Mumbai", Vegetables: 450, Fruits: 320 },
                { region: "Delhi", Vegetables: 620, Fruits: 280 },
                { region: "Bangalore", Vegetables: 390, Fruits: 410 },
                { region: "Pune", Vegetables: 280, Fruits: 180 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="Vegetables" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Fruits" fill="#fb923c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================================
// 7. EXPORT MARKETPLACE
// ========================================================
export function ExportMarketplace() {
  const [certDownloaded, setCertDownloaded] = useState(false);

  return (
    <div className="space-y-6" id="export-marketplace-view">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
          <Globe className="text-emerald-600 h-7 w-7" /> Export Marketplace
        </h2>
        <p className="text-sm text-slate-500">
          Unlock global demand: onboard verified international bulk importers, access compliance checklists, and download export document templates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Importer registries (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm">International Buying Enquiries</h3>
          
          <div className="space-y-3">
            <div className="border border-slate-100 p-3.5 rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">Organic Spices</span>
                  <h4 className="font-semibold text-slate-800 text-xs mt-1">Al-Maya Group B2B wholesale Procurement</h4>
                </div>
                <span className="text-xs font-bold text-slate-800">Dubai, UAE</span>
              </div>
              <p className="text-xs text-slate-500">
                Seeking direct organic turmeric powder and dry red chillies cargo. Minimum 5 metric tons bulk packaging.
              </p>
            </div>

            <div className="border border-slate-100 p-3.5 rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">Silk Handloom</span>
                  <h4 className="font-semibold text-slate-800 text-xs mt-1">Taj Handlooms Import Consortium</h4>
                </div>
                <span className="text-xs font-bold text-slate-800">London, UK</span>
              </div>
              <p className="text-xs text-slate-500">
                Sourcing authentic handwoven silk stoles and Madhubani canvas paintings for high-end boutique storefronts.
              </p>
            </div>
          </div>
        </div>

        {/* Documentation / Compliance checklist (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <FileText className="text-emerald-400 h-4 w-4" /> Global Compliance Advisor
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>IE Code (Importer-Exporter Code Registration completed)</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>APEDA Agricultural Export Authority authorization</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-300">
                <Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Phytosanitary inspection & certificate issuance checklist</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setCertDownloaded(true);
              setTimeout(() => setCertDownloaded(false), 3000);
            }}
            className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-slate-900 font-bold rounded-lg text-xs transition cursor-pointer"
          >
            {certDownloaded ? "✓ PDF Downloaded" : "Download IE Certificate Template"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ========================================================
// 8. INTERACTIVE BLUEPRINTS HUB (20 DELIVERABLES EXPLORER)
// ========================================================
export function BlueprintsModule() {
  const [selectedSection, setSelectedSection] = useState(PLATFORM_BLUEPRINTS[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlueprints = PLATFORM_BLUEPRINTS.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="blueprints-hub-view">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
          <Award className="text-indigo-600 h-7 w-7" /> Founder's Blueprints & Deliverables
        </h2>
        <p className="text-sm text-slate-500">
          Comprehensive expert systems repository. Complete documentation covering business, engineering, logistics, and scaling deliverables requested for Farm2home platform.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-col space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search deliverables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[400px] pr-1">
            {filteredBlueprints.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedSection(p)}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold transition flex items-center justify-between border cursor-pointer ${
                  selectedSection.id === p.id
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-slate-700 border-slate-150 hover:bg-slate-100"
                }`}
              >
                <span>{p.title}</span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Content Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-150 rounded-2xl p-6 shadow-xs min-h-[460px] flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4 text-slate-700">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="text-xl">📋</span>
              <h3 className="text-lg font-bold text-slate-800">{selectedSection.title}</h3>
            </div>

            {/* Render body manually since react-markdown has special import constraints */}
            <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100 max-h-[380px] overflow-y-auto font-sans">
              {selectedSection.content}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[10px] text-slate-400">
            <span>Farm2Home Ecosystem Executive Whitepaper Hub</span>
            <span className="font-mono">{selectedSection.id.toUpperCase()}_REV2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
