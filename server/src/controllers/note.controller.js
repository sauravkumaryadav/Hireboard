// Note Controller
// TODO: Implement addNote, getNotes, deleteNote, getTimeline

import Note from "../models/Note.js";
import Application from "../models/Application.js";

export const addNote = async (req, res) => {
    try {
        // 1. Get application ID from URL params
        const applicationId = req.params.id;

        //2. get note content from req  body
        const { content } = req.body;

        //3. validate content
        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Content is required"
            });
        }
        //4. validate if application exists for current user
        const isAppExists = await Application.findOne({
            _id: applicationId,
            user: req.user._id
        })

        //5. If application not found
        if (!isAppExists) {
            return res.status(400).json({
                success: false,
                message: "Application not found"
            })
        }

        //6. create note
        const newNote = await Note.create({
            application: applicationId,
            user: req.user._id,
            content,
            type: 'note'
        });

        //7. return response 
        res.status(201).json({
            success: true,
            message: "Note added successfully",
            data: newNote
        });


    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


export const getNotes = async (req, res) => {
    try {

        // 1. Get application ID from params
        const applicationId = req.params.id;

        // 2. Verify application belongs to logged-in user
        const isApplicationExists = await Application.findOne({
            _id: applicationId,
            user: req.user._id
        });

        // 3. If application not found
        if (!isApplicationExists) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        // 4. Get notes for application
        const notes = await Note.find({
            application: applicationId
        })
            .sort({ createdAt: -1 }) // newest first
            .populate("user", "name email");
                /* without populte 
            {
        user: "685b7..."
        }  and with populate {
        user: {
        name: "Saurav",
        email: "saurav@gmail.com"
        }
        } */
        // 5. Return response
        res.status(200).json({
            success: true,
            message: "Notes fetched successfully",
            data: notes
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const deleteNote = async (req, res) => {
    try {

        // 1. Get params
        const applicationId = req.params.id;
        const noteId = req.params.noteId;

        // 2. Delete note only if:
        // - note belongs to application
        // - note belongs to logged-in user
        const deletedNote = await Note.findOneAndDelete({
            _id: noteId,
            application: applicationId,
            user: req.user._id
        });

        // 3. If note not found
        if (!deletedNote) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        // 4. Success response
        res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const getTimeline = async (req, res) => {
    try {

        // 1. Get application ID from params
        const applicationId = req.params.id;

        // 2. Verify application belongs to logged-in user
        const isApplicationExists = await Application.findOne({
            _id: applicationId,
            user: req.user._id
        });

        // 3. If application not found
        if (!isApplicationExists) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        // 4. Get complete timeline
        const timeline = await Note.find({
            application: applicationId
        })
        .sort({ createdAt: -1 })
        .populate("user", "name");

        // 5. Return response
        res.status(200).json({
            success: true,
            message: "Timeline fetched successfully",
            data: timeline
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
