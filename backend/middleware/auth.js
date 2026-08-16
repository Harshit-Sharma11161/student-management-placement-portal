const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ================= PROTECT =================

const protect = async (req, res, next) => {
    try {

        const header =
            req.headers.authorization;


        // Check token exists

        if (
            !header ||
            !header.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message:
                    "Not authorized. Token required."
            });
        }


        // Extract token

        const token =
            header.split(" ")[1];


        // Verify token

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // Find user

        req.user =
            await User.findById(
                decoded.id
            ).select("-password");


        // User doesn't exist

        if (!req.user) {
            return res.status(401).json({
                message:
                    "User not found."
            });
        }


        // Continue

        next();


    } catch (error) {

        return res.status(401).json({
            message:
                "Invalid or expired token."
        });

    }
};


// ================= ADMIN ONLY =================

const adminOnly = (req, res, next) => {

    if (
        req.user &&
        req.user.role === "admin"
    ) {
        return next();
    }


    return res.status(403).json({
        message:
            "Admin access required."
    });
};


// ================= STUDENT ONLY =================

const studentOnly = (req, res, next) => {

    if (
        req.user &&
        req.user.role === "student"
    ) {
        return next();
    }


    return res.status(403).json({
        message:
            "Student access required."
    });
};


module.exports = {
    protect,
    adminOnly,
    studentOnly
};