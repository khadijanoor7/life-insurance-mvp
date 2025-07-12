import { Router } from "express";
import { DatabaseService } from "../services/DatabaseService";

const router = Router();
const dbService = new DatabaseService();

// GET /health - Application health check
router.get("/", async (req, res) => {
  try {
    // Check database connection
    const dbHealth = await dbService.healthCheck();

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        api: "healthy",
        database: dbHealth ? "healthy" : "unhealthy",
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };

    const statusCode = dbHealth ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: "Health check failed",
    });
  }
});

export { router as healthRoutes };
