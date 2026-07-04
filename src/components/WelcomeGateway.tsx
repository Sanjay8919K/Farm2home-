import React, { useState } from "react";
import { Sprout, Sparkles, ShoppingBag, ArrowRight, ShieldCheck, User, MapPin, Key } from "lucide-react";
import { UserRole } from "../types";

interface WelcomeGatewayProps {
  onLogin: (role: UserRole, name: string, location: string, regd: string, upi: string) => void;
}

export default function WelcomeGateway({ onLogin }: WelcomeGatewayProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("Farmer");
  
  // Dynamic form details based on selection
  const [name, setName] = useState("Sanjay Korrakuti");
  const [location, setLocation] = useState("Anantapur, AP");
  const [regd, setRegd] = useState("F2H-9921");
  const [upi, setUpi] = useState("kisan@upi");

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "Farmer") {
      setName("Sanjay Korrakuti");
      setLocation("Anantapur, AP");
      setRegd("F2H-9921");
      setUpi("kisan@upi");
    } else if (role === "SHG" || role === "Artisan") {
      setName("Maitri Women SHG");
      setLocation("Khurja Village, UP");
      setRegd("SHG-4311");
      setUpi("maitri@upi");
    } else if (role === "Customer") {
      setName("Aarav Sharma");
      setLocation("Indiranagar, Bengaluru");
      setRegd("CUST-7702");
      setUpi("aarav@upi");
    } else {
      setName("Suresh Patil");
      setLocation("Nashik Mandi, MH");
      setRegd("PARTNER-2101");
      setUpi("mandi@upi");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole, name, location, regd, upi);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 md:p-8 font-sans text-slate-100 relative overflow-hidden" id="welcome-gateway-container">
      {/* Background Decorative Aura */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-900/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-900/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Top bar logo */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 text-slate-950 font-black h-10 w-10 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-950/20">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight leading-none text-white">Farm2home</h1>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block mt-1">
              Direct Rural-Urban Trade
            </span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Secure Gateway Active
        </span>
      </div>

      {/* Core Interface Content */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-center relative z-10">
        
        {/* Left column explanation branding */}
        <div className="lg:col-span-5 space-y-6">
          <span className="px-3 py-1 bg-emerald-950 border border-emerald-900/50 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider inline-block">
            🌾 No Commission. Just Empowerment.
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Connecting Real India's Harvesters directly with Consumers.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Welcome to the secure Farm2Home gateway portal. To prevent showing random, unverified crop listings, please select your authentic platform role and enter your identity credentials to access your direct trade portal.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex gap-3.5 items-start">
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 shrink-0">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Kisan Verified Listings</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-normal">
                  Only registered farmers can publish harvests, ensuring complete authenticity and fresh supply.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5 items-start">
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 shrink-0">
                <Key className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Escrow Audited Trade Ledger</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-normal">
                  All transactions clear direct to local cooperative wallets upon QR logistics scan confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column Portal Gateway Card */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" /> Select Your Ecosystem Role
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Choose your exact portal type to customize your workspace dashboard:
            </p>
          </div>

          {/* Role selector tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleRoleChange("Farmer")}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition flex flex-col justify-between h-28 ${
                selectedRole === "Farmer"
                  ? "bg-emerald-950/60 border-emerald-500 text-white shadow-lg"
                  : "bg-slate-950/60 border-slate-850 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <span className="text-2xl">👨‍🌾</span>
              <div>
                <span className="block font-bold text-xs">Kisan / Farmer</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">Add crops & get paid</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("SHG")}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition flex flex-col justify-between h-28 ${
                selectedRole === "SHG" || selectedRole === "Artisan"
                  ? "bg-amber-950/40 border-amber-500 text-white shadow-lg"
                  : "bg-slate-950/60 border-slate-850 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <span className="text-2xl">🏺</span>
              <div>
                <span className="block font-bold text-xs">SHG Artisan</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">List craft handlooms</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("Customer")}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition flex flex-col justify-between h-28 ${
                selectedRole === "Customer"
                  ? "bg-indigo-950/40 border-indigo-500 text-white shadow-lg"
                  : "bg-slate-950/60 border-slate-850 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <span className="text-2xl">🛒</span>
              <div>
                <span className="block font-bold text-xs">Consumer / Buyer</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">Buy fresh organic food</span>
              </div>
            </button>
          </div>

          {/* Core Login Information Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {selectedRole === "Customer" ? "Your Name" : selectedRole === "Farmer" ? "Farmer Owner Name" : "SHG Group/Artisan Name"}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sanjay Korrakuti"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {selectedRole === "Customer" ? "Delivery City / State" : "Harvest Location / Mandi State"}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Anantapur, AP"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {selectedRole === "Customer" ? "Customer Token ID" : "Farming cooperative ID (Regd #)"}
                </label>
                <input
                  type="text"
                  required
                  value={regd}
                  onChange={(e) => setRegd(e.target.value)}
                  placeholder="e.g. F2H-9921"
                  className="w-full text-xs px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  UPI ID for Direct Clearance Settlement
                </label>
                <input
                  type="text"
                  required
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                  placeholder="e.g. kisan@upi"
                  className="w-full text-xs px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-850 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 leading-normal max-w-sm">
                🔒 Direct wallet settlement is fully compliant with Gramin Escrow Clearance systems.
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/30"
              >
                Launch Dashboard <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="max-w-6xl mx-auto w-full text-center border-t border-slate-900 pt-4 text-[10px] text-slate-500">
        © 2026 Farm2Home Direct Rural Economy Platform. Powered by Gramin AI Sahayak. All rights reserved.
      </div>
    </div>
  );
}
