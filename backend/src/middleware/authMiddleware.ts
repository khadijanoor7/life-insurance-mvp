import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Check for token in cookies first, then fall back to Authorization header
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res.status(401).json({ error: "Authentication token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // @ts-ignore
    req.user = decoded;
    next();
    return;
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
