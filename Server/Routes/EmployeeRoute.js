import express from 'express';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import { EmployeeModel } from "../models/Employee.js";

const router = express.Router();

// --- 1. SET UP MULTER STORAGE ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images') 
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

// --- 2. EMPLOYEE LOGIN (Critical Fixes for Production) ---
router.post("/employee_login", async (req, res) => {
    try {
        const employee = await EmployeeModel.findOne({ email: req.body.email });
        if (employee) {
            const match = await bcrypt.compare(req.body.password, employee.password);
            if (match) {
                // FIX: Use the same secret as Admin and index.js
                const token = jwt.sign(
                    { role: "employee", email: employee.email, id: employee._id },
                    process.env.JWT_SECRET_KEY || "jwt_secret_key",
                    { expiresIn: "1d" }
                );

                // FIX: Cross-domain cookie settings for Vercel -> Render
                res.cookie('token', token, { 
                    httpOnly: true, 
                    secure: true,      // Must be true for HTTPS
                    sameSite: "none"   // Required for cross-site cookies
                });

                return res.json({ loginStatus: true, id: employee._id });
            }
            return res.json({ loginStatus: false, Error: "Wrong Password" });
        }
        return res.json({ loginStatus: false, Error: "Wrong email" });
    } catch (err) {
        console.error(err);
        return res.json({ loginStatus: false, Error: "Server Error" });
    }
});

// --- 3. ADD EMPLOYEE ROUTE ---
router.post('/add_employee', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ Status: false, Error: "No image uploaded" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        const newEmployee = new EmployeeModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            address: req.body.address,
            salary: req.body.salary,
            image: req.file.filename, 
            category_id: req.body.category_id
        });

        await newEmployee.save();
        return res.json({ Status: true });
    } catch (err) {
        console.error("Save Error:", err);
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

// --- 4. GET ALL EMPLOYEES ---
router.get('/employee', async (req, res) => {
    try {
        const employees = await EmployeeModel.find();
        return res.json({ Status: true, Result: employees });
    } catch (err) {
        return res.json({ Status: false, Error: "Get Employee Error" });
    }
});

// --- 5. EMPLOYEE DETAIL ---
router.get('/detail/:id', async (req, res) => {
    try {
        const result = await EmployeeModel.findById(req.params.id);
        if (!result) return res.json({ Status: false, Error: "Not found" });
        // Keeping the array format [result] to match your frontend logic
        return res.json([result]);
    } catch (err) {
        return res.json({ Status: false, Error: "Server Error" });
    }
});

// --- 6. LOGOUT ---
router.get('/logout', (req, res) => {
    // FIX: Clear with the same cross-domain attributes
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: "none" });
    return res.json({ Status: true });
});

export { router as EmployeeRouter };