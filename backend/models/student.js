const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        rollNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        branch: {
            type: String,
            required: true,
            trim: true
        },

        year: {
            type: Number,
            required: true
        },

        cgpa: {
            type: Number,
            required: true,
            min: 0,
            max: 10
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        skills: {
            type: [String],
            default: []
        },

        resume: {
            type: String,
            default: ""
        },

        projects: {
            type: [String],
            default: []
        },

        placementStatus: {
            type: String,
            enum: ["Not Placed", "Placed"],
            default: "Not Placed"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.models.Student || mongoose.model("Student", studentSchema);