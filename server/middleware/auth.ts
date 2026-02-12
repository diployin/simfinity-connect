import { Request, Response, NextFunction } from "express";
import { verifyToken } from "server/utils/auth";
import * as ApiResponse from "../utils/response";
import { storage } from "../storage";


declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: string;
    }
  }
}

export const requireAuth = (req: any, res: Response, next: Function) => {
  if (req.session?.userId) {
    req.userId = req.session.userId;
    req.role = req.session.role;
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return ApiResponse.unauthorized(res, "Unauthorized");
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded: any = verifyToken(token);

    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch {
    return ApiResponse.unauthorized(res, "Invalid token");
  }
};

export const requireAdminOLD = (req: Request, res: Response, next: Function) => {
  if (!req.session.adminId) {
    return ApiResponse.unauthorized(res, "Unauthorized");
  }
  next();
};


export const requireAdmin = async (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const adminId = req.session.adminId;

    if (!adminId) {
      return ApiResponse.unauthorized(res, "Admin authentication required");
    }

    const admin = await storage.getAdminById(adminId);

    if (!admin) {
      return ApiResponse.unauthorized(res, "Admin not found");
    }

    // 🔥 THIS LINE FIXES EVERYTHING
    (req as any).user = admin;

    next();
  } catch (error) {
    console.error("requireAdmin error:", error);
    return ApiResponse.serverError(res, "Admin auth failed");
  }
};


export const optionalAdminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  // console.log("req.session", req.session)

  // 1️⃣ Session-based auth (same as requireAdmin)
  if (req.session?.adminId) {
    const admin = await storage.getAdminById(req.session.adminId);
    req.adminId = req.session.adminId;
    req.email = admin.email;
    return next();
  }

  // 2️⃣ Token-based auth (optional)
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(); // ✅ Public route – no auth required
  }

  try {
    const token = authHeader.split(" ")[1];
    if (!token) return next();

    const decoded: any = verifyToken(token);

    // console.log("Decoded token:", decoded);

    req.adminId = decoded.id;
    req.email = decoded.email;

    return next();
  } catch (err) {
    // ❌ Token was sent but invalid
    return ApiResponse.unauthorized(res, "Invalid token");
  }
};
