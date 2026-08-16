const express = require("express");
const Student = require("../models/student");
const { protect: auth, studentOnly } = require("../middleware/auth");

const router = express.Router();

// CREATE student profile
router.post("/", auth, studentOnly, async (req, res) => {
    try {
        const {
            rollNumber,
            branch,
            year,
            cgpa,
            phone,
            skills,
            resume,
            projects
        } = req.body;

        const existingStudent = await Student.findOne({
            user: req.user.id
        });

        if (existingStudent) {
            return res.status(400).json({
                message: "Student profile already exists."
            });
        }

        const student = await Student.create({
            user: req.user.id,
            rollNumber,
            branch,
            year,
            cgpa,
            phone,
            skills,
            resume,
            projects
        });

        res.status(201).json({
            message: "Student profile created successfully!",
            student
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// GET logged-in student's profile
router.get("/me", auth, studentOnly, async (req, res) => {
    try {
        const student = await Student.findOne({
            user: req.user.id
        }).populate("user", "name email role");

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found."
            });
        }

        res.status(200).json(student);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// UPDATE logged-in student's profile
router.put("/me", auth, studentOnly, async (req, res) => {
    try {
        const student = await Student.findOne({
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found."
            });
        }

        const {
            rollNumber,
            branch,
            year,
            cgpa,
            phone,
            skills,
            resume,
            projects,
            placementStatus
        } = req.body;

        student.rollNumber = rollNumber ?? student.rollNumber;
        student.branch = branch ?? student.branch;
        student.year = year ?? student.year;
        student.cgpa = cgpa ?? student.cgpa;
        student.phone = phone ?? student.phone;
        student.skills = skills ?? student.skills;
        student.resume = resume ?? student.resume;
        student.projects = projects ?? student.projects;
        student.placementStatus =
            placementStatus ?? student.placementStatus;

        await student.save();

        res.status(200).json({
            message: "Student profile updated successfully!",
            student
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// DELETE logged-in student's profile
router.delete("/me", auth, studentOnly, async (req, res) => {
    try {
        const student = await Student.findOne({
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found."
            });
        }

        await Student.findByIdAndDelete(student._id);

        res.status(200).json({
            message: "Student profile deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


module.exports = router;