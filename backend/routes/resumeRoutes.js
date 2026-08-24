const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const protect = require("../middleware/authMiddleware");

const {
  uploadResume,
  getSavedResumes,
  getShortlistedResumes,
  deleteResume,
} = require("../controllers/resumeController");

// Upload, analyze, and save resume
router.post("/upload", protect, upload.single("resume"), uploadResume);

// Get all saved resumes
router.get("/", protect, getSavedResumes);

// Get only shortlisted resumes
router.get("/shortlisted", protect, getShortlistedResumes);

// Delete a resume by ID
router.delete("/:id", protect, deleteResume);

module.exports = router;
