const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    // User who uploaded the resume
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Candidate information
    candidateName: {
      type: String,
      trim: true,
      default: "Unknown Candidate",
    },

    // Original PDF file name
    fileName: {
      type: String,
      required: true,
    },

    // Text extracted from the uploaded PDF
    resumeText: {
      type: String,
      required: true,
    },

    // Job description entered by the user
    jobDescription: {
      type: String,
      required: true,
    },

    // Skill analysis
    requiredSkills: {
      type: [String],
      default: [],
    },

    foundSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    // Skills grouped by category
    categories: {
      type: Object,
      default: {},
    },

    // Scoring
    ruleBasedScore: {
      type: Number,
      default: 0,
    },

    semanticScore: {
      type: Number,
      default: 0,
    },

    score: {
      type: Number,
      required: true,
    },

    skillsScore: {
      type: Number,
      default: 0,
    },

    experienceScore: {
      type: Number,
      default: 0,
    },

    educationScore: {
      type: Number,
      default: 0,
    },

    // AI-generated summaries
    experienceSummary: {
      type: String,
      default: "",
    },

    educationSummary: {
      type: String,
      default: "",
    },

    // Candidate strengths
    strengths: {
      type: [String],
      default: [],
    },

    // Missing or weak skills
    skillGaps: {
      type: [String],
      default: [],
    },

    // Explanation of the result
    justification: {
      type: String,
      default: "",
    },

    // Final recommendation
    recommendation: {
      type: String,
      enum: ["Shortlist", "Consider", "Reject"],
      default: "Consider",
    },
  },
  {
    timestamps: true,
  },
);

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
