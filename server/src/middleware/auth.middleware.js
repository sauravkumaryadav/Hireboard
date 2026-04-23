// Auth Middleware - JWT verification
// TODO: Extract Bearer token, verify with jwt.verify, attach req.user

import User from "../models/User.js";
import jwt from "jsonwebtoken"

export const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        // Check if token exists in Authorization header
        //  Check token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. No token provided."
            })
        }

        // If Bearer exists → extract token
        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
        }
        //verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //  Find the user by id (from token)
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }
        //  Attach user to request object
        req.user = user;

        next();   // Move to next middleware or controller
    }
    catch (error) {
        console.error("Protect Middleware Error:", error.message);
        res.status(401)
    }
}