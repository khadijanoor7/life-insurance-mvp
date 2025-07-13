"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Button } from "./ui/Button";
import { Alert, AlertDescription } from "./ui/Alert";
import { History, Star, MessageSquare } from "lucide-react";
import { logger } from "../lib/logger";

interface UserSubmission {
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

interface FeedbackFormProps {
  submissionId: number;
  onFeedbackSubmitted: () => void;
}

function FeedbackForm({
  submissionId,
  onFeedbackSubmitted,
}: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [conversionStatus, setConversionStatus] = useState<
    "pending" | "converted" | "declined"
  >("pending");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/user/submissions/${submissionId}/feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ rating, conversionStatus, notes }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit feedback");
      }

      logger.info("Feedback submitted successfully", {
        submissionId,
        rating,
        conversionStatus,
      });
      onFeedbackSubmitted();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit feedback";
      setError(errorMessage);
      logger.error("Feedback submission failed", {
        error: errorMessage,
        submissionId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Rating (1-5 stars)
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`p-1 ${
                rating >= star ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              <Star className="h-5 w-5 fill-current" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <select
          value={conversionStatus}
          onChange={(e) =>
            setConversionStatus(
              e.target.value as "pending" | "converted" | "declined"
            )
          }
          className="w-full p-2 border rounded-md"
        >
          <option value="pending">Still considering</option>
          <option value="converted">Purchased insurance</option>
          <option value="declined">Decided not to purchase</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows={3}
          placeholder="Any additional comments..."
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md py-3 text-lg font-semibold shadow-md transition-colors border border-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none mt-2"
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  );
}

export function UserHistory() {
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFeedbackFor, setShowFeedbackFor] = useState<number | null>(null);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/user/submissions", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch submissions");
      }

      const data = await response.json();
      setSubmissions(data.submissions);
      logger.info("User submissions fetched", {
        count: data.submissions.length,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch submissions";
      setError(errorMessage);
      logger.error("Failed to fetch user submissions", { error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            Loading your recommendation history...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
          <p className="text-gray-600">
            Start by getting your first life insurance recommendation!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Your Recommendation History
          </CardTitle>
          <CardDescription>
            View and provide feedback on your previous recommendations
          </CardDescription>
        </CardHeader>
      </Card>

      {submissions.map((submission) => (
        <Card key={submission.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {submission.recommendation_type}
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(submission.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-green-600">
                  {submission.coverage_amount}
                </p>
                <p className="text-sm text-gray-600">
                  {submission.monthly_premium}/month
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="font-medium">Age:</span> {submission.age}
              </div>
              <div>
                <span className="font-medium">Income:</span> $
                {submission.income.toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Dependents:</span>{" "}
                {submission.dependents}
              </div>
              <div>
                <span className="font-medium">Risk:</span>{" "}
                {submission.risk_tolerance}
              </div>
            </div>

            {submission.user_feedback && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-md">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm">
                  You rated this {submission.user_feedback}/5 stars
                  {submission.conversion_status &&
                    ` • ${submission.conversion_status}`}
                </span>
              </div>
            )}

            {!submission.user_feedback && (
              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setShowFeedbackFor(
                      showFeedbackFor === submission.id ? null : submission.id
                    )
                  }
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  {showFeedbackFor === submission.id
                    ? "Cancel"
                    : "Provide Feedback"}
                </Button>

                {showFeedbackFor === submission.id && (
                  <div className="mt-4 p-4 border rounded-md bg-gray-50">
                    <FeedbackForm
                      submissionId={submission.id}
                      onFeedbackSubmitted={() => {
                        setShowFeedbackFor(null);
                        fetchSubmissions(); // Refresh to show the feedback
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
