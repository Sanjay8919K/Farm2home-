import React, { useState, useEffect, useRef } from "react";
import { Product, VillageProduct, WalletTransaction, UserRole, Order } from "./types";
import {
  Sprout, Sparkles, TrendingUp, Truck, DollarSign, Users, BookOpen, Globe, Award, MessageSquare,
  ChevronRight, ArrowRight, UserCircle, Search, Menu, X, ShieldAlert, Check, ShoppingCart, HelpCircle,
  Send, Mic, MicOff
} from "lucide-react";
import Farm2HomeModule from "./components/Farm2HomeModule";
import VillageCommerceModule from "./components/VillageCommerceModule";
import WelcomeGateway from "./components/WelcomeGateway";
import AIFarmingAssistant from "./components/AIFarmingAssistant";
import {
  AIBusinessAssistant,
  AIBrandingStudio,
  SmartLogisticsNetwork,
  FinancialServices,
  CommunityPlatform,
  MarketIntelligence,
  ExportMarketplace,
  BlueprintsModule
} from "./components/OtherModules";

const MODULES = [
  { id: "farm2home", title: "1. Farm2Home Hub", icon: "🌾", desc: "B2C produce & B2B bulk contracts" },
  { id: "village-commerce", title: "2. Village Storefronts", icon: "✨", desc: "Handloom crafts & women SHG goods" },
  { id: "farming-assistant", title: "3. Crop Doctor AI", icon: "🌿", desc: "Disease analysis & agronomy advice" },
  { id: "business-assistant", title: "4. AI Business Vyapaar", icon: "📈", desc: "Analytics & dynamic pricing ideas" },
  { id: "branding-studio", title: "5. AI Branding Studio", icon: "🏷️", desc: "Instant brand names, taglines & logos" },
  { id: "logistics", title: "6. Smart Logistics", icon: "🚚", desc: "Cold storage & optimized truck routes" },
  { id: "financial", title: "7. Gramin Wallet", icon: "💳", desc: "UPI clearances & ledger auditing" },
  { id: "community", title: "8. Krishi Chaupal Forum", icon: "💬", desc: "Community discussion & training clips" },
  { id: "market-intel", title: "9. Market Intelligence", icon: "📊", desc: "Dynamic pricing trends & demand charts" },
  { id: "export", title: "10. Export Port", icon: "🌍", desc: "Global buyer onboarding & certification" },
  { id: "blueprints", title: "Founders Deliverables", icon: "📋", desc: "20 Startup business & tech documents" }
];

