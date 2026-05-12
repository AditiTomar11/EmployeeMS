import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import multer from "multer";
import path from "path";
import { AdminModel } from "../models/Admin.js";
import { CategoryModel } from "../models/Category.js";
import { EmployeeModel } from "../models/Employee.js";

const router = express.Router();

// Admin Login
router.post("/adminlogin", async (req, res) => {
    try {
        const admin = await AdminModel.findOne({ email: req.body.email, password: req.body.password });
        if (admin) {
            const token = jwt.sign(
                { role: "admin", email: admin.email, id: admin._id },
                "jwt_secret_key",
                { expiresIn: "1d" }
            );
            res.cookie('token', token, { httpOnly: true, secure: false, sameSite: "lax" });
            return res.json({ loginStatus: true });
        } else {
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
    } catch (err) {
        return res.json({ loginStatus: false, Error: "Server Error" });
    }
});

// Category Routes
router.get('/category', async (req, res) => {
    try {
        const result = await CategoryModel.find({});
        return res.json({ Status: true, Result: result });
    } catch (err) {
        return res.json({ Status: false, Error: "Fetch Error" });
    }
});

router.post('/add_category', async (req, res) => {
    try {
        const newCategory = new CategoryModel({ name: req.body.category });
        await newCategory.save();
        return res.json({ Status: true });
    } catch (err) {
        return res.json({ Status: false, Error: "Save Error" });
    }
});

// Image Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'Public/Images'),
    filename: (req, file, cb) => cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// Employee Routes
router.post('/add_employee', upload.single('image'), async (req, res) => {
    try {
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
        return res.json({ Status: false, Error: "Add Employee Error" });
    }
});

router.get('/employee', async (req, res) => {
    try {
        const result = await EmployeeModel.find({});
        return res.json({ Status: true, Result: result });
    } catch (err) {
        return res.json({ Status: false, Error: "Fetch Error" });
    }
});

router.get('/employee/:id', async (req, res) => {
    try {
        const result = await EmployeeModel.findById(req.params.id);
        return res.json({ Status: true, Result: [result] });
    } catch (err) {
        return res.json({ Status: false, Error: "Fetch Error" });
    }
});

router.put('/edit_employee/:id', async (req, res) => {
    try {
        await EmployeeModel.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            salary: req.body.salary,
            address: req.body.address,
            category_id: req.body.category_id
        });
        return res.json({ Status: true });
    } catch (err) {
        return res.json({ Status: false, Error: "Update Error" });
    }
});

router.delete('/delete_employee/:id', async (req, res) => {
    try {
        await EmployeeModel.findByIdAndDelete(req.params.id);
        return res.json({ Status: true });
    } catch (err) {
        return res.json({ Status: false, Error: "Delete Error" });
    }
});

// Dashboard Statistics
router.get('/admin_count', async (req, res) => {
    const count = await AdminModel.countDocuments();
    return res.json({ Status: true, Result: [{ admin: count }] });
});

router.get('/employee_count', async (req, res) => {
    const count = await EmployeeModel.countDocuments();
    return res.json({ Status: true, Result: [{ employee: count }] });
});

router.get('/salary_count', async (req, res) => {
    const result = await EmployeeModel.aggregate([{ $group: { _id: null, totalSalary: { $sum: "$salary" } } }]);
    const total = result.length > 0 ? result[0].totalSalary : 0;
    return res.json({ Status: true, Result: [{ salaryOFEmp: total }] });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: true });
});

export { router as adminRouter };