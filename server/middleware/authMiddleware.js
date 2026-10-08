import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "emmbros_jwt_secret_dev_key_2026";

export async function requireAuth(req, res, next) {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ ok: false, error: "Authentication required. Please log in." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ ok: false, error: "Invalid session user. Please log in again." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: "Invalid or expired session token." });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, error: "Authentication required." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ ok: false, error: "Access denied. Insufficient permissions." });
    }
    next();
  };
}
