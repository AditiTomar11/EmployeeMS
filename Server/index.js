import 'dotenv/config'; 
import express from "express";
import cors from 'cors';
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

const app = express();

// 1. Database Connection
// Ensure your .env file has MONGO_URI (not MONGODB_URI)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// 2. CORS Configuration
// Fixed origin to 5173 to match your Vite frontend
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// 3. Routes
// Using '/auth' for admin and '/employee' for employee data
app.use('/auth', adminRouter);
app.use('/employee', EmployeeRouter);

// 4. Auth Middleware
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(token) {
        Jwt.verify(token, process.env.JWT_SECRET || "jwt_secret_key", (err, decoded) => {
            if(err) return res.status(401).json({Status: false, Error: "Wrong Token"});
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        });
    } else {
        return res.status(403).json({Status: false, Error: "Not authenticated"});
    }
};

app.get('/verify', verifyUser, (req, res) => {
    return res.json({Status: true, role: req.role, id: req.id});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});