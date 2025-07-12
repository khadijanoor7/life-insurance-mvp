import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { DollarSign, Users, Calendar, Shield, Loader2 } from "lucide-react";
import type { Recommendation } from "../types";

interface RecommendationResultProps {
  recommendation: Recommendation | null;
  loading: boolean;
}

export function RecommendationResult({
  recommendation,
  loading,
}: RecommendationResultProps) {
  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Your Recommendation
          </CardTitle>
          <CardDescription>
            Generating your personalized recommendation...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Your Recommendation
        </CardTitle>
        <CardDescription>
          Personalized life insurance recommendation based on your profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendation ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                {recommendation.type}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Coverage:</span>
                  <p className="text-green-700">{recommendation.coverage}</p>
                </div>
                <div>
                  <span className="font-medium">Term:</span>
                  <p className="text-green-700">{recommendation.term}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Est. Monthly Premium:</span>
                  <p className="text-green-700 text-lg font-semibold">
                    {recommendation.monthlyPremium}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Why This Recommendation?
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {recommendation.explanation}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Key Benefits
              </h4>
              <ul className="space-y-1">
                {recommendation.keyBenefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-700 flex items-start gap-2"
                  >
                    <span className="text-green-600 mt-1">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Next Steps:</strong> This is a preliminary
                recommendation. We recommend consulting with a licensed
                insurance agent to finalize your coverage and explore additional
                options.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Complete the form to get your personalized recommendation</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
