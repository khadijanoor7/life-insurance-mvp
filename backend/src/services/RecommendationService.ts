import type { FormData, Recommendation } from "../types";

export class RecommendationService {
  generateRecommendation(input: FormData): Recommendation {
    const { age, income, dependents, riskTolerance } = input;

    // Calculate base coverage (10x annual income + $100k per dependent)
    let baseCoverage = income * 10 + dependents * 100000;

    // Age-based adjustments
    if (age < 30) {
      baseCoverage *= 1.2; // Young people need more coverage for future growth
    } else if (age > 50) {
      baseCoverage *= 0.8; // Older people may need less coverage
    }

    // Dependent-based adjustments
    if (dependents > 0) {
      baseCoverage += dependents * 250000; // Additional coverage for each dependent
    }

    // Round to nearest $50k
    const coverage = Math.round(baseCoverage / 50000) * 50000;

    // Determine insurance type based on age and risk tolerance
    let insuranceType: string;
    let term: string;
    let monthlyPremiumBase: number;

    if (age < 35 && riskTolerance === "low") {
      insuranceType = "Term Life Insurance";
      term = "30 years";
      monthlyPremiumBase = coverage * 0.0008; // $0.80 per $1000 coverage
    } else if (
      age < 45 &&
      (riskTolerance === "low" || riskTolerance === "medium")
    ) {
      insuranceType = "Term Life Insurance";
      term = "20 years";
      monthlyPremiumBase = coverage * 0.001; // $1.00 per $1000 coverage
    } else if (riskTolerance === "high" && age < 50) {
      insuranceType = "Universal Life Insurance";
      term = "Lifetime";
      monthlyPremiumBase = coverage * 0.004; // $4.00 per $1000 coverage
    } else if (
      riskTolerance === "medium" ||
      (riskTolerance === "low" && age > 45)
    ) {
      insuranceType = "Whole Life Insurance";
      term = "Lifetime";
      monthlyPremiumBase = coverage * 0.006; // $6.00 per $1000 coverage
    } else {
      insuranceType = "Term Life Insurance";
      term = "10 years";
      monthlyPremiumBase = coverage * 0.0012; // $1.20 per $1000 coverage
    }

    // Age-based premium adjustments
    let ageMultiplier = 1;
    if (age > 40) ageMultiplier = 1.5;
    if (age > 50) ageMultiplier = 2.5;
    if (age > 60) ageMultiplier = 4;

    const monthlyPremium = Math.round(monthlyPremiumBase * ageMultiplier);

    // Generate explanation
    let explanation = `Based on your profile (age ${age}, ${dependents} dependents, ${riskTolerance} risk tolerance), `;

    if (insuranceType.includes("Term")) {
      explanation += `we recommend Term Life Insurance because it provides maximum coverage at the lowest cost. `;
    } else if (insuranceType.includes("Whole")) {
      explanation += `we recommend Whole Life Insurance because it combines insurance protection with guaranteed cash value growth. `;
    } else {
      explanation += `we recommend Universal Life Insurance because it offers flexibility and investment growth potential. `;
    }

    explanation += `The coverage amount of $${coverage.toLocaleString()} is calculated to replace your income and provide for your dependents' future needs.`;

    // Generate key benefits based on insurance type
    let keyBenefits: string[];

    if (insuranceType.includes("Term")) {
      keyBenefits = [
        "Lowest premium cost for maximum coverage",
        "Simple and straightforward coverage",
        "Can be converted to permanent insurance later",
        "Ideal for temporary needs like mortgage protection",
      ];
    } else if (insuranceType.includes("Whole")) {
      keyBenefits = [
        "Guaranteed cash value growth",
        "Lifetime coverage with level premiums",
        "Dividends may be paid (if eligible)",
        "Can borrow against cash value",
      ];
    } else {
      keyBenefits = [
        "Flexible premium payments",
        "Investment growth potential",
        "Adjustable death benefit",
        "Tax-advantaged cash accumulation",
      ];
    }

    return {
      type: insuranceType,
      coverage: `$${coverage.toLocaleString()}`,
      term: term,
      monthlyPremium: `$${monthlyPremium.toLocaleString()}`,
      explanation,
      keyBenefits,
    };
  }
}
