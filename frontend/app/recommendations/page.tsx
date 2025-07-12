"use client";

import { useState } from "react";
import { RecommendationForm } from "../components/RecommendationForm";
import { RecommendationResult } from "../components/RecommendationResult";
import { EducationalContent } from "../components/EducationalContent";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { logger } from "../lib/logger";
import type { FormData, Recommendation } from "../types";

export default function App() {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleFormSubmit = async (formData: FormData) => {
    setLoading(true);
    setError("");

    // Log form submission
    logger.info("Form submitted", {
      age: formData.age,
      income: formData.income,
      dependents: formData.dependents,
      riskTolerance: formData.riskTolerance,
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recommendation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get recommendation");
      }

      const data = await response.json();
      setRecommendation(data.recommendation);

      // Log successful recommendation
      logger.info("Recommendation received", {
        type: data.recommendation.type,
        coverage: data.recommendation.coverage,
        monthlyPremium: data.recommendation.monthlyPremium,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to get recommendation. Please try again.";
      setError(errorMessage);

      // Log error
      logger.error("Recommendation request failed", {
        error: errorMessage,
        formData,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRecommendation(null);
    setError("");
    logger.info("Form reset");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header showLogout />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Life Insurance Recommendation Engine
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get personalized life insurance recommendations based on your
            profile. Our intelligent system analyzes your needs to suggest the
            best coverage options.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-start">
          <div className="h-[540px] overflow-auto">
            <RecommendationForm
              onSubmit={handleFormSubmit}
              loading={loading}
              error={error}
              onReset={recommendation ? handleReset : undefined}
            />
          </div>
          <RecommendationResult
            recommendation={recommendation}
            loading={loading}
          />
        </div>
        <EducationalContent />
      </main>
      <Footer />
    </div>
  );
}
