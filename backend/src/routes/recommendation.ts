import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { RecommendationController } from "../controllers/RecommendationController";
import { logger } from "../utils/logger";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const recommendationController = new RecommendationController();

// Validation middleware
const validateRecommendationRequest = [
  body("age")
    .isInt({ min: 18, max: 80 })
    .withMessage("Age must be between 18 and 80"),
  body("income")
    .isInt({ min: 0 })
    .withMessage("Income must be a positive number"),
  body("dependents")
    .isInt({ min: 0, max: 20 })
    .withMessage("Dependents must be between 0 and 20"),
  body("riskTolerance")
    .isIn(["low", "medium", "high"])
    .withMessage("Risk tolerance must be low, medium, or high"),
];

// POST /api/recommendation - Generate recommendation
router.post(
  "/recommendation",
  authMiddleware, // Require authentication
  validateRecommendationRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Invalid input data",
          details: errors.array(),
        });
      }

      // Extract user ID (guaranteed by authMiddleware)
      // @ts-ignore - user is added by authMiddleware
      const userId = req.user?.userId;

      const result = await recommendationController.generateRecommendation(
        req.body,
        userId
      );

      logger.info("Recommendation generated successfully", {
        input: req.body,
        recommendationType: result.recommendation.type,
        userId: userId || "anonymous",
      });

      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
);

// GET /api/recommendation - Health check
router.get("/recommendation", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "life-insurance-recommendation-api",
    version: "1.0.0",
  });
});

// GET /api/analytics - Get recommendation analytics (future feature)
router.get(
  "/analytics",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analytics = await recommendationController.getAnalytics();
      res.json(analytics);
    } catch (error) {
      next(error);
    }
  }
);

export { router as recommendationRoutes };
