// Application Controller
// TODO: Implement create, getAll, getById, update, remove, updateStatus, reorder
// TODO: Implement uploadResume, downloadResume, deleteResume
import Application from "../models/Application.js";

// Create a new application
export const createApplication = async (req, res) => {
  try {
    const newApp = new Application(req.body);
    const savedApp = await newApp.save();
    res.status(201).json(savedApp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get ALL applications from the database
export const getApplications = async (req, res) => {
  try {
    const apps = await Application.find(); // No filter = get all records
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ 
        message: "Error fetching applications", 
        error: error.message 
    });
  }
};

export const updateApplication = async(req,res) =>{
    try{
        const appId =  req.params.id;
           const updatedApp = await Application.findByIdAndUpdate(
      appId,
      req.body,
      { new: true, runValidators: true }
    );
        // const updatedApp = await Application.findOneAndUpdate({_id:appId,user:req.user.id},req.body,{new: true, runValidators: true })
        if(!updatedApp){
           return res.status(404).json({message:'Application not found'})
        }
        res.status(200).json(updatedApp)
    } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const updateApplicationStatusWise = async(req,res) =>{
    try{
        const appId = req.params.id;
        const { status } = req.body;
        const allowedStatuses = ['wishlist', 'applied', 'phone_screen', 'interview', 'offer', 'rejected']
        if(!allowedStatuses.includes(status)){
          return  res.status(400).json({message:'invalid status value'})
        }
        const updatedApp = await Application.findByIdAndUpdate(appId,{status}, { new: true, runValidators: true })
        if(!updatedApp){
            res.status(404).json({message:'Application not found'})
        }
    res.status(200).json(updatedApp);
    }
   catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const deleteApplication = async (req, res) => {
  try {
    const appId = req.params.id;

    // const deletedApp = await Application.findOneAndDelete({
    //     _id:appId,
    //     user:req.user.id
    // });
        const deletedApp = await Application.findByIdAndDelete(appId);

    if (!deletedApp) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted successfully" });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};