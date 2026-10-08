import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { loginZodSchema } from "../utils/validators.js";

const JWT_SECRET = process.env.JWT_SECRET || "emmbros_jwt_secret_dev_key_2026";
const COOKIE_NAME = "token";

export async function login(req, res, next) {
  try {
    const data = loginZodSchema.parse(req.body);

    const user = await User.findOne({ email: data.email.toLowerCase() }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({ ok: false, error: "Invalid email or password." });
    }

    const isValid = await user.comparePassword(data.password);
    if (!isValid) {
      return res.status(401).json({ ok: false, error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userObj = user.toObject();
    delete userObj.passwordHash;

    res.json({
      ok: true,
      token, // Also return token in body for optional Header usage
      user: userObj,
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ ok: true, message: "Logged out successfully." });
}

export async function getMe(req, res) {
  res.json({ ok: true, user: req.user });
}
