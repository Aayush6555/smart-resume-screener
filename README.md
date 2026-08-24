Smart Resume Screener

A full-stack web application that analyzes resumes against a given job description and helps identify suitable candidates based on their skills, experience, education, and overall resume match.

The application uses PDF text extraction, rule-based analysis, semantic analysis, and LLM-based evaluation to provide a resume score and candidate recommendation.

Features
User Signup and Login
JWT-based authentication
Protected dashboard
PDF resume upload
Job description input
Resume text extraction
Required skills detection
Found skills identification
Missing skills identification
Rule-based resume scoring
Semantic similarity scoring
Overall resume score
Experience analysis
Education analysis
Strengths identification
Skill gap detection
Candidate recommendation
Shortlisted candidate management
Saved non-shortlisted candidate management
Resume deletion
MongoDB database storage
Application Workflow
User
  │
  ▼
Signup
  │
  ▼
Login
  │
  ▼
Dashboard
  │
  ▼
Upload Resume PDF + Job Description
  │
  ▼
Extract Resume Text
  │
  ▼
Resume Analysis
  │
  ├── Required Skills
  ├── Found Skills
  ├── Missing Skills
  ├── Rule-Based Score
  ├── Semantic Score
  ├── Experience Analysis
  └── Education Analysis
  │
  ▼
Final Resume Score
  │
  ▼
Candidate Recommendation
  │
  ├── Shortlisted Resumes
  └── Saved Resumes
Technologies Used
Frontend
React
Vite
React Router DOM
CSS
JavaScript
Backend
Node.js
Express.js
MongoDB
Mongoose
JSON Web Token (JWT)
bcryptjs
Multer
pdf-parse
AI and Resume Analysis
Groq API
LLM-based resume analysis
Semantic analysis
Rule-based skill matching
Project Structure
smart-resume-screener/
│
├── backend/
│   │
│   ├── config/
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── resumeController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── Resume.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── resumeRoutes.js
│   │
│   ├── services/
│   │   ├── groqService.js
│   │   ├── llmService.js
│   │   └── resumeAnalyzer.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.css
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.css
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.css
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.css
│   │   │   └── Signup.jsx
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── index.html
│
└── README.md
Installation and Setup
1. Clone the Repository
git clone <repository-url>

Move into the project folder:

cd smart-resume-screener
2. Backend Setup

Open the backend folder:

cd backend

Install the required dependencies:

npm install

Create a .env file inside the backend folder.

Example:

PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_key

GROQ_API_KEY=your_groq_api_key

Start the backend server:

node server.js

The backend will run on:

http://localhost:5000
3. Frontend Setup

Open a new terminal and move to the frontend folder:

cd frontend

Install dependencies:

npm install

Start the frontend:

npm run dev

The frontend will run on:

http://localhost:5173
Authentication

The application uses JWT authentication.

Signup

A new user can create an account using:

Full Name
Email Address
Password

The user information is stored securely in MongoDB, and the password is hashed using bcryptjs.

Login

After successful login:

A JWT token is generated.
The token is stored in local storage.
User information is stored in local storage.
The user is redirected to the dashboard.
Protected Routes

The dashboard and resume-related features are protected using authentication middleware and a frontend protected route.

Resume Analysis

The user uploads a resume in PDF format and provides a job description.

The application performs the following steps:

1. PDF Text Extraction

The uploaded PDF is processed and converted into text.

2. Skill Analysis

The application identifies:

Required skills from the job description
Skills found in the resume
Skills missing from the resume
3. Resume Scoring

The resume is evaluated using:

Rule-based score
Semantic score
Skills score
Experience score
Education score

These results are used to generate the final resume score.

4. Candidate Analysis

The system also provides:

Experience summary
Education summary
Candidate strengths
Skill gaps
Detailed justification
5. Recommendation

Based on the resume analysis, the candidate receives a recommendation such as:

Shortlist

or

Consider
Resume Management

The dashboard separates resumes into different sections.

Shortlisted Resumes

Candidates with the recommendation:

Shortlist

are displayed in the Shortlisted Resumes section.

Saved Resumes

Candidates who are not shortlisted are displayed in the Saved Resumes section.

This prevents shortlisted candidates from appearing twice.

Delete Resume

Users can delete a saved resume.

The deleted resume is removed from the MongoDB database and the dashboard updates accordingly.

Database

The project uses MongoDB to store:

User Data
Name
Email
Hashed Password
Resume Data
Candidate Name
Resume File Name
Resume Text
Job Description
Required Skills
Found Skills
Missing Skills
Resume Scores
Experience Summary
Education Summary
Strengths
Skill Gaps
Justification
Recommendation
Security

The project includes:

Password hashing using bcrypt
JWT authentication
Protected routes
User-specific resume access
Authentication checks before resume operations
Future Improvements

Possible future improvements include:

Resume download
Resume comparison between candidates
Advanced filtering and sorting
Recruiter/admin dashboard
Email notifications
Interview scheduling
Cloud-based resume storage
More advanced AI models
Deployment using cloud services
Screenshots

Screenshots can be added for:

Home Page
Signup Page
Login Page
Dashboard
Resume Upload
Resume Analysis Result
Shortlisted Resumes
Saved Resumes
Conclusion

Smart Resume Screener provides an automated solution for analyzing resumes against job descriptions. The application combines rule-based matching, semantic analysis, and LLM-based analysis to evaluate candidates and generate meaningful recommendations.

The system helps organize candidates into shortlisted and saved categories while providing detailed information about skills, experience, education, strengths, and skill gaps.