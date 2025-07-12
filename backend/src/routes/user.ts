import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const userController = new UserController();

// All user routes require authentication
router.use(authMiddleware);

// GET /api/user/submissions - Get user's recommendation history
router.get("/submissions", (req, res) =>
  userController.getUserSubmissions(req, res)
);

// POST /api/user/submissions/:submissionId/feedback - Store feedback for a recommendation
router.post("/submissions/:submissionId/feedback", (req, res) =>
  userController.storeFeedback(req, res)
);

export { router as userRoutes };
