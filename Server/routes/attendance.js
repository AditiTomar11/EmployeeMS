import express from "express";
import Attendance from "../models/Attendance.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);

// GET attendance records (filter by employee, date range)
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.employee) filter.employee = req.query.employee;
    if (req.query.date) filter.date = req.query.date;
    if (req.query.from && req.query.to) {
      filter.date = { $gte: new Date(req.query.from), $lte: new Date(req.query.to) };
    }

    const records = await Attendance.find(filter)
      .populate("employee", "name employeeId department")
      .sort({ date: -1 });

    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST mark attendance
router.post("/", async (req, res) => {
  try {
    const record = await Attendance.create(req.body);
    res.status(201).json({ success: true, record });
  } catch (err) {
    // Handle duplicate (same employee + date)
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this employee on this date",
      });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update attendance record
router.put("/:id", async (req, res) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!record) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE attendance record
router.delete("/:id", async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }
    res.json({ success: true, message: "Attendance record deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;