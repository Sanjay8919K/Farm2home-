import React, { useState, useEffect } from "react";
import { Product, UserRole } from "../types";
import { ShoppingBag, Calendar, Check, Plus, Tag, MapPin, Sparkles, Sprout, Trash2 } from "lucide-react";

interface Farm2HomeModuleProps {
  products: Product[];
  role: UserRole;
  onAddProduct: (newProduct: Partial<Product>) => Promise<void>;
  onBuyProduct: (product: Product, quantity: number, mode: "buy" | "subscribe") => void;
  onDeleteProduct?: (id: string) => Promise<void>;
  profileName?: string;
  profileLocation?: string;
}

export default function Farm2HomeModule({
  products,
  role,
  onAddProduct,
  onBuyProduct,
  onDeleteProduct,
  profileName = "Sanjay Korrakuti",
  profileLocation = "Anantapur, AP"
}: Farm2HomeModuleProps) {
  // Initialize tab dynamically depending on role
  const [activeTab, setActiveTab] = useState<string>(role === "Farmer" ? "MyListings" : "B2C");
  const [showAddForm, setShowAddForm] = useState(false);
  const [buyingProduct, setBuyingProduct] = useState<Product | null>(null);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [buyMode, setBuyMode] = useState<"buy" | "subscribe">("buy");
  const [addMsg, setAddMsg] = useState("");

  // Form State for adding product
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Vegetables");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [quantity, setQuantity] = useState("");
  const [farmerName, setFarmerName] = useState(profileName);
  const [location, setLocation] = useState(profileLocation);
  const [imageUrl, setImageUrl] = useState("");

  // Keep active tab synced if role switches
  useEffect(() => {
    if (role === "Farmer") {
      setActiveTab("MyListings");
    } else {
      setActiveTab("B2C");
    }
  }, [role]);

  useEffect(() => {
    if (profileName) {
      setFarmerName(profileName);
    }
  }, [profileName]);

  useEffect(() => {
    if (profileLocation) {
      setLocation(profileLocation);
    }
  }, [profileLocation]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !quantity) {
      setAddMsg("Please fill out all required fields.");
      return;
    }

    await onAddProduct({
      name,
      category,
      price: Number(price),
      unit,
      quantity: Number(quantity),
      farmer: farmerName || profileName,
      location: location || profileLocation,
      image: imageUrl || undefined,
      type: Number(price) > 400 || Number(quantity) >= 50 ? "B2B" : "B2C"
    });

    setAddMsg("Product added successfully!");
    setName("");
    setPrice("");
    setQuantity("");
    setImageUrl("");
    setTimeout(() => {
      setShowAddForm(false);
      setAddMsg("");
    }, 1500);
  };

  const handlePurchaseSubmit = () => {
    if (buyingProduct) {
      onBuyProduct(buyingProduct, buyQuantity, buyMode);
      setBuyingProduct(null);
      setBuyQuantity(1);
    }
  };

  // Filter products based on active tab and role
  const filteredProducts = products.filter((p) => {
    if (role === "Farmer") {
      if (activeTab === "MyListings") {
        // Only show products belonging to the logged in farmer
        return p.farmer.toLowerCase() === profileName.toLowerCase() || p.farmer === profileName;
      }
      if (activeTab === "B2C") return p.type === "B2C";
      if (activeTab === "B2B") return p.type === "B2B";
      return true;
    } else {
      // Customer or other views sees everyone's items in B2C/B2B/Subscriptions
      if (activeTab === "B2C" || activeTab === "Subscribe") return p.type === "B2C";
      if (activeTab === "B2B") return p.type === "B2B";
      return true;
    }
  });

  return (
    <div className="space-y-6" id="farm2home-container">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
            <Sprout className="text-emerald-600 h-7 w-7" /> Farm2Home Marketplace
          </h2>
          <p className="text-sm text-slate-500">
            {role === "Farmer" 
              ? "Manage your harvest listings, set direct prices, and publish fresh crop offerings direct to families."
              : "Direct farmer-to-consumer and farmer-to-business marketplace with zero commission leakage."}
          </p>
        </div>
        
        {/* Farmer Actions */}
        {role === "Farmer" && (
          <button
            id="add-crop-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="mt-3 md:mt-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Fresh Crop Listing
          </button>
        )}
      </div>

      {/* Form modal/panel */}
      {showAddForm && (
        <form
          id="add-crop-form"
          onSubmit={handleCreateProduct}
          className="p-5 bg-white border border-emerald-100 rounded-xl shadow-xs space-y-4 animate-fade-in"
        >
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="font-semibold text-slate-800 text-base">Register New Farm Harvest</h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Sourced by {profileName}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Crop Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Organic Alphonso Mangoes"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-800"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-800"
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Spices">Spices</option>
                <option value="Grains">Grains</option>
                <option value="Pulses">Pulses</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Price per Unit *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 150"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Unit</label>
                <input
                  type="text"
                  placeholder="e.g. kg"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Stock Quantity Available *</label>
              <input
                type="number"
                required
                placeholder="e.g. 200"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Farmer Name (Author)</label>
              <input
                type="text"
                disabled
                placeholder="Sanjay Korrakuti"
                value={farmerName}
                className="w-full text-sm px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Harvest Location</label>
              <input
                type="text"
                disabled
                placeholder="Anantapur, AP"
                value={location}
                className="w-full text-sm px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Image URL (Optional)</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-800"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {addMsg && (
              <p className={`text-sm font-medium ${addMsg.includes("success") ? "text-green-600" : "text-amber-600"}`}>
                {addMsg}
              </p>
            )}
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition flex items-center gap-1 cursor-pointer"
              >
                Publish Listing
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tabs Filter */}
      <div className="flex border-b border-slate-200 gap-1 bg-slate-50/50 p-1 rounded-xl">
        {role === "Farmer" ? (
          <>
            <button
              onClick={() => setActiveTab("MyListings")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "MyListings" ? "bg-white text-emerald-700 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              🌾 My Farm Listings ({products.filter(p => p.farmer.toLowerCase() === profileName.toLowerCase() || p.farmer === profileName).length})
            </button>
            <button
              onClick={() => setActiveTab("B2C")}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "B2C" ? "bg-white text-emerald-700 shadow-sm font-semibold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              🛒 Explore B2C Market
            </button>
            <button
              onClick={() => setActiveTab("B2B")}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "B2B" ? "bg-white text-emerald-700 shadow-sm font-semibold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              🏢 Explore B2B Wholesale
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab("B2C")}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "B2C" ? "bg-white text-emerald-700 shadow-sm font-semibold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <ShoppingBag className="h-4 w-4" /> Consumer Marketplace (B2C)
            </button>
            <button
              onClick={() => setActiveTab("B2B")}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "B2B" ? "bg-white text-emerald-700 shadow-sm font-semibold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Tag className="h-4 w-4" /> Wholesale / Bulk Hub (B2B)
            </button>
            <button
              onClick={() => setActiveTab("Subscribe")}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "Subscribe" ? "bg-white text-emerald-700 shadow-sm font-semibold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Calendar className="h-4 w-4" /> Weekly Subscriptions
            </button>
          </>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-3">
          <div className="text-3xl">📦</div>
          <h4 className="font-semibold text-slate-800 text-sm">No Listings Found</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            {activeTab === "MyListings" 
              ? "You have not listed any fresh crops under your name yet. Register your harvest by clicking 'Add Fresh Crop Listing' above."
              : "No listings are currently available for this marketplace filter."}
          </p>
          {activeTab === "MyListings" && (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-xs hover:bg-emerald-100 cursor-pointer transition"
            >
              + Create First Crop Listing
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-md hover:border-slate-200 transition-all duration-300 flex flex-col group relative"
            >
              {p.farmer.toLowerCase() === profileName.toLowerCase() && (
                <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm">
                  My Harvest
                </span>
              )}
              
              <div className="h-40 w-full bg-slate-100 relative overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  {p.category}
                </span>
                {activeTab === "Subscribe" && (
                  <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <Calendar className="h-3 w-3" /> Recurring
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-medium text-slate-800 text-sm group-hover:text-emerald-700 transition">
                    {p.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span>{p.location}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-1">
                    Sold by: <span className="text-slate-700 font-semibold">{p.farmer}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between border-t border-slate-50 pt-2.5">
                    <div>
                      <span className="text-lg font-bold text-slate-800">₹{p.price}</span>
                      <span className="text-xs text-slate-400"> / {p.unit}</span>
                    </div>
                    <span className="text-[11px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                      ★ {p.rating}
                    </span>
                  </div>
                  
                  <div className="text-[11px] text-slate-400 mt-1.5 flex justify-between items-center">
                    <span>Stock: {p.quantity} {p.unit}</span>
                    {p.type === "B2B" && <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">Bulk Only</span>}
                  </div>

                  {/* Button logic based on ownership & role */}
                  {p.farmer.toLowerCase() === profileName.toLowerCase() ? (
                    <button
                      onClick={async () => {
                        if (onDeleteProduct && window.confirm(`Are you sure you want to delete your crop listing: ${p.name}?`)) {
                          await onDeleteProduct(p.id);
                        }
                      }}
                      className="mt-3 w-full py-2 bg-red-50 text-red-700 border border-red-150 hover:bg-red-100 hover:text-red-800 rounded-lg font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove Harvest Listing
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setBuyingProduct(p);
                        setBuyMode(activeTab === "Subscribe" ? "subscribe" : "buy");
                      }}
                      disabled={role === "Farmer"}
                      className={`mt-3 w-full py-2 rounded-lg font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        activeTab === "Subscribe"
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      {role === "Farmer" ? "Cannot Buy Own / Other Crops" : activeTab === "Subscribe" ? "Subscribe weekly" : p.type === "B2B" ? "Place Bulk Order" : "Buy Direct"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subscription Callout info if on Subscription Tab */}
      {activeTab === "Subscribe" && (
        <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-start gap-3 animate-fade-in">
          <Calendar className="text-indigo-600 h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-indigo-900">How Direct Subscriptions Support Farmers</h4>
            <p className="text-xs text-indigo-700 mt-1">
              By subscribing weekly, you guarantee the farmer a fixed demand. They harvest only what is subscribed, reducing on-farm crop losses to 0% and giving you pristine quality at locked, seasonal prices.
            </p>
          </div>
        </div>
      )}

      {/* Buy dialog */}
      {buyingProduct && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-sm">
                {buyMode === "subscribe" ? "Confirm Direct Subscription" : "Direct Farm Purchase"}
              </h3>
              <button
                onClick={() => setBuyingProduct(null)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="flex gap-3">
                <img
                  src={buyingProduct.image}
                  className="h-14 w-14 object-cover rounded-lg border border-slate-100"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{buyingProduct.name}</h4>
                  <p className="text-slate-400 mt-0.5">Sold by {buyingProduct.farmer}</p>
                  <p className="font-bold text-emerald-700 mt-1">₹{buyingProduct.price} / {buyingProduct.unit}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-500">Order Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBuyQuantity(q => Math.max(1, q - 1))}
                      className="h-6 w-6 rounded bg-slate-200 hover:bg-slate-300 font-bold flex items-center justify-center cursor-pointer text-slate-700"
                    >
                      -
                    </button>
                    <span className="font-bold text-slate-800 text-sm px-1 min-w-[20px] text-center">
                      {buyQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBuyQuantity(q => Math.min(buyingProduct.quantity, q + 1))}
                      className="h-6 w-6 rounded bg-slate-200 hover:bg-slate-300 font-bold flex items-center justify-center cursor-pointer text-slate-700"
                    >
                      +
                    </button>
                    <span className="text-slate-400 font-medium">({buyingProduct.unit})</span>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 pt-2.5 flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-700">Total Bill Amount:</span>
                  <span className="font-extrabold text-emerald-800 text-base">₹{(buyingProduct.price * buyQuantity).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {buyMode === "subscribe" ? (
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-800 leading-normal">
                  🌾 You are setting up a **weekly delivery** of {buyQuantity} {buyingProduct.unit}. Payment of ₹{buyingProduct.price * buyQuantity} will be auto-debited weekly. Cancel or adjust at any time!
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 leading-normal">
                  🔒 **Gramin Secure Escrow Clearance Active**: Your payment is held securely in our digital cooperative vault, and will be cleared directly to the farmer's Gramin Wallet upon logistics handover validation.
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBuyingProduct(null)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePurchaseSubmit}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold cursor-pointer transition"
                >
                  {buyMode === "subscribe" ? "Activate Subscription" : "Pay & Settle Direct"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
