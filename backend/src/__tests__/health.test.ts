import request from "supertest";
import app from "../server";

describe("Health Check", () => {
  it("should return health status", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status");
    expect(res.body.status).toBe("healthy");
  });
});
