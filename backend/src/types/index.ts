export interface FormData {
  age: number;
  income: number;
  dependents: number;
  riskTolerance: "low" | "medium" | "high";
}

export interface Recommendation {
  type: string;
  coverage: string;
  term: string;
  monthlyPremium: string;
  explanation: string;
  keyBenefits: string[];
}

export interface ApiResponse {
  success: boolean;
  recommendation: Recommendation;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: any;
}

export interface AnalyticsData {
  recommendation_type: string;
  risk_tolerance: string;
  total_recommendations: number;
  avg_coverage: number;
  avg_premium: number;
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

export interface UserSubmission {
  id: number;
  age: number;
  income: number;
  dependents: number;
  risk_tolerance: string;
  recommendation_type: string;
  coverage_amount: string;
  monthly_premium: string;
  created_at: string;
  user_feedback?: number;
  conversion_status?: string;
  notes?: string;
}

export interface FeedbackData {
  rating: number;
  conversionStatus: "pending" | "converted" | "declined";
  notes?: string;
}
