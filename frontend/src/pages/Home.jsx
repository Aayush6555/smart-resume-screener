import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-tag">AI-POWERED RESUME ANALYSIS</p>

          <h1>
            Build a stronger resume.
            <br />
            <span>Get smarter insights.</span>
          </h1>

          <p className="hero-description">
            Upload your resume and instantly analyze your technical skills.
            Identify your strengths, discover missing skills, and improve your
            job readiness.
          </p>

          <div className="hero-buttons">
            <Link to="/dashboard" className="primary-btn">
              Analyze My Resume
            </Link>

            <Link to="/signup" className="secondary-btn">
              Get Started
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="score-header">
            <p>Resume Score</p>
            <h2>78%</h2>
          </div>

          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>

          <div className="mini-skills">
            <span>Java</span>
            <span>React</span>
            <span>Python</span>
            <span>MongoDB</span>
          </div>

          <p className="analysis-text">
            ✓ Technical skills analyzed successfully
          </p>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <p>POWERFUL FEATURES</p>
          <h2>Everything you need to improve your resume</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Resume Analysis</h3>
            <p>
              Upload your PDF resume and extract important technical information
              automatically.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Skill Detection</h3>
            <p>
              Identify programming languages, frameworks, databases, and tools
              present in your resume.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Skill Score</h3>
            <p>
              Get a resume score based on your detected skills and identify
              areas that need improvement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
