import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";

export function EducationalContent() {
  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <CardTitle>Understanding Life Insurance Types</CardTitle>
        <CardDescription>
          Learn about different types of life insurance to make informed
          decisions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-600">Term Life Insurance</h4>
            <p className="text-sm text-gray-600">
              Provides coverage for a specific period (10, 20, or 30 years).
              Most affordable option with pure insurance protection.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-green-600">
              Whole Life Insurance
            </h4>
            <p className="text-sm text-gray-600">
              Permanent coverage with cash value component. Higher premiums but
              builds wealth over time.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-purple-600">
              Universal Life Insurance
            </h4>
            <p className="text-sm text-gray-600">
              Flexible permanent coverage with investment component. Premiums
              and death benefits can be adjusted.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
