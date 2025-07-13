// GET /api/analytics - Get recommendation analytics (future feature)

import { Router } from "express";
import { RecommendationController } from "../controllers/RecommendationController";
const router = Router();
const recommendationController = new RecommendationController();

router.get("/", async (req, res, next) => {
  try {
    const analytics = await recommendationController.getAnalytics();
    res.json(analytics);
  } catch (error) {
    next(error);
  }
});

export { router as analyticsRoutes };