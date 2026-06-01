// Auth Controller
// TODO: Implement signup, login, getMe, updateProfile, changePassword

import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "user with this email already exists"
            })
        }

        // create new user
        const newUser = await User.create({
            name,
            email,
            password
        })
        // await newUser.save();

        // generate token
        const token = generateToken(newUser._id);

        // send response
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    }
    catch (error) {
        console.log("err",error)
        res.status(500).json({ success: false, message: "Error registering user", error: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user and explicitly select password
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            res.status(400).json({
                message: "Invalid email or password",
                success: false
            })
        }

        //compare password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            res.status(400).json({
                success: false,
                message: "Incorrect Password"
            })
        }
        //generate token

        const token = generateToken(user._id);
        res.status(200).json({
            success: true,
            token,
            message: 'Login successfull',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })

    }
    catch (error) {
        res.status(500).json({
            message: "Error logging in",
            error: error.message
        })
    }
}

export const getMe = async(req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        })
    }
}

export const updateProfile = async (req, res) => {
    try {

        const { name, email } = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user._id },
            { name, email },
            { new: true, runValidators: true }
        );


        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'server error', error: error.message })
    }

}

export const changePassword = async (req, res) => {

    try {
        const { oldPassword, newPassword } = req.body;
        // get user with password
        const user = await User.findById(req.user._id).select("+password");

        // check old password
        const isMatch = await user.comparePassword(oldPassword);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "old password is wrong"
            })
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}