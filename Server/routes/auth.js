import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// Register admin
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }
    await User.create({ name, email, password, role: "admin" });
    res.status(201).json({ success: true, message: "Admin account created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login — checks role and queries the right collection
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (role === "admin") {
      // Check admin (User) collection
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
      return res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: "admin" },
      });
    }

    if (role === "employee") {
      // Check Employee collection — only active employees can log in
      const employee = await Employee.findOne({ email });
      if (!employee) {
        return res.status(401).json({ success: false, message: "No account found. Contact your admin." });
      }
      if (employee.status === "inactive") {
        return res.status(403).json({ success: false, message: "Your account is inactive. Contact your admin." });
      }
      const isMatch = await employee.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
      const token = jwt.sign({ id: employee._id, role: "employee" }, process.env.JWT_SECRET, { expiresIn: "7d" });
      return res.json({
        success: true,
        token,
        user: { id: employee._id, name: employee.name, email: employee.email, role: "employee" },
      });
    }

    return res.status(400).json({ success: false, message: "Invalid role" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get current user
router.get("/me", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const user = await User.findById(req.user.id).select("-password");
      return res.json({ success: true, user: { ...user._doc, role: "admin" } });
    }
    const employee = await Employee.findById(req.user.id).select("-password");
    return res.json({ success: true, user: { ...employee._doc, role: "employee" } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;