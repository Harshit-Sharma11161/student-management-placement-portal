const express = require("express");
const Job = require("../models/job");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();


// ================= CREATE JOB =================

router.post("/", protect, adminOnly, async (req, res) => {
    try {
        const {
            company,
            role,
            description,
            location,
            salary,
            skillsRequired,
            eligibility,
            deadline
        } = req.body;

        if (
            !company ||
            !role ||
            !description ||
            !location ||
            salary === undefined ||
            !deadline
        ) {
            return res.status(400).json({
                message: "Please provide all required job details."
            });
        }

        const job = await Job.create({
            company,
            role,
            description,
            location,
            salary,
            skillsRequired,
            eligibility,
            deadline
        });

        res.status(201).json({
            message: "Job created successfully!",
            job
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// ================= GET ALL JOBS =================

router.get("/", protect, async (req, res) => {
    try {
        const jobs = await Job.find().sort({
            createdAt: -1
        });

        res.status(200).json(jobs);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// ================= GET SINGLE JOB =================

router.get("/:id", protect, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found."
            });
        }

        res.status(200).json(job);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// ================= UPDATE JOB =================

router.put("/:id", protect, adminOnly, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found."
            });
        }

        const {
            company,
            role,
            description,
            location,
            salary,
            skillsRequired,
            eligibility,
            deadline,
            status
        } = req.body;

        job.company = company ?? job.company;
        job.role = role ?? job.role;
        job.description = description ?? job.description;
        job.location = location ?? job.location;
        job.salary = salary ?? job.salary;
        job.skillsRequired = skillsRequired ?? job.skillsRequired;
        job.eligibility = eligibility ?? job.eligibility;
        job.deadline = deadline ?? job.deadline;
        job.status = status ?? job.status;

        await job.save();

        res.status(200).json({
            message: "Job updated successfully!",
            job
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// ================= DELETE JOB =================

router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found."
            });
        }

        await Job.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Job deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


module.exports = router;