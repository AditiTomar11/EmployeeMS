import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js"; 
import { adminRouter } from "./Routes/AdminRoute.js";

const app = express();

// 1. Middleware
// Updated CORS to allow credentials (cookies) for login
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(express.static('public')); 

// 2. Database Connection
// Ensure MONGODB_URI is defined in your .env file
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.log("Database connection error:", err));

// 3. Routes
app.use("/auth", EmployeeRouter); 
app.use("/admin", adminRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});