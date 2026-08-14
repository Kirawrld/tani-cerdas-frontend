// types/index.ts - TypeScript types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "petani" | "penyuluh" | "admin";
  location?: string;
  commodity: "kakao" | "padi" | "both";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  location?: string;
  commodity: "kakao" | "padi" | "both";
}

export interface ChatMessage {
  question: string;
  answer: string;
  sources: string[];
}

export interface DiseaseDetection {
  image_url: string;
  detected_disease: string;
  confidence: number;
  treatment_recommendation: string;
  commodity: "kakao" | "padi";
}

export interface PriceData {
  commodity: "kakao" | "padi";
  price: number;
  unit: string;
  source: string;
  date: string;
}

export interface PriceForecast {
  week: number;
  date: string;
  predicted_price: number;
  confidence_lower: number;
  confidence_upper: number;
}

export interface PriceRecommendation {
  action: "wait" | "sell_now";
  reason: string;
}

export interface PriceAlert {
  id: string;
  commodity: "kakao" | "padi";
  target_price: number;
  alert_type: "above" | "below";
  is_active: boolean;
  created_at: string;
}
