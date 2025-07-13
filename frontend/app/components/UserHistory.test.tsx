import { render, screen, waitFor } from "@testing-library/react";
import { UserHistory } from "./UserHistory";

jest.mock("../lib/logger", () => ({
  logger: { info: jest.fn(), error: jest.fn() },
}));

describe("UserHistory", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("renders empty state", async () => {
    // Mock fetch to return empty submissions
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ submissions: [] }),
    }) as jest.MockedFunction<typeof fetch>;

    render(<UserHistory />);

    // Wait for the loading to finish and the empty state to appear
    await waitFor(() => {
      expect(screen.getByText(/No recommendations yet/i)).toBeInTheDocument();
    });
  });

  it("renders with submissions", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        submissions: [
          {
            id: 1,
            age: 30,
            income: 50000,
            dependents: 1,
            risk_tolerance: "low",
            recommendation_type: "Term Life Insurance",
            coverage_amount: "$500,000",
            monthly_premium: "$50",
            created_at: new Date().toISOString(),
          },
        ],
      }),
    }) as jest.MockedFunction<typeof fetch>;

    render(<UserHistory />);

    // Wait for the submission to appear
    await waitFor(() => {
      expect(screen.getByText(/Term Life Insurance/i)).toBeInTheDocument();
    });
  });

  it("handles fetch error", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    render(<UserHistory />);

    // Wait for error state to appear - the component shows the actual error message
    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });
});
