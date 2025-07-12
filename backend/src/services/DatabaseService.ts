import { Pool } from "pg";
import { logger } from "../utils/logger";
import type { FormData, Recommendation, User } from "../types";
import bcrypt from "bcrypt";

export class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: false, // Force SSL off for local/dev Docker
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Handle pool errors
    this.pool.on("error", (err) => {
      logger.error("Unexpected error on idle client", err);
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      const client = await this.pool.connect();
      await client.query("SELECT 1");
      client.release();
      return true;
    } catch (error) {
      logger.error("Database health check failed", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return false;
    }
  }

  async storeSubmission(
    formData: FormData,
    recommendation: Recommendation,
    userId?: number
  ): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");

      const insertQuery = `
        INSERT INTO submissions (age, income, dependents, risk_tolerance, recommendation_type, coverage_amount, monthly_premium)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `;

      const values = [
        formData.age,
        formData.income,
        formData.dependents,
        formData.riskTolerance,
        recommendation.type,
        recommendation.coverage,
        recommendation.monthlyPremium,
      ];

      const result = await client.query(insertQuery, values);
      const submissionId = result.rows[0].id;

      // Link submission to user if userId is provided
      if (userId) {
        const linkQuery = `
          INSERT INTO user_submissions (user_id, submission_id)
          VALUES ($1, $2)
          ON CONFLICT (user_id, submission_id) DO NOTHING
        `;
        await client.query(linkQuery, [userId, submissionId]);
      }

      await client.query("COMMIT");

      logger.info("Submission stored successfully", {
        submissionId,
        userId: userId || "anonymous",
        formData,
        recommendationType: recommendation.type,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      logger.error("Failed to store submission", {
        error: error instanceof Error ? error.message : "Unknown error",
        formData,
        userId,
      });
      throw error;
    } finally {
      client.release();
    }
  }

  async getUserSubmissions(userId: number) {
    const client = await this.pool.connect();

    try {
      const query = `
        SELECT 
          s.id,
          s.age,
          s.income,
          s.dependents,
          s.risk_tolerance,
          s.recommendation_type,
          s.coverage_amount,
          s.monthly_premium,
          s.created_at,
          ra.user_feedback,
          ra.conversion_status,
          ra.notes
        FROM submissions s
        INNER JOIN user_submissions us ON s.id = us.submission_id
        LEFT JOIN recommendation_analytics ra ON s.id = ra.submission_id
        WHERE us.user_id = $1
        ORDER BY s.created_at DESC
      `;

      const result = await client.query(query, [userId]);
      return result.rows;
    } catch (error) {
      logger.error("Failed to get user submissions", {
        error: error instanceof Error ? error.message : "Unknown error",
        userId,
      });
      throw error;
    } finally {
      client.release();
    }
  }

  async getAnalytics() {
    const client = await this.pool.connect();

    try {
      const query = `
        SELECT 
          recommendation_type,
          risk_tolerance,
          COUNT(*) as total_recommendations,
          AVG(CAST(REPLACE(REPLACE(coverage_amount, '$', ''), ',', '') AS INTEGER)) as avg_coverage,
          AVG(CAST(REPLACE(REPLACE(monthly_premium, '$', ''), ',', '') AS INTEGER)) as avg_premium
        FROM submissions
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY recommendation_type, risk_tolerance
        ORDER BY total_recommendations DESC
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      logger.error("Failed to get analytics", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    } finally {
      client.release();
    }
  }

  async createUser(user: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {
    const client = await this.pool.connect();
    try {
      const password_hash = await bcrypt.hash(user.password, 10);
      const insertQuery = `
        INSERT INTO users (email, password_hash, first_name, last_name)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const values = [
        user.email,
        password_hash,
        user.firstName || null,
        user.lastName || null,
      ];
      const result = await client.query(insertQuery, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async updateLastLogin(userId: number): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query("UPDATE users SET last_login = NOW() WHERE id = $1", [
        userId,
      ]);
    } finally {
      client.release();
    }
  }

  async storeUserFeedback(
    submissionId: number,
    userId: number,
    feedback: {
      rating: number;
      conversionStatus: "pending" | "converted" | "declined";
      notes?: string;
    }
  ): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");

      // Verify the submission belongs to the user
      const ownershipQuery = `
        SELECT 1 FROM user_submissions 
        WHERE user_id = $1 AND submission_id = $2
      `;
      const ownershipResult = await client.query(ownershipQuery, [
        userId,
        submissionId,
      ]);

      if (ownershipResult.rows.length === 0) {
        throw new Error("Submission not found or access denied");
      }

      // Insert or update feedback
      const feedbackQuery = `
        INSERT INTO recommendation_analytics (submission_id, user_feedback, conversion_status, notes)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (submission_id) 
        DO UPDATE SET 
          user_feedback = EXCLUDED.user_feedback,
          conversion_status = EXCLUDED.conversion_status,
          notes = EXCLUDED.notes,
          created_at = CURRENT_TIMESTAMP
      `;

      await client.query(feedbackQuery, [
        submissionId,
        feedback.rating,
        feedback.conversionStatus,
        feedback.notes || null,
      ]);

      await client.query("COMMIT");

      logger.info("User feedback stored successfully", {
        submissionId,
        userId,
        rating: feedback.rating,
        conversionStatus: feedback.conversionStatus,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      logger.error("Failed to store user feedback", {
        error: error instanceof Error ? error.message : "Unknown error",
        submissionId,
        userId,
        feedback,
      });
      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
