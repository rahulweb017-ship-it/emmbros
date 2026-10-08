import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { logActivity } from "../models/ActivityLog.js";

// Admin: Get all users
export async function getUsers(req, res, next) {
  try {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
    res.json({ ok: true, data: users });
  } catch (err) {
    next(err);
  }
}

// Admin: Create user
export async function createUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ ok: false, error: "Name, email, and password are required." });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ ok: false, error: "A user with this email address already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: role && ["admin", "editor"].includes(role) ? role : "editor",
    });

    await newUser.save();

    await logActivity({
      req,
      action: "created_user",
      targetType: "user",
      targetId: newUser._id.toString(),
      details: `Created user ${newUser.name} (${newUser.role})`,
    });

    res.status(201).json({
      ok: true,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Admin: Update user
export async function updateUser(req, res, next) {
  try {
    const { name, email, role, password } = req.body;
    const userToUpdate = await User.findById(req.params.id);
    if (!userToUpdate) {
      return res.status(404).json({ ok: false, error: "User not found." });
    }

    if (name) userToUpdate.name = name.trim();
    if (email) userToUpdate.email = email.toLowerCase().trim();
    if (role && ["admin", "editor"].includes(role)) userToUpdate.role = role;
    if (password && password.length >= 6) {
      userToUpdate.passwordHash = await bcrypt.hash(password, 10);
    }

    await userToUpdate.save();

    await logActivity({
      req,
      action: "updated_user",
      targetType: "user",
      targetId: userToUpdate._id.toString(),
      details: `Updated user ${userToUpdate.name} profile/role`,
    });

    res.json({
      ok: true,
      data: {
        _id: userToUpdate._id,
        name: userToUpdate.name,
        email: userToUpdate.email,
        role: userToUpdate.role,
        updatedAt: userToUpdate.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Admin: Delete user
export async function deleteUser(req, res, next) {
  try {
    if (req.params.id === req.user.userId.toString()) {
      return res.status(400).json({ ok: false, error: "You cannot delete your own account." });
    }

    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ ok: false, error: "User not found." });
    }

    await logActivity({
      req,
      action: "deleted_user",
      targetType: "user",
      targetId: req.params.id,
      details: `Deleted user ${deleted.name} (${deleted.email})`,
    });

    res.json({ ok: true, message: "User deleted successfully." });
  } catch (err) {
    next(err);
  }
}
