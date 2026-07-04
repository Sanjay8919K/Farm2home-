import React, { useState, useEffect } from "react";
import { VillageProduct, UserRole } from "../types";
import { ShoppingBag, Star, Plus, ShieldCheck, Heart, User, MapPin, Sparkles, Trash2 } from "lucide-react";

interface VillageCommerceModuleProps {
  villageProducts: VillageProduct[];
  role: UserRole;
  onAddVillageProduct: (newProduct: Partial<VillageProduct>) => Promise<void>;
  onBuyProduct: (product: any, quantity: number, mode: "buy" | "subscribe") => void;
  onDeleteProduct?: (id: string) => Promise<void>;
  profileName?: string;
  profileLocation?: string;
}

export default function VillageCommerceModule({
  villageProducts,
  role,
  onAddVillageProduct,
  onBuyProduct,
  onDeleteProduct,
  profileName = "Sanjay Korrakuti",
  profileLocation = "Anantapur, AP"
}: VillageCommerceModuleProps) {
  const isCreator = role === "Farmer" || role === "SHG" || role === "Artisan";
  const [activeTab, setActiveTab] = useState<"MyListings" | "Explore">(isCreator ? "MyListings" : "Explore");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addMsg, setAddMsg] = useState("");
  const [buyingProduct, setBuyingProduct] = useState<VillageProduct | null>(null);
  const [buyQuantity, setBuyQuantity] = useState(1);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Handicrafts");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [quantity, setQuantity] = useState("");
  const [artisan, setArtisan] = useState(profileName);
  const [village, setVillage] = useState(profileLocation);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    setActiveTab(isCreator ? "MyListings" : "Explore");
  }, [role, isCreator]);

  useEffect(() => {
    if (profileName) {
      setArtisan(profileName);
    }
  }, [profileName]);

  useEffect(() => {
    if (profileLocation) {
      setVillage(profileLocation);
    }
  }, [profileLocation]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !quantity) {
      setAddMsg("Please fill out all required fields.");
      return;
    }

    await onAddVillageProduct({
      name,
      category,
      price: Number(price),
      unit,
      quantity: Number(quantity),
      artisan: artisan || profileName,
      village: village || profileLocation,
      image: imageUrl || undefined
    });

    setAddMsg("Artisan product registered successfully!");
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
      onBuyProduct(buyingProduct, buyQuantity, "buy");
      setBuyingProduct(null);
      setBuyQuantity(1);
    }
  };

  // Filter village products
  const filteredProducts = villageProducts.filter((p) => {
    if (isCreator && activeTab === "MyListings") {
      return p.artisan.toLowerCase() === profileName.toLowerCase() || p.artisan === profileName;
    }
    return true; // "Explore" shows all village crafts
  });

  return (
    <div className="space-y-6" id="village-commerce-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
            <Sparkles className="text-amber-600 h-7 w-7" /> Village Commerce Storefront
          </h2>
          <p className="text-sm text-slate-500">
            Empowering women Self-Help Groups (SHGs) and local village artisans to list authentic handcrafted products globally.
          </p>
        </div>

        {/* Action Button for Creators */}
        {isCreator && (
          <button
            id="add-artisan-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="mt-3 md:mt-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium text-sm transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Register Handloom/Craft Item
          </button>
        )}
      </div>

      {/* Add form */}
      {showAddForm && (
        <form
          id="add-artisan-form"
          onSubmit={handleCreateProduct}
          className="p-5 bg-white border border-amber-100 rounded-xl shadow-xs space-y-4 animate-fade-in"
        >
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="font-semibold text-slate-800 text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" /> New Craft storefront upload
            </h3>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
              SHG Creator: {profileName}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Product Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sambalpuri Cotton Saree"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
              >
                <option value="Handicrafts">Handicrafts</option>
                <option value="Handloom">Handloom & Apparel</option>
                <option value="Pottery">Pottery</option>
                <option value="Jewelry">Jewelry & Beads</option>
                <option value="Art">Folk Art Paintings</option>
                <option value="Organic Foods">Homemade Pickles & Spreads</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Price *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Unit</label>
                <input
                  type="text"
                  placeholder="e.g. pcs"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Inventory Stock *</label>
              <input
                type="number"
                required
                placeholder="e.g. 15"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">SHG / Artisan Brand</label>
              <input
                type="text"
                disabled
                value={artisan}
                className="w-full text-sm px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Origin Village</label>
              <input
                type="text"
                disabled
                value={village}
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
              className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {addMsg && (
              <p className={`text-sm font-medium ${addMsg.includes("successfully") ? "text-green-600" : "text-amber-600"}`}>
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
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium transition cursor-pointer"
              >
                Register Product
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Toggles for creators */}
      {isCreator && (
        <div className="flex border-b border-amber-100 gap-1 bg-amber-50/30 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("MyListings")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "MyListings" ? "bg-white text-amber-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            ✨ My Craft Listings ({villageProducts.filter(p => p.artisan.toLowerCase() === profileName.toLowerCase() || p.artisan === profileName).length})
          </button>
          <button
            onClick={() => setActiveTab("Explore")}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "Explore" ? "bg-white text-amber-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            🛍️ Browse Entire Handicraft Storefront
          </button>
        </div>
      )}

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-dashed border-amber-200 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-3">
          <div className="text-3xl">🏺</div>
          <h4 className="font-semibold text-slate-800 text-sm">No Handicrafts Listed</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            {activeTab === "MyListings"
              ? "You have not listed any village handicrafts under your SHG name yet. Start by clicking 'Register Handloom/Craft Item' above."
              : "No handicraft products listed under this filter."}
          </p>
          {activeTab === "MyListings" && (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-2 px-3.5 py-1.5 bg-amber-50 text-amber-700 font-bold rounded-lg text-xs hover:bg-amber-100 cursor-pointer transition"
            >
              + Create First Craft Listing
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-orange-50/50 rounded-2xl overflow-hidden hover:shadow-md hover:border-amber-100 transition-all duration-300 flex flex-col group relative"
            >
              {p.artisan.toLowerCase() === profileName.toLowerCase() && (
                <span className="absolute top-3 right-3 bg-amber-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full z-10 shadow-sm">
                  My Listing
                </span>
              )}

              {/* Tag/Verify Label */}
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs border border-amber-100 flex items-center gap-1 z-10">
                <ShieldCheck className="h-3 w-3 text-amber-600" /> GI Verified
              </span>

              <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 tracking-wider uppercase bg-amber-50 px-2 py-0.5 rounded">
                    {p.category}
                  </span>
                  
                  <h4 className="font-semibold text-slate-800 text-sm mt-2 group-hover:text-amber-700 transition">
                    {p.name}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                    <User className="h-3.5 w-3.5 text-amber-600" />
                    <span className="font-medium text-slate-700">{p.artisan}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span>{p.village}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between border-t border-slate-50 pt-3">
                    <div>
                      <span className="text-lg font-bold text-slate-800">₹{p.price}</span>
                      <span className="text-xs text-slate-400"> / {p.unit}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold bg-amber-50/50 px-1.5 py-0.5 rounded">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{p.rating}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-1.5 flex justify-between items-center">
                    <span>In-stock: {p.quantity} {p.unit}</span>
                    <span className="text-[10px] text-slate-400">Direct From Village</span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {p.artisan.toLowerCase() === profileName.toLowerCase() ? (
                      <button
                        onClick={async () => {
                          if (onDeleteProduct && window.confirm(`Are you sure you want to delete your craft listing: ${p.name}?`)) {
                            await onDeleteProduct(p.id);
                          }
                        }}
                        className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-150 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove Craft Listing
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setBuyingProduct(p)}
                          disabled={isCreator}
                          className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" /> {isCreator ? "Cannot Buy" : "Buy Direct"}
                        </button>
                        <button className="px-2.5 py-2 border border-slate-150 hover:bg-slate-50 text-slate-400 hover:text-rose-500 rounded-lg transition cursor-pointer">
                          <Heart className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review list simulator */}
      <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
        <h3 className="font-semibold text-slate-800 text-sm mb-4">Latest Customer Review Feed</h3>
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-xl border border-slate-50 flex gap-3">
            <div className="bg-indigo-50 text-indigo-700 font-bold h-8 w-8 rounded-full flex items-center justify-center text-xs">
              SK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-800 text-xs">Sanjay Korrakuti</span>
                <span className="text-[10px] text-slate-400">Purchased Silk Saree</span>
              </div>
              <div className="flex text-amber-400 my-0.5">
                {"★".repeat(5)}
              </div>
              <p className="text-xs text-slate-600">
                "Bought this pure silk saree as a gift. The handweaving craft is pristine! It arrived beautifully packed in an eco-friendly cardboard box designed with the village art. Amazing experience!"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Buy dialog */}
      {buyingProduct && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-sm">Direct Village Purchase</h3>
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
                  <p className="text-slate-400 mt-0.5">Artisan: {buyingProduct.artisan}</p>
                  <p className="font-bold text-amber-700 mt-1">₹{buyingProduct.price} / {buyingProduct.unit}</p>
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
                  <span className="font-extrabold text-amber-800 text-base">₹{(buyingProduct.price * buyQuantity).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 leading-normal">
                🔒 **Secure Escrow Clearance**: Your payment is held securely, and will be cleared directly to the Artisan's Gramin Wallet upon logistics validation. Direct shipping from village {buyingProduct.village}.
              </div>

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
                  className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold cursor-pointer transition"
                >
                  Pay & Settle Direct
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
