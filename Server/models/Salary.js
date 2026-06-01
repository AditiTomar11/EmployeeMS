import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    basicSalary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number },
    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    payDate: { type: Date },
  },
  { timestamps: true }
);

// Auto-calculate net salary before saving
salarySchema.pre("save", function (next) {
  this.netSalary = this.basicSalary + this.allowances - this.deductions;
  next();
});

export default mongoose.model("Salary", salarySchema);