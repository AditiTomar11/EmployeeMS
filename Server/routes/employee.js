import express from "express";
import Employee from "../models/Employee.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);

// Only admins can manage employees
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access only" });
  }
  next();
};

// GET all employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find()
      .select("-password")
      .populate("department", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single employee
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .select("-password")
      .populate("department", "name");
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
    res.json({ success: true, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create employee (admin only) — password set by admin
router.post("/", adminOnly, async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    const result = employee.toObject();
    delete result.password;
    res.status(201).json({ success: true, employee: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update employee (admin only)
router.put("/:id", adminOnly, async (req, res) => {
  try {
    // If password is empty string, don't update it
    if (req.body.password === "") delete req.body.password;

    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    }).select("-password").populate("department", "name");

    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
    res.json({ success: true, employee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE employee (admin only)
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });
    res.json({ success: true, message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;