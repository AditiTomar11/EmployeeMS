import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["present", "absent", "half-day", "leave"],
      required: true,
    },
    checkIn: { type: String, default: "" },
    checkOut: { type: String, default: "" },
    remarks: { type: String, default: "" },
  },
  { timestamps: true }
);

// Prevent duplicate attendance for same employee + date
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);