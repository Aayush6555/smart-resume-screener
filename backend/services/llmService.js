const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const analyzeResumeWithLLM = async (resumeText, jobDescription) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: `
You are an AI-powered resume screening assistant.

Your task is to semantically compare a candidate's resume with a job description.

Do not only compare exact keywords.

Understand:
- similar technologies
- related skills
- candidate experience
- projects
- education
- overall suitability

Return ONLY valid JSON in the following format:

{
  "semanticScore": 0,
  "strengths": [],
  "skillGaps": [],
  "recommendation": "",
  "justification": ""
}

semanticScore must be a number between 0 and 100.

recommendation must be one of:
"Strong Match"
"Good Match"
"Moderate Match"
"Low Match"
          `,
        },
        {
          role: "user",
          content: `
RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
          `,
        },
      ],

      temperature: 0.2,

      response_format: {
        type: "json_object",
      },
    });

    const result = completion.choices[0].message.content;

    return JSON.parse(result);
  } catch (error) {
    console.error("LLM analysis error:", error.message);

    throw new Error("Failed to perform semantic resume analysis");
  }
};

module.exports = {
  analyzeResumeWithLLM,
};
