// Application Controller
// TODO: Implement create, getAll, getById, update, remove, updateStatus, reorder
// TODO: Implement uploadResume, downloadResume, deleteResume
import Application from "../models/Application.js";

// Create a new application
export const createApplication = async (req, res) => {
  try {
    const newApp = await Application.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: newApp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get ALL applications from the database for that logged in user
export const getApplications = async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      count: apps.length,
      data: apps,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching applications",
      error: error.message,
    });
  }
};


export const getApplicationById = async (req, res) => {
  try {
    const appId = req.params.id;

    const foundApp = await Application.findOne({
      _id: appId,
      user: req.user._id,
    });

    if (!foundApp) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: foundApp,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateApplication = async (req, res) => {  //Update this application only if it belongs to logged-in user.
  try {
    const appId = req.params.id;

    const updatedApp = await Application.findOneAndUpdate({ _id: appId, user: req.user.id }, req.body, { new: true, runValidators: true })
    if (!updatedApp) {
      return res.status(404).json({ success: false, message: 'Application not found' })
    }
    res.status(200).json({ success: true, data: updatedApp, message: "Application updated successfully" })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}


export const updateApplicationStatusWise = async (req, res) => {
  try {
    const appId = req.params.id;
    const { status } = req.body;
    const allowedStatuses = ['wishlist', 'applied', 'phone_screen', 'interview', 'offer', 'rejected']
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'invalid status value' })
    }
    const updatedApp = await Application.findOneAndUpdate({ _id: appId, user: req.user._id }, { status }, { new: true, runValidators: true })
    if (!updatedApp) {
      return res.status(404).json({ success: false, message: 'Application not found' })
    }
    res.status(200).json({ success: true, data: updatedApp, message: "Status updated successfully" });
  }
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const deleteApplication = async (req, res) => {
  try {
    const appId = req.params.id;

    const deletedApp = await Application.findOneAndDelete({
      _id: appId,
      user: req.user._id,
    });

    if (!deletedApp) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};