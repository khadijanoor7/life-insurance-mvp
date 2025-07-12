"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Alert, AlertDescription } from "./ui/Alert";
import { Shield, Loader2 } from "lucide-react";
import type { FormData } from "../types";

const formSchema = z.object({
  age: z
    .number()
    .min(18, "Age must be at least 18")
    .max(80, "Age must be less than 80"),
  income: z.number().min(0, "Income must be positive"),
  dependents: z
    .number()
    .min(0, "Dependents must be 0 or more")
    .max(20, "Maximum 20 dependents"),
  riskTolerance: z.enum(["low", "medium", "high"]).refine((val) => !!val, {
    message: "Please select a risk tolerance",
  }),
});

interface RecommendationFormProps {
  onSubmit: (data: FormData) => void;
  loading: boolean;
  error: string;
  onReset?: () => void;
}

export function RecommendationForm({
  onSubmit,
  loading,
  error,
  onReset,
}: RecommendationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const riskTolerance = watch("riskTolerance");

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const handleReset = () => {
    reset();
    onReset?.();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Your Profile
        </CardTitle>
        <CardDescription>
          Tell us about yourself to get a personalized recommendation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              {...register("age", { valueAsNumber: true })}
              placeholder="Enter your age"
              min="18"
              max="80"
            />
            {errors.age && (
              <p className="text-sm text-red-600">{errors.age.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="income">Annual Income ($)</Label>
            <Input
              id="income"
              type="number"
              {...register("income", { valueAsNumber: true })}
              placeholder="Enter your annual income"
              min="0"
            />
            {errors.income && (
              <p className="text-sm text-red-600">{errors.income.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dependents">Number of Dependents</Label>
            <Input
              id="dependents"
              type="number"
              {...register("dependents", { valueAsNumber: true })}
              placeholder="Number of dependents"
              min="0"
              max="20"
            />
            {errors.dependents && (
              <p className="text-sm text-red-600">
                {errors.dependents.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="risk-tolerance">Risk Tolerance</Label>
            <Select
              value={riskTolerance}
              onValueChange={(value) =>
                setValue("riskTolerance", value as "low" | "medium" | "high")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your risk tolerance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  Low - I prefer guaranteed returns
                </SelectItem>
                <SelectItem value="medium">
                  Medium - I want balanced growth
                </SelectItem>
                <SelectItem value="high">
                  High - I&apos;m comfortable with market risk
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.riskTolerance && (
              <p className="text-sm text-red-600">
                {errors.riskTolerance.message}
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 text-lg font-semibold shadow-md transition-colors border border-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Recommendation...
                </>
              ) : (
                "Get My Recommendation"
              )}
            </Button>
            {onReset && (
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
