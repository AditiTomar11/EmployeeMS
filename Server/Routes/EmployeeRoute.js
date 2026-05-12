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
        // IMPORTANT: Ensure the folder 'public/images' exists in your backend root
        cb(null, 'public/images') 
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

// Define 'upload' BEFORE using it in routes
const upload = multer({ storage: storage })

// --- 2. ADD EMPLOYEE ROUTE ---
router.post('/add_employee', upload.single('image'), async (req, res) => {
    try {
        // 1. Check if file exists
        if (!req.file) {
            return res.json({ Status: false, Error: "No image uploaded" });
        }

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        // 3. Create new document
        const newEmployee = new EmployeeModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            address: req.body.address,
            salary: req.body.salary,
            image: req.file.filename, 
            category_id: req.body.category_id
        });

        // 4. Save to MongoDB
        await newEmployee.save();
        return res.json({ Status: true });
    } catch (err) {
        console.error("Save Error:", err);
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

// --- 3. GET ALL EMPLOYEES ---
router.get('/employee', async (req, res) => {
    try {
        const employees = await EmployeeModel.find();
        return res.json({ Status: true, Result: employees });
    } catch (err) {
        return res.json({ Status: false, Error: "Get Employee Error" });
    }
});

// --- EXISTING ROUTES ---

// Employee Login
router.post("/employee_login", async (req, res) => {
    try {
        const employee = await EmployeeModel.findOne({ email: req.body.email });
        if (employee) {
            const match = await bcrypt.compare(req.body.password, employee.password);
            if (match) {
                const token = jwt.sign(
                    { role: "employee", email: employee.email, id: employee._id },
                    "jwt_secret_key",
                    { expiresIn: "1d" }
                );
                res.cookie('token', token);
                return res.json({ loginStatus: true, id: employee._id });
            }
            return res.json({ loginStatus: false, Error: "Wrong Password" });
        }
        return res.json({ loginStatus: false, Error: "Wrong email" });
    } catch (err) {
        return res.json({ loginStatus: false, Error: "Server Error" });
    }
});

router.get('/detail/:id', async (req, res) => {
    try {
        const result = await EmployeeModel.findById(req.params.id);
        if (!result) return res.json({ Status: false, Error: "Not found" });
        return res.json([result]);
    } catch (err) {
        return res.json({ Status: false, Error: "Server Error" });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: true });
});

export { router as EmployeeRouter };