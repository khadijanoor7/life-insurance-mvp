import { RecommendationService } from "../services/RecommendationService";
import { DatabaseService } from "../services/DatabaseService";
import { logger } from "../utils/logger";
import type { FormData, ApiResponse } from "../types";

export class RecommendationController {
  private recommendationService: RecommendationService;
  private databaseService: DatabaseService;

  constructor() {
    this.recommendationService = new RecommendationService();
    this.databaseService = new DatabaseService();
  }

  async generateRecommendation(
    formData: FormData,
    userId?: number
  ): Promise<ApiResponse> {
    try {
      // Generate recommendation using business logic
      const recommendation =
        this.recommendationService.generateRecommendation(formData);

      // Store submission in database (async, don't wait)
      this.databaseService
        .storeSubmission(formData, recommendation, userId)
        .catch((error) => {
          logger.error("Failed to store submission", {
            error: error.message,
            formData,
            userId,
          });
        });

      return {
        success: true,
        recommendation,
      };
    } catch (error) {
      logger.error("Failed to generate recommendation", {
        error: error instanceof Error ? error.message : "Unknown error",
        formData,
        userId,
      });
      throw error;
    }
  }

  async getAnalytics() {
    try {
      const analytics = await this.databaseService.getAnalytics();
      return {
        success: true,
        analytics,
      };
    } catch (error) {
      logger.error("Failed to get analytics", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }
}
