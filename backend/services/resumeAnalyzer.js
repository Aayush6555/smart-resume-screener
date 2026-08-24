const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =====================================
// SKILL ALIASES
// =====================================

const skillAliases = {
  javascript: ["javascript", "js"],
  typescript: ["typescript", "ts"],

  react: ["react", "react.js", "reactjs"],
  angular: ["angular", "angular.js"],
  vue: ["vue", "vue.js", "vuejs"],

  "node.js": ["node.js", "nodejs"],
  express: ["express", "express.js", "expressjs"],

  "spring boot": ["spring boot", "springboot"],

  tailwind: ["tailwind", "tailwind css"],

  mongodb: ["mongodb", "mongo db"],
  postgresql: ["postgresql", "postgres"],

  "rest api": ["rest api", "restful api"],

  vscode: ["vscode", "vs code", "visual studio code"],

  "c++": ["c++"],
  "c#": ["c#"],
};

// =====================================
// ESCAPE SPECIAL REGEX CHARACTERS
// =====================================

const escapeRegExp = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// =====================================
// CHECK WHETHER A SKILL EXISTS
// =====================================

const containsSkill = (text, skill) => {
  if (!text || !skill) {
    return false;
  }

  const aliases = skillAliases[skill] || [skill];

  return aliases.some((alias) => {
    const escapedSkill = escapeRegExp(alias);

    const regex = new RegExp(
      `(^|[^a-zA-Z0-9+#.])${escapedSkill}(?=$|[^a-zA-Z0-9+#.])`,
      "i",
    );

    return regex.test(text);
  });
};

// =====================================
// MAIN ANALYSIS FUNCTION
// =====================================

