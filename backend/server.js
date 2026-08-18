require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

const PORT = process.env.PORT || 5000;


// ================= DATABASE =================

connectDB();


// ================= MIDDLEWARE =================

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173"
    })
);

app.use(express.json());


// ================= ROUTES =================

app.use("/api/auth", authRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/applications", applicationRoutes);


// ================= TEST ROUTE =================

app.get("/", (req, res) => {
    res.send("Student Placement Portal Backend is Running!");
});


// ================= SERVER =================

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});