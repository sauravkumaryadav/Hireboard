// Auth Routes
// POST /api/auth/signup, POST /api/auth/login, GET /api/auth/me
// PUT /api/auth/profile, PUT /api/auth/change-password

import express from "express";
import User from "../models/User.js";
import { signup,login,changePassword,getMe,updateProfile } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ====================== PUBLIC ROUTES ======================
router.post('/signup', signup);
router.post('/login', login);

// ====================== PROTECTED ROUTES ======================
// Only logged-in users can access these routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);           // Better route name
router.put('/change-password', protect, changePassword);

export default router;


// protect middleware runs before the controller.
// It checks if the user sent a valid JWT token in the header.
// If token is valid → it finds the user and attaches it to req.user.
// If token is invalid or missing → it blocks the request with 401 error.