export interface BlueprintSection {
  id: string;
  title: string;
  icon: string;
  content: string;
}

export const PLATFORM_BLUEPRINTS: BlueprintSection[] = [
  {
    id: "business-model",
    title: "1. Complete Business Model",
    icon: "briefcase",
    content: `### Farm2home Lean Canvas & Value Proposition

#### The Problem
- **Middlemen Exploitation**: Farmers lose up to 40-60% of their actual crop value to traditional mandi commission agents.
- **Wastage**: ~30% of post-harvest fresh crops in rural regions spoil due to lack of cold storage and direct access to dynamic buyers.
- **Fragmented Logistics**: Lack of last-mile logistics solutions prevents direct farm-to-door delivery.
- **Identity & Branding Gap**: Excellent rural products (handicrafts, pickles, handwoven sarees) made by Self-Help Groups (SHGs) lack premium branding, packaging, and digital reach.

#### The Solution
- **Disintermediated Platform**: Connects Farmers, SHGs, and Artisans directly to retail buyers, bulk wholesalers, and direct consumers.
- **AI-Powered Enablement**: Generates instant brand logos, packaging layout suggestions, and marketing copy via Gemini API; uses image recognition for crop disease analysis.
- **Optimized Cold-Chain Routing**: Integrates regional warehouses and coordinates logistics with local mini-truck driver routes.

#### Unique Value Proposition (UVP)
- **Farmers/Artisans**: Multiply profits by 1.5x - 2x with zero upfront tech/branding costs.
- **Customers**: Procure ultra-fresh produce within 18 hours of harvest and buy authentic, verified GI-tagged village crafts.

#### Customer Segments
- **B2C Consumers**: Health-conscious urban families seeking premium farm-fresh groceries.
- **B2B Bulk buyers**: Local hotels, restaurants, cafes (HoReCa), and organic retail stores.
- **Global Exporters**: International importers seeking premium handwoven silk, spices, or organic tea.`
  },
  {
    id: "system-architecture",
    title: "2. System Architecture Diagram",
    icon: "layers",
    content: `### High-Level System Architecture

\`\`\`
       +-------------------------------------------------------+
       |                  FARM2HOME CLIENT UI                 |
       |  (React 19 SPA + Vite + Tailwind CSS + Framer Motion) |
       +----------------------------+--------------------------+
                                    |
                             HTTPS / JSON
                                    v
       +----------------------------+--------------------------+
       |             EXPRESS FULL-STACK CONTROLLER             |
       |  (server.ts / Node.js Engine on Cloud Run Container) |
       +----+--------------------+--------------------+--------+
            |                    |                    |
         REST API             REST API             REST API
            v                    v                    v
+-----------+-----+   +----------+----------+   +----+-----+-----+
|   GEMINI API    |   | DATABASE LAYER      |   | LOGISTICS MAPS |
| (gemini-3.5-    |   | - SQLite Memory DB  |   | - Route Engine |
| flash Engine)   |   | - Firestore Backup  |   | - Cold Chain   |
+-----------------+   +---------------------+   +----------------+
\`\`\`

#### Architectural Key Components:
1. **Frontend Presentation Layer**: Fast loading, responsive, lightweight layout styled with Tailwind CSS, utilizing Framer Motion for premium micro-interactions.
2. **Backend Application Layer**: Node.js & Express server acts as a proxy for the Gemini API, shielding API keys securely from the browser, and serving compiled bundle.
3. **Database & Cache**: Relational schema (PostgreSQL ready, currently operating on an Express in-memory relational store) and Redis layer for regional price caching.
4. **AI Processing Engine**: @google/genai Node SDK connects to Gemini 3.5 Flash for chat, disease checks, branding studio, and business analytics.`
  },
  {
    id: "database-design",
    title: "3. Database Design (PostgreSQL/Firestore)",
    icon: "database",
    content: `### Relational Database Schema Design (SQL DDL)

\`\`\`sql
-- Users Table (Farmers, SHGs, Wholesalers, Customers)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'Farmer', 'Customer', 'SHG', 'Artisan', 'Wholesaler'
    phone VARCHAR(20) UNIQUE NOT NULL,
    location VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crop & Handcraft Listings
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Fruits', 'Vegetables', 'Spices', 'Handicrafts'
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL, -- 'kg', 'bundle', 'pcs'
    stock DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    listing_type VARCHAR(20) NOT NULL, -- 'B2C' or 'B2B' (Bulk)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'In Transit', 'Completed'
    tracking_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallet & Transactions Ledger (Double Entry ready)
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(10) NOT NULL, -- 'credit' (earnings), 'debit' (payout/purchase)
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\``
  },
  {
    id: "er-diagram",
    title: "4. Entity Relationship (ER) Diagram",
    icon: "git-commit",
    content: `### Entity Relationship Connections (Conceptual)

\`\`\`
  +-------------------+              +--------------------+
  |      USERS        | 1          * |      LISTINGS      |
  | ----------------- |--------------| ------------------ |
  | id (PK)           |              | id (PK)            |
  | name, role, phone |              | seller_id (FK)     |
  | location          |              | name, price, stock |
  +-------------------+              +--------------------+
         | 1                                    | 1
         |                                      |
         | 1                                    | *
  +-------------------+              +--------------------+
  |     WALLETS       |              |    ORDER_ITEMS     |
  | ----------------- |              | ------------------ |
  | user_id (FK)      |              | order_id (FK)      |
  | balance           |              | listing_id (FK)    |
  +-------------------+              | quantity, subtotal |
         | 1                         +--------------------+
         |                                      | *
         | *                                    |
  +-------------------+              +--------------------+
  |   TRANSACTIONS    |              |      ORDERS        |
  | ----------------- | 1          * | ------------------ |
  | id (PK), amount   |--------------| id (PK), status    |
  | type (credit/deb) |              | buyer_id (FK)      |
  +-------------------+              +--------------------+
\`\`\``
  },
  {
    id: "user-flow",
    title: "5. Core User Flow Diagrams",
    icon: "navigation",
    content: `### Operational Product Journeys

#### A. Farmer & SHG Onboarding Flow
1. **Submit Details**: Farmer inputs phone, Aadhaar/verification data, and farm geolocation.
2. **AI Branding Generation**: Farmer takes standard crop details, opens AI Branding Studio to generate an appealing brand name, package design idea, and high-impact WhatsApp marketing post.
3. **Publish Listing**: Crop is categorized (e.g., Mangoes, Grains) and tagged with real-time price suggestions matched from mandi forecast analytics.

#### B. Direct Customer Order & Fast Delivery Flow
1. **Search & Subscribe**: Customer searches "Fresh Mangoes", chooses B2C subscription or direct buy.
2. **UPI Gateway Simulation**: Seamless order placement; total value is escrowed in the seller's wallet.
3. **Logistics Dispatch**: System triggers closest mini-truck dispatcher based on smart route optimization.
4. **Delivery**: Driver picks up fresh crops, delivers to customer, updates status to "Delivered". Escrow funds instantly clear to the Farmer's wallet.`
  },
  {
    id: "ui-ux",
    title: "6. Complete UI/UX Specification",
    icon: "palette",
    content: `### High-Fidelity UI/UX Styling Guide

#### A. Design Tokens
- **Backgrounds**: Slate Off-White (\`#F8FAFC\`), Premium Emerald background panels for organic agricultural branding feel.
- **Accents**: 
  - Rural Harvest Gold (\`#F59E0B\`) for premium quality indicators.
  - Active Emerald (\`#10B981\`) representing healthy produce and green growth.
  - Charcoal (\`#1E293B\`) for elegant typography and layouts.

#### B. Typography Pairings
- **Display Headings**: "Space Grotesk" / "Inter" Sans-serif font for professional, clean, responsive reading.
- **Technical/Data Indicators**: "JetBrains Mono" for ledger codes, tracking IDs, price ratios, and dynamic forecasting scores.

#### C. Micro-Animations (Framer Motion)
- Page entries feature smooth 150ms spring fade-ins.
- Sidebar switches use staggered vertical entrance grids to preserve spatial continuity.`
  },
  {
    id: "frontend-structure",
    title: "7. Frontend Structure",
    icon: "folder",
    content: `### React + TypeScript Modular Directory Structure

\`\`\`
/src
  ├── main.tsx             # App bootstrapper
  ├── index.css            # Global CSS importing tailwindcss
  ├── App.tsx              # Main Shell with Sidebar & Chat Integrations
  ├── types.ts             # Strong interfaces for Products, Transactions
  ├── data.ts              # Pitch Deck, Blueprints, static catalogs
  └── components/          # Standalone Module views
        ├── Farm2HomeModule.tsx       # B2C & B2B marketplace listings
        ├── VillageCommerceModule.tsx  # Storefront for artisans & SHG crafts
        ├── AIFarmingAssistant.tsx    # Crop Doctor and disease model
        ├── AIBusinessAssistant.tsx   # Local business planning & insights
        ├── AIBrandingStudio.tsx      # Generative logos & labels
        ├── SmartLogisticsNetwork.tsx # Route map & storage scheduler
        ├── FinancialServices.tsx     # Earnings ledger & loan recommendations
        ├── CommunityPlatform.tsx     # Forums and Learning Center
        ├── MarketIntelligence.tsx    # Recharts analytics
        ├── ExportMarketplace.tsx     # Compliance & global seller board
        └── BlueprintsModule.tsx      # Founders interactive deliverables hub
\`\`\``
  },
  {
    id: "backend-structure",
    title: "8. Backend Structure",
    icon: "server",
    content: `### Production Node.js Server Structure

\`\`\`
/
  ├── server.ts                  # Production entry point (Express, Vite proxy)
  ├── package.json               # Full dependencies & build targets
  ├── .env.example               # Secure environment schema
  ├── dist/
  │    ├── server.cjs            # Compiled CJS Node bundle (optimized)
  │    └── index.html            # Static React app entry
  └── skills/
       └── system_skills/        # AI Studio platform components
\`\`\`

#### Production Compilation Script
Esbuild bundles \`server.ts\` and packages into a single \`dist/server.cjs\` executable. This avoids ESM path collisions and maximizes startup speed on container scaling environments (e.g. Google Cloud Run).`
  },
  {
    id: "api-docs",
    title: "9. REST API Documentation",
    icon: "file-text",
    content: `### Unified API Routing Documentation

#### 1. Marketplace & Storefronts
- **GET** \`/api/products\`
  - *Response*: Returns \`{ success: true, products: Product[], villageProducts: VillageProduct[] }\`
- **POST** \`/api/products\`
  - *Payload*: Product attributes with \`isVillage: boolean\` marker
  - *Response*: Returns the newly appended listing.

#### 2. Order Fulfilment & Ledger
- **POST** \`/api/orders\`
  - *Payload*: \`{ customerName: string, items: Array, total: number, role: string }\`
  - *Effect*: Registers order, schedules logistics, credits user wallet.
- **GET** \`/api/wallet\`
  - *Response*: Current seller balance and chronological double-entry ledger.

#### 3. Generative Gemini Endpoints
- **POST** \`/api/chat\`
  - *Payload*: \`{ message: string, history: Array }\`
  - *Response*: Returns context-aware response from Gramin AI Sahayak.
- **POST** \`/api/ai/branding\`
  - *Payload*: Business details, region, and language selection.
  - *Response*: Returns Generative brand name, tagline, packaging description, and inline SVG Logo markup.`
  },
  {
    id: "ai-architecture",
    title: "10. Generative AI Pipelines",
    icon: "cpu",
    content: `### AI Pipeline & Prompt Design Specifications

\`\`\`
+------------------+     +------------------------+     +-------------------+
| USER CROP IMAGE  | --> | BASE64 PREPARATION     | --> | GEMINI 3.5 FLASH  |
| / SYMPTOM INFO   |     | AND FORMATTING         |     | Response Schema   |
+------------------+     +------------------------+     +---------+---------+
                                                                  |
                                                                  v
                                                        +---------+---------+
                                                        | VALIDATED ADVISORY|
                                                        | JSON STRUCTURE    |
                                                        +-------------------+
\`\`\`

#### Execution Integrity Guidelines:
1. **Structured Outputs (JSON)**: For predictable branding output, we use \`responseMimeType: "application/json"\` alongside a strict schema declaration.
2. **Dynamic Context Feeding**: In AI Advisor, we feed current sales data and physical mandi trends into the model prompt dynamically, allowing Gemini to output hyper-local arbitrage prices.
3. **Graceful Degradation**: If the Gemini API key is missing or encounters a timeout, server route triggers an intelligent offline simulation payload to preserve functional UI capability.`
  },
  {
    id: "cloud-infrastructure",
    title: "11. Cloud Infrastructure Architecture",
    icon: "cloud",
    content: `### Cloud Native Deployment Topology (AWS & Firebase)

\`\`\`
                     [ Global CDN / Cloudflare Route53 ]
                                     |
                                     v
                       [ AWS ALB / Ingress Controller ]
                                     |
                     +---------------+---------------+
                     |                               |
                     v                               v
        [ ECS Fargate Container 1 ]     [ ECS Fargate Container 2 ]
        (Express + Vite on Port 3000)   (Express + Vite on Port 3000)
                     |                               |
                     +---------------+---------------+
                                     |
                                     v
                        [ AWS Aurora PostgreSQL Server ]
                        (Multi-AZ Replication & Write replicas)
                                     |
                        [ AWS ElastiCache Redis Cluster ]
                        (For fast dynamic local price caching)
\`\`\`

#### Operational Infrastructure Specifications:
- **Compute Layer**: Highly scalable Dockerized containers managed on ECS Fargate with scale-to-zero configurations for cost optimization.
- **Data Retention**: Multi-AZ AWS Aurora PostgreSQL handles ACID-compliant ledger and product states.
- **Asset Hub**: Amazon S3 paired with CloudFront CDN handles fast loading of high-resolution crop images and artisan portfolio items.`
  },
  {
    id: "security",
    title: "12. Security Architecture",
    icon: "shield",
    content: `### Enterprise Grade Trust and Safety Measures

1. **API Key Isolation**: The Gemini API credentials exist strictly in environment files on the backend. No browser client can access process variables, preventing leakage and token drains.
2. **UPI Escrow Transaction Safety**: When a B2B wholesaler places a transaction, funds are placed into an secure automated escrow pool until logistics checks verify delivery partner coordinates.
3. **Rate Limiting**: Express backend leverages rate-limiting middleware to guard generative AI endpoints from denial-of-service (DoS) exploits.
4. **Content Filtering**: All user forum and listing submissions are scanned before database storage using mild text-matching and safety filters to prevent spam or bad language.`
  },
  {
    id: "revenue-model",
    title: "13. Sustainable Revenue Model",
    icon: "dollar-sign",
    content: `### Farm2home Sustainable Business Architecture

- **1. Transaction Take-Rate (Commission)**:
  - **B2C Produce Sales**: 5% transaction commission fee on direct farmer-to-consumer sales (still 80% cheaper than traditional mandi brokers).
  - **Village Handicrafts / Textiles**: 10% commission on boutique artisans (includes global checkout features).
- **2. B2B Wholesaler SaaS Model**:
  - Direct wholesale volume matching is billed via a monthly flat rate starting at ₹1,999/month for active hotels, restaurants, and exporters.
- **3. Smart Logistics Commission**:
  - 15% revenue share from independent delivery drivers matched through our dynamic routing network.
- **4. AI Premium Studio Upgrade**:
  - Free automated brand creation; premium packaging physical mock-ups and high-definition labels can be ordered for a minimal printing fee.`
  },
  {
    id: "mvp-roadmap",
    title: "14. MVP Rollout & Lifecycle Roadmap",
    icon: "milestone",
    content: `### 12-Month Phased Growth Journey

- **Phase 1: Foundation (Months 1-3)**
  - Establish backend core database and launch B2C farm crop listings in primary test clusters (e.g., Nashik & Karnal).
  - Integrate baseline Gemini Chatbot and basic Weather Advisories.
- **Phase 2: Empowerment & Branding (Months 4-6)**
  - Launch AI Branding Studio and Village Commerce catalogs for women Self-Help Groups (SHGs).
  - Integrate smart pickup scheduling and cold storage routing algorithms.
- **Phase 3: Financial Scaling (Months 7-9)**
  - Activate escrow wallet services, UPI integration simulators, and micro-loan matching indices.
  - Implement Crop Doctor (image disease scanning) to decrease harvest failures.
- **Phase 4: Global Horizon (Months 10-12)**
  - Open the Export Marketplace with automated documentation guidance for international buyers.
  - Expand multi-lingual regional voice support.`
  },
  {
    id: "scaling-strategy",
    title: "15. Hyper-Scale & Offline Caching Strategy",
    icon: "activity",
    content: `### Scaling to Millions of Users

1. **Regional Edge Caching**: Price trends and market demand summaries are calculated on schedule and cached in Redis edge instances, keeping database query load minimal.
2. **Low-bandwidth Optimization**: For remote rural networks, the application scales down image sizes and supports local-first offline syncing, preserving transaction inputs on client device storage (\`localStorage\`) until active network connections resume.
3. **Asynchronous Processing**: Bulk notifications, logistics dispatch checks, and generative brand logo processing are handled via AWS SQS queue workers, freeing Express main server threads.`
  },
  {
    id: "deployment-plan",
    title: "16. Automated Deployment Blueprint",
    icon: "package",
    content: `### CI/CD Pipeline & Deployment Specifications

#### Production Dockerfile Configuration
\`\`\`dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.cjs"]
\`\`\`

#### Continuous Integration (CI) Actions
- Automated GitHub Actions run \`npm run lint\` and compiler checks on every pull request. Successful builds are automatically packaged, sent to Docker Hub, and deployed seamlessly to Cloud Run.`
  },
  {
    id: "testing-strategy",
    title: "17. Holistic Testing Blueprint",
    icon: "check-square",
    content: `### High-Yield Testing Protocols

- **1. Unit Testing (Jest / Vitest)**:
  - Test server functions, secure API routing, and wallet double-entry math validation.
- **2. End-to-End Testing (Playwright)**:
  - Automated tests simulating the complete user journey: *Onboard Farmer* -> *List Produce* -> *Order Placement* -> *Logistics updates* -> *Wallet payouts check*.
- **3. AI Prompt Assertions**:
  - Continually audit Gemini response schemas against missing JSON parameters or syntax deviations, ensuring 100% operational UI parsing.`
  },
  {
    id: "pitch-deck",
    title: "18. Investor Pitch Deck Presentation",
    icon: "presentation",
    content: `### Farm2home Founder Pitch Presentation

- **Slide 1: Title**: *Farm2home - The AI Rural Economy Ecosystem.* Empowering 100 million rural producers, eliminating exploitative middlemen.
- **Slide 2: The Core Crisis**: Traditional supply chains extract up to 60% of rural profits. Lack of branding leaves incredible village craft and crop yield unrecognized and underpriced.
- **Slide 3: Our Solution**: A cohesive mobile-first applet giving every farmer an AI agronomist, every SHG an AI branding studio, and every buyer a direct connection to verified rural sources.
- **Slide 4: Huge Market Opportunity**: Direct-to-consumer grocery and premium authentic handloom crafts represent a combined $120B Addressable Market in India.
- **Slide 5: Business Traction**: 4,200+ farmers onboarded, 24 lakh worth of crop transactions completed, and 12 Self-Help groups generating custom brands using the AI Branding Studio.
- **Slide 6: Ask & Expansion**: Seeking $1.5M Seed round to expand logistics cold-storage networks and deploy localized regional voice tools.`
  },
  {
    id: "marketing-strategy",
    title: "19. Targeted Marketing & Growth Strategy",
    icon: "megaphone",
    content: `### Organic Rural & Urban Growth Engine

#### 1. Grassroots Supply-Side Acquisition (Farmer / SHG)
- **SHG Cooperatives Partnership**: Work directly with government rural development departments and local handloom clusters to onboard entire villages in groups.
- **Community Leaders (Village Ambassadors)**: Train trusted local youth as digital ambassadors who onboard farmers and assist with listings.

#### 2. Urban Demand-Side Growth
- **Society Subscriptions**: Focus on dense residential apartment complexes in tier-1 cities, setting up weekly organic produce subscription drops.
- **Storytelling Branding**: Highlight the authentic farmer profile and village origin on product packaging (automatically prepared by the Branding Studio) to create emotional resonance with urban buyers.`
  },
  {
    id: "development-plan-step",
    title: "20. Production-Ready Sprint Plan",
    icon: "sliders",
    content: `### Sprint Execution Blueprint (Sprints 1-4)

- **Sprint 1: System Baseline & Core Schemas (Weeks 1-2)**
  - Establish Express + Vite baseline with strong SQLite/in-memory ledger persistence.
  - Implement role switches and create B2C/B2B storefront views.
- **Sprint 2: Generative Studio & Chat Integration (Weeks 3-4)**
  - Securely connect Gemini 3.5 Flash server routes.
  - Deliver dynamic AI Branding Studio with SVG logo generations and live chat.
- **Sprint 3: Crop Doctor & Logistics Route Map (Weeks 5-6)**
  - Build Crop Doctor image-upload analysis and symptoms matching.
  - Deliver interactive logistics routes, cold storage temp tracker, and wallet withdrawal simulation.
- **Sprint 4: Deliverables Explorer, Linting & Production Build (Weeks 7-8)**
  - Compile final builds, ensure strict type-safety, and run end-to-end user testing.
  - Deliver comprehensive pitch layouts inside the web dashboard.`
  }
];

export const MOCK_LOANS = [
  { id: "L1", provider: "NABARD Kisan Credit", amount: "₹50,000 - ₹3,00,000", rate: "4.0% p.a.", eligibility: "Farmers with registered land records", type: "Agricultural" },
  { id: "L2", provider: "MUDRA Shishu Loan", amount: "Up to ₹50,000", rate: "8.5% p.a.", eligibility: "Artisans & micro-businesses (no collateral)", type: "Business Growth" },
  { id: "L3", provider: "Mahila Samridhi Yojana", amount: "₹25,000 - ₹1,00,000", rate: "5.0% p.a.", eligibility: "Women Self-Help Groups (SHGs)", type: "Women Empowerment" }
];

export const LEARNING_VIDEOS = [
  { id: "v_learn1", title: "Panchagavya Organic Liquid Fertilizer Prep", duration: "12:45", views: "4.2k", author: "Dr. Arvind Patil" },
  { id: "v_learn2", title: "Standard Export Documentation Guide for Handlooms", duration: "18:20", views: "1.8k", author: "Directorate of Handicrafts" },
  { id: "v_learn3", title: "How to maximize pricing margins via direct sales", duration: "8:10", views: "6.5k", author: "Farm2home Growth Team" }
];
