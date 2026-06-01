import multer from "multer";
import path from "path";

// ================= STORAGE CONFIG =================

const storage = multer.diskStorage({

  // Where files should be stored
  destination: function (req, file, cb) {
    cb(null, "uploads/resumes");
  },

  // Custom filename
  filename: function (req, file, cb) {

    // Unique filename
    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  }

});

// ================= FILE FILTER =================

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  // Accept file
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  }

  // Reject file
  else {
    cb(new Error("Only PDF and DOCX files are allowed"), false);
  }
};

// ================= MULTER CONFIG =================

const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }

});

export default upload;