import request from "supertest";
import app from "../server";

describe("Basic API Tests", () => {
  it("should return health status", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status");
    expect(res.body.status).toBe("healthy");
  });

  it("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/api/unknown");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should reject unauthenticated recommendation requests", async () => {
    const res = await request(app).post("/api/recommendation").send({
      age: 30,
      income: 80000,
      dependents: 2,
      riskTolerance: "medium",
    });

    expect(res.status).toBe(401);
  });

  it("should reject unauthenticated user submissions requests", async () => {
    const res = await request(app).get("/api/user/submissions");

    expect(res.status).toBe(401);
  });
});
