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
// Uses the MONGO_URI from your Render environment variables
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// 2. CORS Configuration
// Updated to your specific Vercel domain to fix the 403 Forbidden error
app.use(cors({
    origin: ["https://employee-ms-chi.vercel.app", "https://employee-7xjjl1qcj-adititomar11s-projects.vercel.app"],
    methods: ['GET', 'POST', 'PUT', "DELETE"],
    credentials: true // Required for cookies/sessions
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// 3. Routes
app.use('/auth', adminRouter);
app.use('/employee', EmployeeRouter);

// 4. Auth Middleware
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(token) {
        Jwt.verify(token, process.env.JWT_SECRET_KEY || "jwt_secret_key", (err, decoded) => {
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

// 5. Start Server
const PORT = process.env.PORT || 3000; // Render usually provides a PORT
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});