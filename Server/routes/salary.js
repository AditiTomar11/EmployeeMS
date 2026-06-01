import express from "express";
import Salary from "../models/Salary.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);

// GET all salary records (optionally filter by employee)
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.month) filter.month = req.query.month;
    if (req.query.year) filter.year = req.query.year;

    const salaries = await Salary.find(filter)
      .populate("employee", "name employeeId department")
      .sort({ year: -1, month: -1 });

    res.json({ success: true, salaries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single salary record
router.get("/:id", async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id).populate(
      "employee",
      "name employeeId department"
    );
    if (!salary) {
      return res.status(404).json({ success: false, message: "Salary record not found" });
    }
    res.json({ success: true, salary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create salary record
router.post("/", async (req, res) => {
  try {
    // Prevent duplicate salary for same employee + month + year
    const existing = await Salary.findOne({
      employee: req.body.employee,
      month: req.body.month,
      year: req.body.year,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Salary record already exists for this month",
      });
    }
    const salary = await Salary.create(req.body);
    res.status(201).json({ success: true, salary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update salary record
router.put("/:id", async (req, res) => {
  try {
    const salary = await Salary.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!salary) {
      return res.status(404).json({ success: false, message: "Salary record not found" });
    }
    res.json({ success: true, salary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE salary record
router.delete("/:id", async (req, res) => {
  try {
    const salary = await Salary.findByIdAndDelete(req.params.id);
    if (!salary) {
      return res.status(404).json({ success: false, message: "Salary record not found" });
    }
    res.json({ success: true, message: "Salary record deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;