import express from "express";
import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);

// GET all departments
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json({ success: true, departments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single department
router.get("/:id", async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    res.json({ success: true, department });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create department
router.post("/", async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json({ success: true, department });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update department
router.put("/:id", async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    res.json({ success: true, department });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE department (only if no employees assigned)
router.delete("/:id", async (req, res) => {
  try {
    const hasEmployees = await Employee.findOne({ department: req.params.id });
    if (hasEmployees) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete department with assigned employees",
      });
    }
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    res.json({ success: true, message: "Department deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;