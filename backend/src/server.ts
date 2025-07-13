import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import { recommendationRoutes } from "./routes/recommendation";
import { healthRoutes } from "./routes/health";
import { authRoutes } from "./routes/auth";
import { protectedRoutes } from "./routes/protected";
import { userRoutes } from "./routes/user";
import { authMiddleware } from "./middleware/authMiddleware";

// Load environment variables
dotenv.config();

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Cookie parsing middleware
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 API requests per minute
  message: "Too many API requests, please try again later.",
});

app.use(limiter);
app.use("/api", apiLimiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

// Routes
app.use("/health", healthRoutes);
app.use("/api/recommendation", authMiddleware, recommendationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/user", userRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

// Only start the server if not in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

export default app;