const analyzeResume = async (resumeText, jobDescription) => {
  const skillCategories = {
    programmingLanguages: [
      "java",
      "python",
      "javascript",
      "typescript",
      "c",
      "c++",
      "c#",
    ],

    frameworks: [
      "react",
      "angular",
      "vue",
      "node.js",
      "express",
      "spring boot",
      "django",
      "flask",
      "tailwind",
    ],

    databases: ["mongodb", "mysql", "sql", "postgresql", "oracle"],

    webTechnologies: ["html", "css", "rest api", "bootstrap"],

    tools: [
      "git",
      "github",
      "postman",
      "docker",
      "aws",
      "kubernetes",
      "jira",
      "vercel",
      "render",
      "vscode",
    ],
  };

  const allSkills = Object.values(skillCategories).flat();

  // =====================================
  // RULE-BASED SKILL MATCHING
  // =====================================

  const requiredSkills = allSkills.filter((skill) =>
    containsSkill(jobDescription, skill),
  );

  const foundSkills = requiredSkills.filter((skill) =>
    containsSkill(resumeText, skill),
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !containsSkill(resumeText, skill),
  );

  // =====================================
  // CATEGORY-WISE SKILLS
  // =====================================

  const foundCategories = {};

  for (const category in skillCategories) {
    foundCategories[category] = skillCategories[category].filter(
      (skill) =>
        requiredSkills.includes(skill) && containsSkill(resumeText, skill),
    );
  }

  // =====================================
  // RULE-BASED SCORE
  // =====================================

  let ruleBasedScore = 0;

  if (requiredSkills.length > 0) {
    ruleBasedScore = Math.round(
      (foundSkills.length / requiredSkills.length) * 100,
    );
  }

  // =====================================
  // DEBUG LOGS
  // =====================================

  console.log("\n========== RESUME ANALYSIS ==========");

  console.log("Required Skills:", requiredSkills);

  console.log("Found Skills:", foundSkills);

  console.log("Missing Skills:", missingSkills);

  console.log("Rule Based Score:", ruleBasedScore);

  console.log("====================================\n");

  // =====================================
  // GROQ SEMANTIC ANALYSIS
  // =====================================

  const prompt = `
You are an intelligent ATS and resume screening system.

Compare the candidate's resume with the job description.

Perform SEMANTIC matching.

Do not rely only on exact keyword matching.

You should understand equivalent technologies and related experience.

For example:
- React.js and React should be considered equivalent.
- Node.js and NodeJS should be considered equivalent.
- Projects should count as practical experience.
- Relevant academic projects should contribute to the candidate's suitability.
- Internship experience and personal projects should be evaluated based on relevance.

Evaluate:

1. Technical skill relevance
2. Project relevance
3. Practical experience
4. Education relevance
5. Overall suitability for the job

RESUME:

${resumeText}

JOB DESCRIPTION:

${jobDescription}

Return ONLY valid JSON in exactly this format:

{
  "semanticScore": 0,
  "skillsScore": 0,
  "experienceScore": 0,
  "educationScore": 0,
  "experienceSummary": "string",
  "educationSummary": "string",
  "strengths": [
    "string"
  ],
  "skillGaps": [
    "string"
  ],
  "justification": "string",
  "recommendation": "Consider"
}

STRICT RULES:

- All scores must be numbers between 0 and 100.
- semanticScore represents the overall candidate-job match.
- skillsScore represents relevant technical skill matching.
- experienceScore includes internships, projects, and practical experience.
- educationScore represents education relevance.
- recommendation must be exactly one of:
  "Shortlist", "Consider", or "Reject".
- Return valid JSON only.
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content:
            "You are a professional ATS and resume screening assistant. Always return valid JSON only.",
        },

        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.2,

      response_format: {
        type: "json_object",
      },
    });

    const content = completion.choices[0].message.content;

    const llmResult = JSON.parse(content);

    console.log("\n========== GROQ ANALYSIS ==========");

    console.log(llmResult);

    console.log("===================================\n");

    // =====================================
    // COMBINE RULE-BASED + AI SCORE
    // =====================================

    const semanticScore = Number(llmResult.semanticScore || 0);

    const finalScore = Math.round(ruleBasedScore * 0.4 + semanticScore * 0.6);

    return {
      // Rule-based analysis
      requiredSkills,
      foundSkills,
      missingSkills,
      categories: foundCategories,

      // Scores
      ruleBasedScore,
      semanticScore,
      score: finalScore,

      skillsScore: Number(llmResult.skillsScore || 0),
      experienceScore: Number(llmResult.experienceScore || 0),
      educationScore: Number(llmResult.educationScore || 0),

      // AI analysis
      experienceSummary:
        llmResult.experienceSummary || "No experience analysis available.",

      educationSummary:
        llmResult.educationSummary || "No education analysis available.",

      strengths: Array.isArray(llmResult.strengths) ? llmResult.strengths : [],

      skillGaps: Array.isArray(llmResult.skillGaps) ? llmResult.skillGaps : [],

      justification:
        llmResult.justification || "No detailed justification available.",

      recommendation: llmResult.recommendation || "Consider",
    };
  } catch (error) {
    console.error("\n========== GROQ ERROR ==========");

    console.error(error.message);

    console.error("================================\n");

    // Fallback to rule-based analysis
    return {
      requiredSkills,
      foundSkills,
      missingSkills,
      categories: foundCategories,

      ruleBasedScore,
      semanticScore: 0,
      score: ruleBasedScore,

      skillsScore: ruleBasedScore,
      experienceScore: 0,
      educationScore: 0,

      experienceSummary: "AI experience analysis could not be completed.",

      educationSummary: "AI education analysis could not be completed.",

      strengths: foundSkills,
      skillGaps: missingSkills,

      justification:
        "Semantic AI analysis was unavailable, so the result is based on direct skill matching.",

      recommendation:
        ruleBasedScore >= 70
          ? "Shortlist"
          : ruleBasedScore >= 40
            ? "Consider"
            : "Reject",
    };
  }
};

module.exports = {
  analyzeResume,
};
