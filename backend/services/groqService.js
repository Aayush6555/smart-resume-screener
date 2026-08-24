const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const analyzeWithLLM = async (resumeText, jobDescription) => {
  try {
    const prompt = `
You are an AI resume screening assistant.

Compare the candidate's resume with the given job description.

Your task:

1. Understand the meaning and context of both documents.
2. Calculate an overall match score from 1 to 10.
3. Decide whether the candidate should be:
   - Strongly Recommended
   - Recommended
   - Consider
   - Not Recommended
4. Extract relevant experience from the resume.
5. Extract education information from the resume.
6. Provide a clear justification for the match score.
7. Identify the candidate's strengths for this job.
8. Identify important gaps compared to the job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return ONLY valid JSON in this exact format:

{
  "matchScore": 8.5,
  "recommendation": "Recommended",
  "experience": "Brief summary of relevant experience",
  "education": "Brief summary of education",
  "justification": "Clear explanation of why this candidate received this score",
  "strengths": [
    "strength 1",
    "strength 2"
  ],
  "gaps": [
    "gap 1",
    "gap 2"
  ]
}
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
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

    return JSON.parse(content);
  } catch (error) {
    console.error("Groq LLM error:", error.message);
    throw new Error("Failed to analyze resume with AI");
  }
};

module.exports = {
  analyzeWithLLM,
};
