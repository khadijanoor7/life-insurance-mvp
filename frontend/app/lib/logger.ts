// Simple frontend logger utility
type LogLevel = "info" | "warn" | "error" | "debug";

interface LogData {
  message: string;
  data?: unknown;
  timestamp?: string;
  level: LogLevel;
}

class FrontendLogger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private log(level: LogLevel, message: string, data?: unknown) {
    const logData: LogData = {
      message,
      data,
      timestamp: new Date().toISOString(),
      level,
    };

    // In development, log to console with colors
    if (this.isDevelopment) {
      const colors = {
        info: "color: #0066cc",
        warn: "color: #ff9900",
        error: "color: #cc0000",
        debug: "color: #666666",
      };

      console.log(
        `%c[${level.toUpperCase()}] ${message}`,
        colors[level],
        data || ""
      );
    }

    // In production, you could send to a logging service
    // For now, just console.log for simplicity
    if (!this.isDevelopment) {
      console.log(JSON.stringify(logData));
    }
  }

  info(message: string, data?: unknown) {
    this.log("info", message, data);
  }

  warn(message: string, data?: unknown) {
    this.log("warn", message, data);
  }

  error(message: string, data?: unknown) {
    this.log("error", message, data);
  }

  debug(message: string, data?: unknown) {
    if (this.isDevelopment) {
      this.log("debug", message, data);
    }
  }
}

export const logger = new FrontendLogger();