export default function App() {
  const [selectedModule, setSelectedModule] = useState("farm2home");
  
  // Local storage cache initializers for offline resilience in rural areas
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const cached = localStorage.getItem("f2h_cached_products");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [villageProducts, setVillageProducts] = useState<VillageProduct[]>(() => {
    try {
      const cached = localStorage.getItem("f2h_cached_village_products");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    try {
      const cached = localStorage.getItem("f2h_cached_wallet_balance");
      return cached ? JSON.parse(cached) : 0;
    } catch {
      return 0;
    }
  });
  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    try {
      const cached = localStorage.getItem("f2h_cached_wallet_transactions");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const cached = localStorage.getItem("f2h_cached_orders");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem("f2h_logged_in") === "true";
    } catch {
      return false;
    }
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      return (localStorage.getItem("f2h_cached_role") as UserRole) || "Farmer";
    } catch {
      return "Farmer";
    }
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // User Profile manual entry states (Do not hardcode details; let the user enter/edit them manually)
  const [profileName, setProfileName] = useState(() => {
    try {
      return localStorage.getItem("f2h_cached_profile_name") || "Sanjay Korrakuti";
    } catch {
      return "Sanjay Korrakuti";
    }
  });
  const [profileRegd, setProfileRegd] = useState(() => {
    try {
      return localStorage.getItem("f2h_cached_profile_regd") || "F2H-9921";
    } catch {
      return "F2H-9921";
    }
  });
  const [profileLocation, setProfileLocation] = useState(() => {
    try {
      return localStorage.getItem("f2h_cached_profile_location") || "Anantapur, AP";
    } catch {
      return "Anantapur, AP";
    }
  });
  const [profileUpi, setProfileUpi] = useState(() => {
    try {
      return localStorage.getItem("f2h_cached_profile_upi") || "kisan@upi";
    } catch {
      return "kisan@upi";
    }
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [offlineError, setOfflineError] = useState<string | null>(null);

  // Gemini chat state (Gramin AI Sahayak)
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "model"; text: string }[]>([
    {
      role: "model",
      text: "Namaste! I am Gramin AI Sahayak (Ecosystem Companion). How can I support you today? Ask me about soil preparation, dynamic pricing trends, creating a brand for your SHG handicraft, or managing logistics pickups."
    }
  ]);
  const [userChatMsg, setUserChatMsg] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Voice-to-text states
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speechLang, setSpeechLang] = useState("en-IN");
  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
    // @ts-ignore
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setSpeechError("Voice-to-Text not supported in this browser.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setSpeechError(null);
      try {
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = speechLang;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setUserChatMsg((prev) => prev ? `${prev} ${transcript}` : transcript);
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setSpeechError(`Mic error: ${event.error}`);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        console.error("Failed to start speech recognition:", err);
        setSpeechError(err.message || "Failed to start listening");
        setIsListening(false);
      }
    }
  };

  // Sync data on startup
  const fetchData = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products);
      setVillageProducts(data.villageProducts);

      // Cache products lists
      try {
        localStorage.setItem("f2h_cached_products", JSON.stringify(data.products));
        localStorage.setItem("f2h_cached_village_products", JSON.stringify(data.villageProducts));
      } catch (err) {
        console.warn("Storage quota or security block on localStorage:", err);
      }

      const walletRes = await fetch("/api/wallet");
      const walletData = await walletRes.json();
      setWalletBalance(walletData.balance);
      setTransactions(walletData.transactions);

      // Cache wallet states
      try {
        localStorage.setItem("f2h_cached_wallet_balance", JSON.stringify(walletData.balance));
        localStorage.setItem("f2h_cached_wallet_transactions", JSON.stringify(walletData.transactions));
      } catch (err) {
        console.warn("Storage error:", err);
      }

      const ordersRes = await fetch("/api/orders");
      const ordersData = await ordersRes.json();
      setOrders(ordersData.orders);

      // Cache order history
      try {
        localStorage.setItem("f2h_cached_orders", JSON.stringify(ordersData.orders));
      } catch (err) {
        console.warn("Storage error:", err);
      }

      setOfflineError(null);
    } catch (e) {
      console.error("Failed to sync server data:", e);
      setOfflineError("Offline Mode: Unable to sync with Farm2Home server. Currently viewing cached local data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatOpen]);

  // Handle post new product
  const handleAddProduct = async (newP: Partial<Product>) => {
    const isCreator = userRole === "Farmer" || userRole === "SHG" || userRole === "Artisan" || userRole === "Admin";
    if (!isCreator) {
      alert("Unauthorized: Only registered Farmers or SHGs are permitted to add new listings.");
      return;
    }
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newP)
      });
      await res.json();
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // Handle post new village product
  const handleAddVillageProduct = async (newP: Partial<VillageProduct>) => {
    const isCreator = userRole === "Farmer" || userRole === "SHG" || userRole === "Artisan" || userRole === "Admin";
    if (!isCreator) {
      alert("Unauthorized: Only registered Farmers or SHGs are permitted to add new listings.");
      return;
    }
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newP, isVillage: true })
      });
      await res.json();
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // Handle delete product listing
  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle buy product (creates order)
  const handleBuyProduct = async (prod: any, quantity: number, mode: "buy" | "subscribe") => {
    const total = prod.price * quantity;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: `${profileName} (${userRole})`,
          items: [{ name: prod.name, quantity, price: prod.price }],
          total,
          role: userRole
        })
      });
      await res.json();
      fetchData();
      alert(`Order placed successfully! Total: ₹${total}. Escrow funds cleared to the seller immediately.`);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle wallet cash out
  const handleCashOut = async (amount: number, upiId: string) => {
    const res = await fetch("/api/wallet/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, upiId })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Cashout failed");
    }
    fetchData();
  };

  // Handle P2P transfer payments
  const handleP2PTransfer = async (amount: number, peerName: string, peerUpi: string, isPayment: boolean) => {
    const res = await fetch("/api/wallet/p2p", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, peerName, peerUpi, isPayment })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "P2P transfer failed");
    }
    fetchData();
  };

  // Chat with Gramin AI Sahayak
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatMsg.trim() || isChatLoading) return;

    const userText = userChatMsg;
    setUserChatMsg("");
    setChatMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsChatLoading(true);

    try {
      // Reformat history as required by SDK API schema
      const historyPayload = chatMessages.slice(1).map((m) => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
          userProfile: {
            name: profileName,
            location: profileLocation,
            role: userRole,
            regd: profileRegd
          }
        })
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: "model", text: data.text }]);
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        { role: "model", text: "Apologies, I hit a momentary network hitch. Please try asking again." }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <WelcomeGateway
        onLogin={(role, name, loc, reg, upi) => {
          setUserRole(role);
          setProfileName(name);
          setProfileLocation(loc);
          setProfileRegd(reg);
          setProfileUpi(upi);
          setIsLoggedIn(true);
          try {
            localStorage.setItem("f2h_logged_in", "true");
            localStorage.setItem("f2h_cached_role", role);
            localStorage.setItem("f2h_cached_profile_name", name);
            localStorage.setItem("f2h_cached_profile_location", loc);
            localStorage.setItem("f2h_cached_profile_regd", reg);
            localStorage.setItem("f2h_cached_profile_upi", upi);
          } catch (e) {
            console.error(e);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800" id="main-application-shell">
      {/* 1. TOP HEADER & NAVIGATION */}
      <header className="bg-emerald-950 text-white sticky top-0 z-40 px-4 md:px-8 py-3.5 flex items-center justify-between border-b border-emerald-900 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 hover:bg-emerald-900 rounded-lg transition cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 text-slate-900 font-extrabold h-9 w-9 rounded-xl flex items-center justify-center shadow-inner">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight block leading-none">Farm2home</span>
              <span className="text-[9px] text-emerald-300 font-bold uppercase tracking-wider">Rural Economy Ecosystem</span>
            </div>
          </div>
        </div>

        {/* Right controls: role switcher & wallet preview */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 bg-emerald-900/60 border border-emerald-800/40 px-3 py-1.5 rounded-lg">
            <span className="text-[10px] text-emerald-300 font-bold uppercase">Balance:</span>
            <span className="text-xs font-bold text-white">₹{walletBalance.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-emerald-200 font-medium">Viewing role:</span>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="text-xs bg-emerald-900/80 hover:bg-emerald-900 text-white font-semibold border border-emerald-800 px-2.5 py-1.5 rounded-lg focus:outline-none cursor-pointer"
            >
              <option value="Farmer">Farmer (Kisan)</option>
              <option value="SHG">Self Help Group (SHG)</option>
              <option value="Artisan">Artisan (Artistic)</option>
              <option value="Customer">Customer (Consumer)</option>
              <option value="Wholesaler">Wholesaler / Retailer</option>
              <option value="Exporter">Exporter (Global)</option>
              <option value="Logistics Partner">Logistics Partner</option>
              <option value="Admin">System Admin</option>
            </select>
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT (SIDE NAVIGATION + WORKSPACE) */}
      <div className="flex-1 flex relative">
        {/* Mobile Left Drawer Backdrop */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-30 md:hidden animate-fade-in"
          />
        )}

        {/* Side navigation rail */}
        <aside
          id="sidebar-navigation"
          className={`w-64 bg-white border-r border-slate-150 p-4 flex flex-col justify-between shrink-0 fixed md:static h-[calc(100vh-64px)] top-16 left-0 z-35 md:z-auto transition-transform duration-300 md:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="space-y-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block px-1">
              Modules & Capabilities
            </span>

            <nav className="space-y-1 overflow-y-auto max-h-[70vh]">
              {MODULES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedModule(m.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-start gap-3 transition cursor-pointer border ${
                    selectedModule === m.id
                      ? "bg-emerald-50 text-emerald-800 border-emerald-100 font-bold"
                      : "bg-white text-slate-600 border-transparent hover:bg-slate-50"
                  }`}
                >
                  <span className="text-sm shrink-0 mt-0.5">{m.icon}</span>
                  <div>
                    <span className="block leading-snug">{m.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal block mt-0.5 leading-snug">
                      {m.desc}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-auto">
            {!isEditingProfile ? (
              <div 
                className="bg-emerald-50/50 hover:bg-emerald-50 p-3 rounded-xl border border-emerald-100 transition duration-150 cursor-pointer group"
                onClick={() => setIsEditingProfile(true)}
                title="Click to manually edit profile/user details"
              >
                <div className="flex items-center gap-2">
                  <UserCircle className="h-8 w-8 text-emerald-700 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-800 block truncate leading-none mb-1 group-hover:text-emerald-950">
                      {profileName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block truncate leading-none">
                      Regd #{profileRegd}
                    </span>
                    <span className="text-[9px] text-emerald-700 font-semibold block truncate leading-none mt-1">
                      📍 {profileLocation}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-center text-[9px] font-semibold text-emerald-600 bg-white py-1 rounded-md border border-emerald-50 group-hover:bg-emerald-100/50 transition">
                  ✏️ Edit Profile Details
                </div>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsEditingProfile(false);
                }}
                className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2 flex flex-col animate-fade-in"
              >
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block border-b border-slate-200 pb-1">
                  Edit Identity
                </span>
                
                <div>
                  <label className="text-[8px] font-semibold text-slate-500 block mb-0.5">FULL NAME</label>
                  <input 
                    type="text" 
                    value={profileName} 
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Enter Name"
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[8px] font-semibold text-slate-500 block mb-0.5">REGISTRATION ID</label>
                  <input 
                    type="text" 
                    value={profileRegd} 
                    onChange={(e) => setProfileRegd(e.target.value)}
                    placeholder="e.g. F2H-9921"
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[8px] font-semibold text-slate-500 block mb-0.5">LOCATION / MANDI</label>
                  <input 
                    type="text" 
                    value={profileLocation} 
                    onChange={(e) => setProfileLocation(e.target.value)}
                    placeholder="e.g. Nashik, MH"
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[8px] font-semibold text-slate-500 block mb-0.5">UPI ID FOR CASHOUT</label>
                  <input 
                    type="text" 
                    value={profileUpi} 
                    onChange={(e) => setProfileUpi(e.target.value)}
                    placeholder="e.g. name@upi"
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-1 pt-1">
                  <button 
                    type="submit" 
                    className="flex-1 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold hover:bg-emerald-700 cursor-pointer text-center"
                  >
                    Save
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditingProfile(false)}
                    className="px-1.5 py-1 bg-slate-200 text-slate-600 rounded text-[10px] font-bold hover:bg-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <button
              id="sign-out-btn"
              onClick={() => {
                setIsLoggedIn(false);
                localStorage.removeItem("f2h_logged_in");
              }}
              className="mt-4 w-full py-2 bg-slate-50 hover:bg-red-50 hover:text-red-700 text-slate-500 rounded-xl text-xs font-semibold border border-dashed border-slate-200 hover:border-red-200 transition duration-150 cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              🔒 Switch Portal / Logout
            </button>
          </div>
        </aside>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto" id="workspace-content">
          <div className="max-w-6xl mx-auto bg-white border border-slate-150 rounded-2xl p-4 md:p-6 shadow-xs min-h-[75vh]">
            {offlineError && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-800 animate-fade-in shadow-2xs">
                <div className="flex items-start sm:items-center gap-2.5">
                  <span className="text-base leading-none">📡</span>
                  <div>
                    <span className="font-bold block text-amber-950">Rural Connectivity Assist Active</span>
                    <span className="text-[11px] text-amber-800/90 leading-normal block mt-0.5">
                      Your connection was temporarily lost. We have restored last known product catalogs and order records locally.
                    </span>
                  </div>
                </div>
                <button 
                  onClick={fetchData}
                  className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer transition shadow-xs self-start sm:self-auto"
                >
                  Sync Now
                </button>
              </div>
            )}

            {selectedModule === "farm2home" && (
              <Farm2HomeModule
                products={products}
                role={userRole}
                onAddProduct={handleAddProduct}
                onBuyProduct={handleBuyProduct}
                onDeleteProduct={handleDeleteProduct}
                profileName={profileName}
                profileLocation={profileLocation}
              />
            )}

            {selectedModule === "village-commerce" && (
              <VillageCommerceModule
                villageProducts={villageProducts}
                role={userRole}
                onAddVillageProduct={handleAddVillageProduct}
                onBuyProduct={handleBuyProduct}
                onDeleteProduct={handleDeleteProduct}
                profileName={profileName}
                profileLocation={profileLocation}
              />
            )}

            {selectedModule === "farming-assistant" && <AIFarmingAssistant />}

            {selectedModule === "business-assistant" && <AIBusinessAssistant profileLocation={profileLocation} />}

            {selectedModule === "branding-studio" && <AIBrandingStudio profileLocation={profileLocation} />}

            {selectedModule === "logistics" && <SmartLogisticsNetwork />}

            {selectedModule === "financial" && (
              <FinancialServices
                walletBalance={walletBalance}
                transactions={transactions}
                onCashOut={handleCashOut}
                profileUpi={profileUpi}
                onP2PTransfer={handleP2PTransfer}
                profileName={profileName}
              />
            )}

            {selectedModule === "community" && (
              <CommunityPlatform
                profileName={profileName}
                userRole={userRole}
              />
            )}

            {selectedModule === "market-intel" && <MarketIntelligence />}

            {selectedModule === "export" && <ExportMarketplace />}

            {selectedModule === "blueprints" && <BlueprintsModule />}
          </div>
        </main>
      </div>

      {/* 3. PERSISTENT GRAMIN AI CHATBOT (FLOATING WIDGET) */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
          <div
            id="chat-assistant-window"
            className="bg-white border border-slate-150 w-80 md:w-96 h-[480px] rounded-2xl shadow-xl flex flex-col overflow-hidden animate-fade-in"
          >
            {/* Chat header */}
            <div className="bg-emerald-950 text-white px-4 py-3 flex items-center justify-between border-b border-emerald-900 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 bg-emerald-500 text-slate-900 rounded-lg flex items-center justify-center font-bold text-xs animate-pulse">
                  🌱
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-none text-white">Gramin AI Sahayak</h4>
                  <span className="text-[9px] text-emerald-300 font-bold block mt-1">Direct Agronomy & Biz Expert</span>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-emerald-900 rounded transition text-slate-200 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat message stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-start gap-2 animate-fade-in`}
                >
                  {m.role === "model" && (
                    <div className="h-6 w-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line border shadow-2xs ${
                      m.role === "user"
                        ? "bg-emerald-600 text-white border-emerald-700 rounded-tr-none"
                        : "bg-white text-slate-700 border-slate-150 rounded-tl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start items-center gap-2 animate-pulse">
                  <div className="h-6 w-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    AI
                  </div>
                  <div className="bg-white border border-slate-150 p-2.5 rounded-xl text-[11px] text-slate-400 italic">
                    Gramin Sahayak is thinking...
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat inputs */}
            <div className="p-3 border-t border-slate-150 bg-white space-y-2">
              {speechError && (
                <div className="text-[10px] text-red-600 bg-red-50 px-2 py-1.5 rounded-lg border border-red-100 flex justify-between items-center animate-fade-in">
                  <span className="font-medium">{speechError}</span>
                  <button 
                    type="button"
                    onClick={() => setSpeechError(null)} 
                    className="text-red-400 hover:text-red-600 font-bold ml-1 text-xs px-1 hover:bg-red-100/50 rounded"
                  >
                    ×
                  </button>
                </div>
              )}
              {isListening && (
                <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100 flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-ping"></span>
                    <span className="font-semibold">
                      Listening ({
                        speechLang === "hi-IN" ? "Hindi" : 
                        speechLang === "mr-IN" ? "Marathi" : 
                        speechLang === "te-IN" ? "Telugu" : 
                        speechLang === "ta-IN" ? "Tamil" : 
                        "English"
                      })... Speak now!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (recognitionRef.current) recognitionRef.current.stop();
                      setIsListening(false);
                    }}
                    className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold hover:bg-red-200 transition"
                  >
                    Stop
                  </button>
                </div>
              )}
              <form onSubmit={handleSendChat} className="flex gap-1.5 items-center">
                {/* Language Selector Dropdown */}
                <select
                  value={speechLang}
                  onChange={(e) => setSpeechLang(e.target.value)}
                  className="text-[10px] bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-semibold cursor-pointer shrink-0"
                  title="Speak in your regional language"
                >
                  <option value="en-IN">EN</option>
                  <option value="hi-IN">हिं</option>
                  <option value="mr-IN">मरा</option>
                  <option value="te-IN">తెలు</option>
                  <option value="ta-IN">தமி</option>
                </select>

                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    placeholder={isListening ? "Listening..." : "Ask me anything..."}
                    value={userChatMsg}
                    onChange={(e) => setUserChatMsg(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 pl-3 pr-8 py-2 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`absolute right-2 p-1 rounded-full transition-all ${
                      isListening 
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-xs" 
                        : "text-slate-400 hover:text-emerald-700 hover:bg-slate-100"
                    } cursor-pointer`}
                    title="Speak instead of typing (Voice-to-Text)"
                  >
                    {isListening ? <MicOff className="h-3.5 w-3.5 animate-pulse" /> : <Mic className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isChatLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 w-8 rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition shadow-xs disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsChatOpen(true)}
            id="chat-trigger-btn"
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center gap-2 font-bold text-xs"
          >
            <MessageSquare className="h-5 w-5 animate-pulse" />
            <span>Chat with Gramin AI</span>
          </button>
        )}
      </div>
    </div>
  );
}
