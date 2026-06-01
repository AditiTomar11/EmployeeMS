import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import employeeRouter from "./routes/employee.js";
import departmentRouter from "./routes/department.js";
import salaryRouter from "./routes/salary.js";
import attendanceRouter from "./routes/attendance.js";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/salary", salaryRouter);
app.use("/api/attendance", attendanceRouter);

// Health check
app.get("/", (req, res) => res.json({ message: "Server is running" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("DB connection error:", err));