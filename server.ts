import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 image uploads (e.g. crop disease checks)
app.use(express.json({ limit: "10mb" }));

// Initialize Gemini client on the server
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI features will fallback to simulation mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ==========================================
// IN-MEMORY DATABASE STATE (RESTORES ON BOOT)
// ==========================================
let products = [
  { id: "1", farmer: "Ramesh Kumar", location: "Nashik, MH", name: "Premium Alphonso Mangoes", category: "Fruits", price: 350, unit: "kg", quantity: 120, image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80", type: "B2C", rating: 4.8 },
  { id: "2", farmer: "Savitri Devi (SHG)", location: "Saran, BR", name: "Organic Turmeric Powder", category: "Spices", price: 180, unit: "kg", quantity: 50, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80", type: "B2C", rating: 4.9 },
  { id: "3", farmer: "Anand Singh", location: "Karnal, HR", name: "Basmati Rice (Bulk)", category: "Grains", price: 75, unit: "kg", quantity: 1500, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80", type: "B2B", rating: 4.5 },
  { id: "4", farmer: "Meena Patel", location: "Anand, GJ", name: "Fresh Organic Tomatoes", category: "Vegetables", price: 40, unit: "kg", quantity: 300, image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=400&q=80", type: "B2C", rating: 4.7 }
];

let villageProducts = [
  { id: "v1", artisan: "Radha Selvi (SHG)", village: "Kanchipuram, TN", name: "Pure Silk Handwoven Saree", category: "Handicrafts", price: 4200, unit: "pcs", quantity: 5, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80", rating: 5.0 },
  { id: "v2", artisan: "Chotu Ram", village: "Khurja, UP", name: "Handpainted Ceramic Pot", category: "Pottery", price: 450, unit: "pcs", quantity: 20, image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=400&q=80", rating: 4.7 },
  { id: "v3", artisan: "Bano Khatoon", village: "Madhubani, BR", name: "Madhubani Folk Art Painting", category: "Art", price: 1200, unit: "pcs", quantity: 8, image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80", rating: 4.9 }
];

let forums = [
  { id: "f1", title: "Best organic fertilizer for Alphonso Mangoes?", category: "Farming Tips", author: "Ramesh Kumar", date: "2026-06-28", content: "I've been planning to transition my mango orchard to completely organic fertilizers. What compositions of compost or bio-fertilizers have worked best for you in Maharashtra?", replies: [{ author: "Kiran Naik (Expert)", date: "2026-06-28", content: "You should try Panchagavya combined with neem cake formulation. It helps prevent stem borer and improves sweetness of Mangoes significantly!" }] },
  { id: "f2", title: "Direct shipping to Delhi wholesalers - cost estimation", category: "Logistics", author: "Gurpreet Singh", date: "2026-06-27", content: "Has anyone used the Farm2home logistics cold-chain storage network from Punjab to Delhi? I have a bulk batch of 500kg broccoli to ship next week.", replies: [] }
];

let orders = [
  { id: "ORD-9821", customerName: "Rajesh Sharma (Hotel Regency)", date: "2026-06-28", total: 11250, items: [{ name: "Basmati Rice (Bulk)", quantity: 150, price: 75 }], status: "In Transit", role: "Wholesaler", trackingId: "TRK-00128" },
  { id: "ORD-5412", customerName: "Anjali Gupta", date: "2026-06-29", total: 700, items: [{ name: "Premium Alphonso Mangoes", quantity: 2, price: 350 }], status: "Pending Pickup", role: "Customer", trackingId: "TRK-00129" }
];

let walletTransactions = [
  { id: "TXN-001", type: "credit", amount: 11250, description: "Bulk Basmati order payout", date: "2026-06-28T14:22:00Z" },
  { id: "TXN-002", type: "debit", amount: 450, description: "Logistics shipping fee payment", date: "2026-06-29T09:15:00Z" }
];

let sellerWalletBalance = 24500;

// ==========================================
// API ENDPOINTS
// ==========================================

// Get listings
app.get("/api/products", (req, res) => {
  res.json({ success: true, products, villageProducts });
});

// Add new listing
app.post("/api/products", (req, res) => {
  const { isVillage, name, category, price, unit, quantity, image, farmer, location, artisan, village } = req.body;
  
  if (isVillage) {
    const newP = {
      id: "v" + (villageProducts.length + 1),
      artisan: artisan || "Self Help Group",
      village: village || "Rural India",
      name,
      category,
      price: Number(price),
      unit,
      quantity: Number(quantity),
      image: image || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80",
      rating: 5.0
    };
    villageProducts.unshift(newP);
    res.json({ success: true, product: newP, type: "village" });
  } else {
    const newP = {
      id: String(products.length + 1),
      farmer: farmer || "Organic Farmer",
      location: location || "Rural India",
      name,
      category,
      price: Number(price),
      unit,
      quantity: Number(quantity),
      image: image || "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80",
      type: Number(price) > 500 || Number(quantity) >= 100 ? "B2B" : "B2C",
      rating: 5.0
    };
    products.unshift(newP);
    res.json({ success: true, product: newP, type: "farm" });
  }
});

// Delete product listing
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const isVillage = id.startsWith("v");
  if (isVillage) {
    villageProducts = villageProducts.filter((p) => p.id !== id);
  } else {
    products = products.filter((p) => p.id !== id);
  }
  res.json({ success: true });
});

// Place order
app.post("/api/orders", (req, res) => {
  const { customerName, items, total, role } = req.body;
  const newOrder = {
    id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
    customerName: customerName || "Guest User",
    date: new Date().toISOString().split("T")[0],
    total: Number(total),
    items: items || [],
    status: "Pending Pickup",
    role: role || "Customer",
    trackingId: "TRK-" + Math.floor(10000 + Math.random() * 90000)
  };
  orders.unshift(newOrder);

  // Credit seller earnings simulator
  sellerWalletBalance += Number(total);
  walletTransactions.unshift({
    id: "TXN-" + Math.floor(100 + Math.random() * 900),
    type: "credit",
    amount: Number(total),
    description: `Order ${newOrder.id} Direct Purchase`,
    date: new Date().toISOString()
  });

  res.json({ success: true, order: newOrder });
});

app.get("/api/orders", (req, res) => {
  res.json({ success: true, orders });
});

// Get/post wallet ledger
app.get("/api/wallet", (req, res) => {
  res.json({ success: true, balance: sellerWalletBalance, transactions: walletTransactions });
});

app.post("/api/wallet/transfer", (req, res) => {
  const { amount, upiId } = req.body;
  if (sellerWalletBalance < amount) {
    return res.status(400).json({ success: false, error: "Insufficient balance" });
  }
  sellerWalletBalance -= Number(amount);
  const newTxn = {
    id: "TXN-" + Math.floor(100 + Math.random() * 900),
    type: "debit" as const,
    amount: Number(amount),
    description: `Withdrawal to UPI ${upiId}`,
    date: new Date().toISOString()
  };
  walletTransactions.unshift(newTxn);
  res.json({ success: true, balance: sellerWalletBalance, transaction: newTxn });
});

app.post("/api/wallet/p2p", (req, res) => {
  const { amount, peerName, peerUpi, isPayment } = req.body;
  const amtNum = Number(amount);
  if (isNaN(amtNum) || amtNum <= 0) {
    return res.status(400).json({ success: false, error: "Invalid transfer amount" });
  }

  if (isPayment) {
    if (sellerWalletBalance < amtNum) {
      return res.status(400).json({ success: false, error: "Insufficient wallet balance to make payment" });
    }
    sellerWalletBalance -= amtNum;
    const newTxn = {
      id: "TXN-" + Math.floor(1000 + Math.random() * 9000),
      type: "debit" as const,
      amount: amtNum,
      description: `P2P Paid to ${peerName || "Retailer"} (${peerUpi || "mandi@upi"})`,
      date: new Date().toISOString()
    };
    walletTransactions.unshift(newTxn);
    res.json({ success: true, balance: sellerWalletBalance, transaction: newTxn });
  } else {
    sellerWalletBalance += amtNum;
    const newTxn = {
      id: "TXN-" + Math.floor(1000 + Math.random() * 9000),
      type: "credit" as const,
      amount: amtNum,
      description: `P2P Received from ${peerName || "Retailer"} (${peerUpi || "retail@upi"})`,
      date: new Date().toISOString()
    };
    walletTransactions.unshift(newTxn);
    res.json({ success: true, balance: sellerWalletBalance, transaction: newTxn });
  }
});

// Forums
app.get("/api/forums", (req, res) => {
  res.json({ success: true, forums });
});

app.post("/api/forums", (req, res) => {
  const { title, category, author, content } = req.body;
  const newPost = {
    id: "f" + (forums.length + 1),
    title,
    category,
    author: author || "Rural Leader",
    date: new Date().toISOString().split("T")[0],
    content,
    replies: []
  };
  forums.unshift(newPost);
  res.json({ success: true, post: newPost });
});

app.post("/api/forums/:id/reply", (req, res) => {
  const { author, content } = req.body;
  const { id } = req.params;
  const post = forums.find(f => f.id === id);
  if (post) {
    const newReply = {
      author: author || "Gramin Expert",
      date: new Date().toISOString().split("T")[0],
      content
    };
    post.replies.push(newReply);
    return res.json({ success: true, post });
  }
  res.status(404).json({ success: false, error: "Forum post not found" });
});

// ==========================================
// GEMINI AI CHAT & FEATURES ENDPOINTS
// ==========================================

// 1. Gramin AI Chatbot (Multi-turn Assistant)
app.post("/api/chat", async (req, res) => {
  const { message, history, userProfile } = req.body; // history is: { role: "user" | "model", parts: [{ text: string }] }[]
  
  if (!process.env.GEMINI_API_KEY) {
    // Simulation mode
    setTimeout(() => {
      const userName = userProfile?.name || "Kisan";
      res.json({
        text: `[SIMULATED Gramin AI Sahayak] Namaste, ${userName}! I am currently operating in offline/local simulator mode. \n\nRegarding your question "${message}", here is a helpful suggestion: Ensure regular soil moisture testing and try organic Panchagavya compost to boost crop immunity. How else can I support you?`
      });
    }, 1000);
    return;
  }

  try {
    const ai = getGeminiClient();
    
    // Build standard multi-turn list. Convert system-level message.
    let systemPrompt = `You are "Gramin AI Sahayak" (Rural AI Companion), an expert multi-lingual agricultural consultant, rural business strategist, branding mentor, and logistics coordinator for the Farm2home platform.
- Speak in helpful, respectful, and encouraging tones. Use a blend of simple English and regional Indian context (or regional words like Namaste, Kisan, Sahayak, SHG).
- Answer queries clearly about soil nutrition, crop diseases, dynamic wholesale pricing, smart logistics routes, direct village craft sales, and direct consumer models.
- Support farmers, artisans, and women self-help groups (SHGs) by explaining solutions step-by-step. Keep responses structured and beautifully formatted in clear Markdown.`;

    if (userProfile) {
      systemPrompt += `\n\nYou are currently talking to the following active user:
- Name: ${userProfile.name}
- Location: ${userProfile.location}
- Active Role: ${userProfile.role}
- Registration ID: ${userProfile.regd}
Please address them by their name and customize your response directly to their active role and location!`;
    }

    // Reconstruct the message format for Google GenAI SDK contents
    const contents = history ? [...history] : [];
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: "Failed to generate AI response: " + error.message });
  }
});

// 2. AI Branding Studio (Generator)
app.post("/api/ai/branding", async (req, res) => {
  const { businessType, productDetails, stateOrigin, language } = req.body;

  const isFarm2Home = businessType && (
    businessType.toLowerCase().includes("farm2home") ||
    businessType.toLowerCase().includes("farm-to-home") ||
    businessType.toLowerCase().includes("farm to home") ||
    businessType.toLowerCase().includes("kisan") ||
    businessType.toLowerCase().includes("rural platform")
  );

  if (!process.env.GEMINI_API_KEY) {
    // Simulated Branding Response
    setTimeout(() => {
      if (isFarm2Home) {
        res.json({
          brandName: "KrishiSetu (by Farm2Home)",
          tagline: "Bridging Village Hearts, Empowering Rural Hands, Nourishing Conscious Homes.",
          packagingConcept: "Eco-friendly, highly durable recycled kraft corrugated bento boxes. Sealed with a handcrafted biodegradable jute twine and printed with non-toxic soy ink. Features an integrated digital QR code linking directly to the farmer's live audit ledger and geographic profile to foster uncompromised trust.",
          productLabelText: "KRISHISETU DIRECT COOPERATIVE\n100% Traceable Direct-Sourced Agri-Goods\nMiddleman-Free Fair Settlement Guaranteed\nRural Empowerment & Women SHG Upliftment",
          marketingPost: "🌱 Empowering the hands that nourish us. Introducing KrishiSetu (by Farm2Home) — a community-driven trust ecosystem bridging local Indian smallholders directly with conscious urban families. By eliminating multi-tier middlemen, 100% of your purchase settles instantly in the farmer's Gramin Wallet. Join our digital Krishi Chaupal to support true rural self-reliance! #KrishiSetu #Farm2Home #RuralEmpowerment #DirectAgri #VocalForLocal #SHGPower",
          simulatedLogoSvg: `<svg viewBox="0 0 100 100" class="w-24 h-24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#047857" stroke-width="3" stroke-dasharray="2 2" />
  <circle cx="50" cy="50" r="41" fill="none" stroke="#047857" stroke-width="1" />
  <path d="M 30 55 A 20 20 0 0 1 70 55" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3 2" />
  <circle cx="50" cy="48" r="7" fill="#f59e0b" opacity="0.85" />
  <path d="M 32 68 C 30 50, 48 58, 50 42 C 52 58, 70 50, 68 68 C 60 76, 40 76, 32 68 Z" fill="#047857" opacity="0.1" />
  <path d="M 50 72 L 50 40" stroke="#047857" stroke-width="3" stroke-linecap="round" />
  <path d="M 50 56 Q 42 50 38 58 Q 45 62 50 56 Z" fill="#10b981" />
  <path d="M 50 48 Q 58 42 62 50 Q 55 54 50 48 Z" fill="#059669" />
  <circle cx="25" cy="50" r="2.5" fill="#f59e0b" />
  <circle cx="75" cy="50" r="2.5" fill="#f59e0b" />
  <circle cx="50" cy="25" r="2.5" fill="#047857" />
</svg>`
        });
      } else {
        res.json({
          brandName: `${stateOrigin || "Gramin"} ${businessType || "Pure"} Essentials`,
          tagline: "Sourced directly from village hearts, delivered fresh to healthy homes.",
          packagingConcept: "Eco-friendly, biodegradable woven jute pouches styled with traditional regional clay-print motifs to emphasize natural roots and premium organic purity.",
          productLabelText: "100% natural, hand-crafted, direct-from-farmer chemical-free pure produce.",
          marketingPost: `🌾 Direct from ${stateOrigin || "our local villages"} to your dining table! Feel the pure taste of tradition with our new ${businessType || "Organic"} collection. No middleman, 100% fair trade supporting women SHGs. Order today on Farm2home! #Farm2Home #VocalForLocal #GraminEcosystem`,
          simulatedLogoSvg: `<svg viewBox="0 0 100 100" class="w-24 h-24 text-green-600"><circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="4"/><path d="M50 20 C60 40 40 60 50 80 M40 40 Q50 30 60 40" fill="none" stroke="currentColor" stroke-width="3"/></svg>`
        });
      }
    }, 1000);
    return;
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Generate a complete brand and packaging profile for a rural seller on the Farm2home platform.
Details:
- Business/Product Type: ${businessType}
- Product description details: ${productDetails}
- Geographic/State Origin: ${stateOrigin}
- Target language response: ${language || "English"}

Respond strictly in structured JSON matching this schema:
{
  "brandName": "Elegant brand name reflecting local tradition and modern quality",
  "tagline": "Catchy direct-to-consumer tagline",
  "packagingConcept": "Detailed eco-friendly packaging structure, layout design, and colors description",
  "productLabelText": "Text and information to display on the physical product label",
  "marketingPost": "Ready-to-use social media/promotional launch text with hashtags",
  "simulatedLogoSvg": "Simple inline SVG markup representing the brand logo with warm earth tones (green/brown/orange), styled cleanly for display"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI Branding Studio Error:", error);
    res.status(500).json({ error: "Failed to generate brand identity: " + error.message });
  }
});

// 3. AI Crop Doctor / Assistant (Pest and disease diagnosis)
app.post("/api/ai/crop-doctor", async (req, res) => {
  const { imageBase64, cropName, observedSymptoms } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    // Simulator output
    setTimeout(() => {
      res.json({
        diagnosis: `Simulated Leaf Spot (Cercospora) / Pest infestation on ${cropName || "your plant"}`,
        confidence: "88%",
        symptoms: observedSymptoms || "Slight yellow spots on margins, dry outer edges, and micro-pest residues.",
        fertilizerRecommendation: "Apply Organic Neem Seed Kernel Extract (NSKE) spray 5% dilution. Balance organic nitrogen input and add vermicompost.",
        irrigationAdvice: "Reduce overhead sprinkler watering to avoid moisture retention on leaves. Prefer drip irrigation early in the morning.",
        weatherActionable: "High relative humidity (85%) expected for next 3 days. Ensure maximum spacing between crops for proper ventilation.",
        yieldImpact: "Low impact (&lt; 5%) if treated within 48 hours. Can escalate to 25% if untreated."
      });
    }, 1000);
    return;
  }

  try {
    const ai = getGeminiClient();
    
    let contents: any = [];
    let imagePart: any = null;

    if (imageBase64) {
      // Remove data header if present
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      imagePart = {
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64
        }
      };
    }

    const textPrompt = `You are the AI Farming Agronomist specialist on the Farm2home platform.
Diagnose this crop issue.
Crop Name: ${cropName || "Unknown Crop"}
Observed Symptoms: ${observedSymptoms || "None specified"}

Provide a direct, production-ready, structured advisory response in JSON matching this schema:
{
  "diagnosis": "Name of the crop disease or pest infestation with common/scientific term",
  "confidence": "Estimated confidence percentage (e.g. 92%)",
  "symptoms": "Detailed analysis of symptoms identified from image or description",
  "fertilizerRecommendation": "Organic/eco-friendly and chemical-free bio-fertilizer, neem oil, or treatment recipe step-by-step",
  "irrigationAdvice": "Actionable crop watering advice based on this condition",
  "weatherActionable": "Smart meteorological suggestions (e.g. 'Since high humidity is coming, avoid watering leaves')",
  "yieldImpact": "Estimated crop yield risk or loss impact if left untreated vs. treated"
}`;

    if (imagePart) {
      contents = { parts: [imagePart, { text: textPrompt }] };
    } else {
      contents = textPrompt;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4,
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI Crop Doctor Error:", error);
    res.status(500).json({ error: "Failed to process crop analysis: " + error.message });
  }
});

// 4. AI Business & Pricing Advisor (Demand, planning, and price intelligence)
app.post("/api/ai/business-advisor", async (req, res) => {
  const { productCategory, monthlySales, currentInventory, localRegion } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    // Simulator response
    setTimeout(() => {
      res.json({
        demandForecast: "Optimistic high demand expected in the upcoming 30 days due to festival-driven bulk procurement.",
        smartPricing: `Recommended premium retail target is ₹${Number(monthlySales) > 50 ? "110" : "125"} per unit (approx. 15% margin enhancement compared to general local mandi prices).`,
        growthStrategies: [
          "Set up a 'Village Group Direct Subscription' model to secure recurring weekly demand.",
          "Partner with local logistics cold storage hubs featured in Farm2home to prevent perishability losses.",
          "Promote products using the AI Branding Studio visual labels on your WhatsApp community storefront."
        ],
        competitorInsights: "Local physical mandi prices are depressed due to local transportation lockups, leaving a prime high-value online arbitrage direct-to-home gap."
      });
    }, 1000);
    return;
  }

  try {
    const ai = getGeminiClient();
    const prompt = `You are the senior AI Business Consultant on the Farm2home platform.
Provide an intelligence advisory report for a local farmer or artisan seller.
Product Category: ${productCategory}
Reported monthly sales volume: ${monthlySales} units
Current inventory level: ${currentInventory} units
Local Region: ${localRegion}

Respond strictly in JSON matching this schema:
{
  "demandForecast": "30-day forecast with specific localized context and drivers",
  "smartPricing": "Dynamic premium pricing advice comparing mandi middleman rates vs. direct online rates",
  "growthStrategies": ["List 3 specific, highly-actionable growth tips for SHGs/farmers"],
  "competitorInsights": "Actionable intelligence on physical mandi competitors, quality differences, and regional gaps"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.6,
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI Business Advisor Error:", error);
    res.status(500).json({ error: "Failed to generate business suggestions: " + error.message });
  }
});

// ==========================================
// VITE INTEGRATION & PRODUCTION ASSET SERVER
// ==========================================
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Farm2Home] Server online at http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error("Failed to start fullstack server:", err);
});
