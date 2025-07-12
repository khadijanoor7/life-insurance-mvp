import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/profile", authMiddleware, (req: Request, res: Response) => {
  // @ts-ignore
  res.json({ message: "Protected profile route", user: req.user });
});

export { router as protectedRoutes };
