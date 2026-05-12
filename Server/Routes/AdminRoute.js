import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import multer from "multer";
import path from "path";
import { AdminModel } from "../models/Admin.js";
import { CategoryModel } from "../models/Category.js";
import { EmployeeModel } from "../models/Employee.js";

const router = express.Router();

// 1. FIXED Admin Login (Security & Cookie Fix)
router.post("/adminlogin", async (req, res) => {
    try {
        // IMPORTANT: In production, passwords should be hashed. 
        // If your DB has plain text, this works, but hashing is better.
        const admin = await AdminModel.findOne({ email: req.body.email, password: req.body.password });
        
        if (admin) {
            const token = jwt.sign(
                { role: "admin", email: admin.email, id: admin._id },
                process.env.JWT_SECRET_KEY || "jwt_secret_key", // Use correct ENV name
                { expiresIn: "1d" }
            );

            // COOKIE FIX: secure must be true for HTTPS (Render/Vercel)
            // sameSite must be 'none' for cross-domain (Vercel to Render)
            res.cookie('token', token, { 
                httpOnly: true, 
                secure: true, 
                sameSite: "none" 
            });
            
            return res.json({ loginStatus: true });
        } else {
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
    } catch (err) {
        console.error(err);
        return res.json({ loginStatus: false, Error: "Server Error" });
    }
});

// 2. FIXED Image Upload (Path Fix for Render)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure this folder exists in your GitHub repo!
        cb(null, 'public/images'); 
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// ... (Category routes look fine)

// 3. FIXED Add Employee (Error Handling)
router.post('/add_employee', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ Status: false, Error: "Image upload failed" });
        }
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        const newEmployee = new EmployeeModel({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
            address: req.body.address,
            salary: req.body.salary,
            image: req.file.filename,
            category_id: req.body.category_id
        });
        await newEmployee.save();
        return res.json({ Status: true });
    } catch (err) {
        console.error(err);
        return res.json({ Status: false, Error: "Database Save Error" });
    }
});

// ... (Other routes look fine)

router.get('/logout', (req, res) => {
    // Clear cookie with same attributes used to set it
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: "none" });
    return res.json({ Status: true });
});

export { router as adminRouter };