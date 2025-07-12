import { Request, Response } from "express";
import { DatabaseService } from "../services/DatabaseService";
import { logger } from "../utils/logger";

export class UserController {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async getUserSubmissions(req: Request, res: Response) {
    try {
      // @ts-ignore - user is added by authMiddleware
      const userId = req.user.userId;

      const submissions = await this.databaseService.getUserSubmissions(userId);

      logger.info("User submissions retrieved", {
        userId,
        count: submissions.length,
      });

      return res.json({
        success: true,
        submissions,
      });
    } catch (error) {
      logger.error("Failed to get user submissions", {
        error: error instanceof Error ? error.message : "Unknown error",
        // @ts-ignore
        userId: req.user?.userId,
      });
      return res.status(500).json({
        success: false,
        error: "Failed to retrieve submissions",
      });
    }
  }

  async storeFeedback(req: Request, res: Response) {
    try {
      // @ts-ignore - user is added by authMiddleware
      const userId = req.user.userId;
      const { submissionId } = req.params;
      const { rating, conversionStatus, notes } = req.body;

      // Validate input
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          error: "Rating must be between 1 and 5",
        });
      }

      if (
        !conversionStatus ||
        !["pending", "converted", "declined"].includes(conversionStatus)
      ) {
        return res.status(400).json({
          success: false,
          error: "Invalid conversion status",
        });
      }

      await this.databaseService.storeUserFeedback(
        parseInt(submissionId),
        userId,
        {
          rating,
          conversionStatus,
          notes,
        }
      );

      logger.info("User feedback stored", {
        userId,
        submissionId,
        rating,
        conversionStatus,
      });

      return res.json({
        success: true,
        message: "Feedback stored successfully",
      });
    } catch (error) {
      logger.error("Failed to store user feedback", {
        error: error instanceof Error ? error.message : "Unknown error",
        // @ts-ignore
        userId: req.user?.userId,
        submissionId: req.params.submissionId,
      });
      return res.status(500).json({
        success: false,
        error: "Failed to store feedback",
      });
    }
  }
}
