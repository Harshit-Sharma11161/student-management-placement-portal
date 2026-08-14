const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Student = require("../models/Student");

const router = express.Router();


// Create JWT token
const createToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};


// ================= REGISTER =================

router.post("/register", async (req, res) => {

    try {

        const { name, email, password, role } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required."
            });
        }


        // Check password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters."
            });
        }


        // Check whether user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered."
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role === "admin" ? "admin" : "student"
        });


        // Create student profile automatically
        if (user.role === "student") {

            await Student.create({
                user: user._id
            });

        }


        // Generate JWT
        const token = createToken(user._id);


        // Send response
        res.status(201).json({

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// ================= LOGIN =================

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;


        // Find user
        const user = await User.findOne({ email });

        if (!user) {

            return res.status(401).json({
                message: "Invalid email or password."
            });

        }


        // Compare password
        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );


        if (!passwordMatches) {

            return res.status(401).json({
                message: "Invalid email or password."
            });

        }


        // Generate token
        const token = createToken(user._id);


        // Send response
        res.json({

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});
const { protect } = require("../middleware/auth");

router.get("/me", protect, async (req, res) => {
    res.json({
        message: "You are authenticated!",
        user: req.user
    });
});

module.exports = router;