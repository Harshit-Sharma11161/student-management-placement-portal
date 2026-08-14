const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: true,
            trim: true
        },

        role: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        salary: {
            type: Number,
            required: true
        },

        skillsRequired: {
            type: [String],
            default: []
        },

        eligibility: {
            minCGPA: {
                type: Number,
                default: 0
            },

            branches: {
                type: [String],
                default: []
            },

            graduationYear: {
                type: Number
            }
        },

        deadline: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ["Open", "Closed"],
            default: "Open"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);