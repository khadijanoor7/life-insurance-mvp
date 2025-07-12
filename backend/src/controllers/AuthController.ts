import { Request, Response } from "express";
import { DatabaseService } from "../services/DatabaseService";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const db = new DatabaseService();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

export class AuthController {
  async signup(req: Request, res: Response) {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }
    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "User already exists." });
    }
    const user = await db.createUser({ email, password, firstName, lastName });
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, COOKIE_OPTIONS);
    return res.status(201).json({ message: "Signup successful!", token });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }
    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    await db.updateLastLogin(user.id);
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, COOKIE_OPTIONS);
    return res.json({ message: "Login successful!", token });
  }

  logout(req: Request, res: Response) {
    res.clearCookie("token", { path: "/" });
    return res.json({ message: "Logged out" });
  }
}
