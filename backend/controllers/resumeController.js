const { PDFParse } = require("pdf-parse");
const { analyzeResume } = require("../services/resumeAnalyzer");
const Resume = require("../models/Resume");
const User = require("../models/User");

// ================= UPLOAD AND ANALYZE RESUME =================

const uploadResume = async (req, res) => {
  let parser;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF resume uploaded",
      });
    }

    const { jobDescription } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job description is required",
      });
    }

    // Create PDF parser
    parser = new PDFParse({
      data: req.file.buffer,
    });

    // Extract text from PDF
    const pdfData = await parser.getText();
    const resumeText = pdfData.text;

    console.log("\n========== PDF TEXT ==========");
    console.log(resumeText);
    console.log("========== END PDF TEXT ==========\n");

    // Analyze resume
    const analysis = await analyzeResume(resumeText, jobDescription);

    console.log("\n========== ANALYSIS RESULT ==========");
    console.log(JSON.stringify(analysis, null, 2));
    console.log("========== END ANALYSIS RESULT ==========\n");

    // Get logged-in user ID
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication information not found",
      });
    }

    // Get candidate name from logged-in user
    const user = await User.findById(userId);

    // Save resume and analysis
    const savedResume = await Resume.create({
      user: userId,

      candidateName: user?.name || "Unknown Candidate",

      fileName: req.file.originalname,

      resumeText: resumeText,

      jobDescription: jobDescription.trim(),

      requiredSkills: analysis.requiredSkills || [],
      foundSkills: analysis.foundSkills || [],
      missingSkills: analysis.missingSkills || [],

      categories: analysis.categories || {},

      ruleBasedScore: analysis.ruleBasedScore || 0,
      semanticScore: analysis.semanticScore || 0,
      score: analysis.score || 0,

      skillsScore: analysis.skillsScore || 0,
      experienceScore: analysis.experienceScore || 0,
      educationScore: analysis.educationScore || 0,

      experienceSummary:
        analysis.experienceSummary || "No experience analysis available.",

      educationSummary:
        analysis.educationSummary || "No education analysis available.",

      strengths: analysis.strengths || [],
      skillGaps: analysis.skillGaps || [],

      justification:
        analysis.justification || "No detailed justification available.",

      recommendation: analysis.recommendation || "Consider",
    });

    console.log("\n========== SAVED TO MONGODB ==========");
    console.log("Resume ID:", savedResume._id);
    console.log("Candidate:", savedResume.candidateName);
    console.log("Score:", savedResume.score);
    console.log("Recommendation:", savedResume.recommendation);
    console.log("======================================\n");

    res.status(200).json({
      success: true,
      message: "Resume analyzed and saved successfully",

      fileName: req.file.originalname,
      fileSize: req.file.size,

      resumeId: savedResume._id,

      analysis,
    });
  } catch (error) {
    console.error("Resume analysis error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze resume",
    });
  } finally {
    // Free PDF parser resources
    if (parser) {
      await parser.destroy();
    }
  }
};

// ================= GET SAVED RESUMES =================

const getSavedResumes = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication information not found",
      });
    }

    // Get only resumes that are NOT shortlisted
    const resumes = await Resume.find({
      user: userId,
      recommendation: { $ne: "Shortlist" },
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error("Get saved resumes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch saved resumes",
    });
  }
};

// ================= GET SHORTLISTED RESUMES =================

const getShortlistedResumes = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication information not found",
      });
    }

    // Get only shortlisted resumes
    const resumes = await Resume.find({
      user: userId,
      recommendation: "Shortlist",
    }).sort({
      score: -1,
    });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error("Get shortlisted resumes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch shortlisted resumes",
    });
  }
};

// ================= DELETE RESUME =================

const deleteResume = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication information not found",
      });
    }

    // Find resume and ensure it belongs to logged-in user
    const resume = await Resume.findOne({
      _id: id,
      user: userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Delete the resume
    await Resume.findByIdAndDelete(id);

    console.log("\n========== RESUME DELETED ==========");
    console.log("Resume ID:", id);
    console.log("Candidate:", resume.candidateName);
    console.log("File:", resume.fileName);
    console.log("====================================\n");

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
      deletedResumeId: id,
    });
  } catch (error) {
    console.error("Delete resume error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete resume",
    });
  }
};

module.exports = {
  uploadResume,
  getSavedResumes,
  getShortlistedResumes,
  deleteResume,
};
