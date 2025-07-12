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
  details?: unknown;
}
