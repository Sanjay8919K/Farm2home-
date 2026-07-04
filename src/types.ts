export interface Product {
  id: string;
  farmer: string;
  location: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
  type: "B2C" | "B2B";
  rating: number;
}

export interface VillageProduct {
  id: string;
  artisan: string;
  village: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
  rating: number;
}

export interface ForumPost {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  content: string;
  replies: {
    author: string;
    date: string;
    content: string;
  }[];
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  status: string;
  role: string;
  trackingId: string;
}

export interface WalletTransaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
}

export type UserRole =
  | "Farmer"
  | "Customer"
  | "SHG"
  | "Artisan"
  | "Retailer"
  | "Wholesaler"
  | "Exporter"
  | "Logistics Partner"
  | "Admin";
