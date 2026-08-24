import { useState, useEffect } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [savedResumes, setSavedResumes] = useState([]);
  const [shortlistedResumes, setShortlistedResumes] = useState([]);

  // ================= FETCH DATA WHEN DASHBOARD OPENS =================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        // Fetch saved resumes
        const savedResponse = await fetch("http://localhost:5000/api/resumes", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const savedData = await savedResponse.json();

        if (savedResponse.ok) {
          setSavedResumes(savedData.resumes || []);

          // Show latest saved resume analysis if available
          if (savedData.resumes && savedData.resumes.length > 0) {
            const latestResume = savedData.resumes[0];

            setResult({
              fileName: latestResume.fileName,
              analysis: latestResume,
            });
          }
        } else {
          console.error(savedData.message || "Failed to fetch saved resumes");
        }

        // Fetch shortlisted resumes
        const shortlistedResponse = await fetch(
          "http://localhost:5000/api/resumes/shortlisted",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const shortlistedData = await shortlistedResponse.json();

        if (shortlistedResponse.ok) {
          setShortlistedResumes(shortlistedData.resumes || []);
        } else {
          console.error(
            shortlistedData.message || "Failed to fetch shortlisted resumes",
          );
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // ================= FILE CHANGE =================

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // ================= UPLOAD RESUME =================

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a resume PDF first");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter a job description");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const formData = new FormData();

    formData.append("resume", selectedFile);
    formData.append("jobDescription", jobDescription);

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/resumes/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Upload failed");
        return;
      }

      // Create complete resume object
      const newResume = {
        _id: data.resumeId,
        fileName: data.fileName,
        ...(data.analysis || {}),
      };

      // Show latest analysis result
      setResult({
        fileName: data.fileName,
        analysis: newResume,
      });

      // Add shortlisted resume only to shortlisted section
      if (data.analysis?.recommendation === "Shortlist") {
        setShortlistedResumes((previousResumes) => [
          newResume,
          ...previousResumes,
        ]);
      } else {
        // Add non-shortlisted resume only to saved resumes
        setSavedResumes((previousResumes) => [newResume, ...previousResumes]);
      }

      // Clear form
      setSelectedFile(null);
      setJobDescription("");

      // Clear file input visually
      const fileInput = document.getElementById("resume");

      if (fileInput) {
        fileInput.value = "";
      }

      console.log("Backend response:", data);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error connecting to the server");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE RESUME =================

  const handleDeleteResume = async (resumeId) => {
    if (!resumeId) {
      alert("Resume ID not found");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/resumes/${resumeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete resume");
        return;
      }

      // Remove from saved resumes if present
      setSavedResumes((previousResumes) =>
        previousResumes.filter(
          (resume) => String(resume._id) !== String(resumeId),
        ),
      );

      // Remove from shortlisted resumes if present
      setShortlistedResumes((previousResumes) =>
        previousResumes.filter(
          (resume) => String(resume._id) !== String(resumeId),
        ),
      );

      // Remove analysis result only if deleted resume is currently displayed
      if (String(result?.analysis?._id) === String(resumeId)) {
        setResult(null);
      }

      alert("Resume deleted successfully");
    } catch (error) {
      console.error("Delete resume error:", error);
      alert("Error deleting resume");
    }
  };

  // ================= FORMAT CATEGORY =================

  const formatCategory = (category) => {
    if (category === "programmingLanguages") {
      return "Programming Languages";
    }

    if (category === "webTechnologies") {
      return "Web Technologies";
    }

    if (category === "databases") {
      return "Databases";
    }

    if (category === "frameworks") {
      return "Frameworks";
    }

    if (category === "tools") {
      return "Tools";
    }

    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* ================= HEADER ================= */}

        <div className="dashboard-header">
          <h1>Resume Dashboard</h1>

          <p>Upload your resume and match it with a job description</p>
        </div>

        {/* ================= UPLOAD SECTION ================= */}

        <div className="dashboard-upload-card">
          <h2>Upload Resume</h2>

          {/* FILE INPUT */}

          <div className="form-group">
            <label htmlFor="resume">Select Resume (PDF)</label>

            <div className="file-input-container">
              <input
                id="resume"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </div>

            {selectedFile && (
              <p className="selected-file">Selected: {selectedFile.name}</p>
            )}
          </div>

          {/* JOB DESCRIPTION */}

          <div className="form-group">
            <label htmlFor="jobDescription">Job Description</label>

            <textarea
              id="jobDescription"
              className="job-description-textarea"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder={`Paste the job description here...

Example:
We are looking for a React Developer with experience in JavaScript, React, Node.js, MongoDB and REST APIs.`}
            />
          </div>

          {/* ANALYZE BUTTON */}

          <button
            className="analyze-button"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {/* ================= ANALYSIS RESULT ================= */}

        {result && (
          <div className="dashboard-result-card">
            <h2>Analysis Result</h2>

            {/* RESUME INFORMATION */}

            <div className="resume-info">
              <p>
                <strong>Resume:</strong> {result.fileName}
              </p>

              <div className="score-box">
                <span>Resume Score</span>

                <div className="score-value">
                  {result.analysis?.score || 0}%
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${result.analysis?.score || 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* FOUND SKILLS */}

            <div className="analysis-section">
              <h3>Found Skills</h3>

              <div className="skills-container">
                {result.analysis?.foundSkills?.length > 0 ? (
                  result.analysis.foundSkills.map((skill, index) => (
                    <span key={`${skill}-${index}`} className="skill-badge">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="no-skills">No skills found</p>
                )}
              </div>
            </div>

            {/* MISSING SKILLS */}

            <div className="analysis-section">
              <h3>Missing Skills</h3>

              <div className="skills-container">
                {result.analysis?.missingSkills?.length > 0 ? (
                  result.analysis.missingSkills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="missing-skill-badge"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="no-skills">No missing skills found</p>
                )}
              </div>
            </div>

            {/* RECOMMENDATION */}

            <div className="analysis-section">
              <h3>Recommendation</h3>

              <p>{result.analysis?.recommendation || "Not available"}</p>
            </div>

            {/* SKILLS BY CATEGORY */}

            <div className="analysis-section">
              <h2>Skills by Category</h2>

              <div className="categories-container">
                {Object.entries(result.analysis?.categories || {}).map(
                  ([category, skills]) => (
                    <div className="category-card" key={category}>
                      <h3>{formatCategory(category)}</h3>

                      <div className="skills-container">
                        {skills.length > 0 ? (
                          skills.map((skill, index) => (
                            <span
                              key={`${skill}-${index}`}
                              className="skill-badge"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="no-skills">No skills found</p>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= SAVED RESUMES ================= */}

        <div className="dashboard-result-card">
          <div className="analysis-section">
            <h3>Saved Resumes</h3>

            <p>{savedResumes.length} resume(s) saved</p>

            {savedResumes.length > 0 ? (
              <div className="shortlisted-resumes-container">
                {savedResumes.map((resume, index) => (
                  <div
                    className="shortlisted-resume-card"
                    key={resume._id || `${resume.fileName}-${index}`}
                  >
                    <h4>
                      {resume.candidateName || resume.fileName || "Candidate"}
                    </h4>

                    <p>
                      <strong>File:</strong> {resume.fileName}
                    </p>

                    <div className="shortlisted-score">
                      {resume.score || 0}%
                    </div>

                    <p>
                      <strong>Recommendation:</strong>{" "}
                      {resume.recommendation || "Not available"}
                    </p>

                    <button
                      className="delete-button"
                      onClick={() => handleDeleteResume(resume._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-skills">No saved resumes found</p>
            )}
          </div>
        </div>

        {/* ================= SHORTLISTED RESUMES ================= */}

        <div className="dashboard-result-card">
          <div className="analysis-section">
            <h3>Shortlisted Resumes</h3>

            <p>{shortlistedResumes.length} resume(s) shortlisted</p>

            {shortlistedResumes.length > 0 ? (
              <div className="shortlisted-resumes-container">
                {shortlistedResumes.map((resume, index) => (
                  <div
                    className="shortlisted-resume-card"
                    key={resume._id || `${resume.fileName}-${index}`}
                  >
                    <h4>
                      {resume.candidateName || resume.fileName || "Candidate"}
                    </h4>

                    <div className="shortlisted-score">
                      {resume.score || 0}%
                    </div>

                    <p>
                      <strong>Recommendation:</strong>{" "}
                      {resume.recommendation || "Shortlist"}
                    </p>

                    {/* FOUND SKILLS */}

                    <p className="found-skills-title">
                      <strong>Found Skills:</strong>
                    </p>

                    <div className="shortlisted-skills">
                      {resume.foundSkills?.length > 0 ? (
                        resume.foundSkills.map((skill, skillIndex) => (
                          <span
                            key={`${skill}-${skillIndex}`}
                            className="skill-badge"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="no-skills">No skills found</span>
                      )}
                    </div>

                    {/* WHY SHORTLISTED */}

                    <p className="justification-title">
                      <strong>Why Shortlisted:</strong>
                    </p>

                    <p className="justification-text">
                      {resume.justification || "No justification available"}
                    </p>

                    {/* DELETE BUTTON */}

                    <button
                      className="delete-button"
                      onClick={() => handleDeleteResume(resume._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-skills">No shortlisted resumes found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
