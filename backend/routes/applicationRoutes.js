const express = require("express");
const Application = require("../models/application");
const Student = require("../models/student");
const Job = require("../models/job");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();


// ================= STUDENT APPLY FOR JOB =================

router.post("/", protect, async (req, res) => {
    try {
        // Find the logged-in student's profile
        const student = await Student.findOne({
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found."
            });
        }

        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required."
            });
        }

        // Find the job
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found."
            });
        }

        // Check whether job is open
        if (job.status !== "Open") {
            return res.status(400).json({
                message: "This job is closed."
            });
        }

        // Check deadline
        if (new Date() > new Date(job.deadline)) {
            return res.status(400).json({
                message: "Application deadline has passed."
            });
        }

        // Check if student already applied
        const existingApplication = await Application.findOne({
            student: student._id,
            job: job._id
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job."
            });
        }

        // Create application
        const application = await Application.create({
            student: student._id,
            job: job._id
        });

        res.status(201).json({
            message: "Application submitted successfully!",
            application
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// ================= STUDENT VIEW OWN APPLICATIONS =================

router.get("/my", protect, async (req, res) => {
    try {
        const student = await Student.findOne({
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found."
            });
        }

        const applications = await Application.find({
            student: student._id
        })
            .populate("job")
            .sort({ createdAt: -1 });

        res.status(200).json(applications);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// ================= ADMIN VIEW ALL APPLICATIONS =================

router.get("/", protect, adminOnly, async (req, res) => {
    try {
        const applications = await Application.find()
            .populate({
                path: "student",
                populate: {
                    path: "user",
                    select: "name email role"
                }
            })
            .populate("job")
            .sort({ createdAt: -1 });

        res.status(200).json(applications);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// ================= ADMIN UPDATE APPLICATION STATUS =================

router.put("/:id", protect, adminOnly, async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found."
            });
        }

        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                message: "Status is required."
            });
        }

        const allowedStatuses = [
            "Applied",
            "Shortlisted",
            "Rejected",
            "Selected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status."
            });
        }

        application.status = status;

        await application.save();

        res.status(200).json({
            message: "Application status updated successfully!",
            application
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


module.exports = router;