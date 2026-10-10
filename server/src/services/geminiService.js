import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Helper to call content generation with fallback models to ensure robust execution.
 * Tries the available models in order: gemini-2.5-flash, gemini-3.1-flash-lite, etc.
 * @param {string} prompt - The prompt text to evaluate
 * @returns {Promise<string>} The generated text response
 */
const callGeminiWithFallback = async (prompt) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const models = [
        "gemini-2.5-flash",
        "gemini-3.1-flash-lite",
        "gemini-3.5-flash",
        "gemini-2.0-flash-lite",
        "gemini-flash-latest"
    ];

    let lastError = null;
    for (const modelName of models) {
        try {
            console.log(`[Gemini] Attempting content generation with model: ${modelName}`);
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    responseMimeType: "application/json",
                },
            });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            if (text) {
                console.log(`[Gemini] Successfully generated content using model: ${modelName}`);
                return text;
            }
        } catch (error) {
            console.warn(`[Gemini] Model ${modelName} failed:`, error.message || error);
            lastError = error;
        }
    }
    throw lastError || new Error("All Gemini models failed to generate content.");
};

/**
 * Sends resume text to Gemini for ATS scoring and extraction.
 * @param {string} resumeText - Parsed text from the resume PDF
 * @param {string} [targetRole] - Optional target job role
 * @param {string} [targetDescription] - Optional target job description
 * @returns {Promise<object>} The extracted and evaluated resume data
 */
export const analyzeResumeContent = async (resumeText, targetRole = "", targetDescription = "") => {
    try {
        const prompt = `
You are an expert HR recruiter and ATS (Applicant Tracking System) optimization specialist.
Analyze the following resume text. Optionally, evaluate it against the target role and job description provided below.

Resume Text:
"""
${resumeText}
"""

Target Role: ${targetRole || "General Software/Technology Professional"}
Target Job Description: ${targetDescription || "General Software/Technology Industry standards"}

Your goal is to parse the resume, extract key details, calculate a realistic ATS score (0 to 100) reflecting how well the resume matches the target role and description, identify missing skills needed for the target role/description, and provide actionable, professional feedback.

Return ONLY a JSON object with the following exact keys and structure:
{
  "atsScore": 85,
  "extractedSkills": ["Skill1", "Skill2"],
  "extractedProjects": [
    {
      "title": "Project Name",
      "description": "Short summary of what was done",
      "technologies": ["Tech1", "Tech2"]
    }
  ],
  "extractedExperience": [
    {
      "role": "Job Role",
      "company": "Company Name",
      "duration": "Start Date - End Date (e.g. June 2024 - Present)",
      "description": "Short summary of responsibilities and achievements"
    }
  ],
  "missingSkills": ["SkillA", "SkillB"],
  "feedback": "Detailed, professional feedback explaining why the score was given, and offering specific recommendations to improve the resume."
}
`;

        const text = await callGeminiWithFallback(prompt);
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini AI Analysis Error:", error);
        throw error;
    }
};

/**
 * Generate Interview Questions
 */
export const generateInterviewQuestions = async (
    role,
    domain,
    difficulty
) => {
    try {
        const prompt = `
You are an expert technical interviewer.

Generate 10 UNIQUE interview questions.

Role: ${role}
Technology: ${domain}
Difficulty: ${difficulty}

Rules:
- Questions must be role-specific.
- Include theory questions.
- Include coding questions.
- Include project-based questions.
- Include scenario-based questions.
- Include troubleshooting questions.
- Include HR questions.
- Every interview should be different.

Return ONLY JSON array.

Example:
[
  "Question 1",
  "Question 2"
]
`;

        const text = await callGeminiWithFallback(prompt);
        return JSON.parse(text);
    } catch (error) {
        console.error(
            "Gemini Question Generation Error:",
            error
        );

        return [
            `What is ${domain}?`,
            `Explain the core concepts of ${domain}.`,
            `Describe a project using ${domain}.`,
            `What are challenges in ${domain}?`,
            `Why should we hire you as a ${role}?`,
        ];
    }
};

/**
 * Evaluate Interview Answer
 */
export const evaluateAnswer = async (
    question,
    answer
) => {
    try {
        const prompt = `
You are an expert technical interviewer.

Question:
${question}

Candidate Answer:
${answer}

Evaluate the answer strictly.

Instructions:
- Score between 0 and 10.
- Wrong answer => 0-3
- Partially correct => 4-7
- Excellent answer => 8-10
- Give detailed feedback.
- Explain mistakes.
- Suggest improvements.
- Provide a model correct answer.

Return ONLY JSON:

{
  "score": 0,
  "feedback": "",
  "improvement": "",
  "correctAnswer": ""
}
`;

        const text = await callGeminiWithFallback(prompt);
        return JSON.parse(text);
    } catch (error) {
        console.error(
            "Gemini Answer Evaluation Error:",
            error
        );

        return {
            score: 0,
            feedback:
                "Unable to evaluate answer.",
            improvement:
                "Try giving a more detailed answer.",
            correctAnswer:
                "Correct answer unavailable.",
        };
    }
};

/**
 * Text-only generator for standard chat (markdown/text output rather than structured JSON)
 */
export const callGeminiTextWithFallback = async (prompt, systemInstruction = "") => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const models = [
        "gemini-2.5-flash",
        "gemini-3.1-flash-lite",
        "gemini-3.5-flash",
        "gemini-2.0-flash-lite",
        "gemini-flash-latest"
    ];

    let lastError = null;
    for (const modelName of models) {
        try {
            console.log(`[Gemini Text] Attempting content generation with model: ${modelName}`);
            const modelConfig = { model: modelName };
            if (systemInstruction) {
                modelConfig.systemInstruction = systemInstruction;
            }
            const model = genAI.getGenerativeModel(modelConfig);
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            if (text) {
                console.log(`[Gemini Text] Successfully generated content using model: ${modelName}`);
                return text;
            }
        } catch (error) {
            console.warn(`[Gemini Text] Model ${modelName} failed:`, error.message || error);
            lastError = error;
        }
    }
    throw lastError || new Error("All Gemini text models failed to generate content.");
};

/**
 * Sends chatbot history and a new prompt to Gemini.
 */
export const generateChatResponse = async (chatHistory, newPrompt) => {
    try {
        const systemInstruction = "You are Prep Ninja, a helpful, encouraging, and highly knowledgeable AI Career Assistant and placement preparation coach. Help candidates with resume enhancement suggestions, career roadmaps, technical and behavioral interview guidance, and explanation of coding/theory concepts. Keep responses structured and easy to read using markdown formatting.";
        
        let formattedPrompt = "";
        if (chatHistory && chatHistory.length > 0) {
            formattedPrompt += "Previous Conversation:\n";
            chatHistory.forEach(msg => {
                const prefix = msg.sender === "user" ? "Candidate" : "Prep Ninja";
                formattedPrompt += `${prefix}: ${msg.text}\n`;
            });
            formattedPrompt += "\n";
        }
        formattedPrompt += `Candidate's New Message:\n${newPrompt}\n\nPrep Ninja:`;

        const responseText = await callGeminiTextWithFallback(formattedPrompt, systemInstruction);
        return responseText;
    } catch (error) {
        console.error("Gemini Chat Response Error:", error);
        return "I apologize, but I am having trouble connecting to my brain right now. How else can I help you today?";
    }
};

/**
 * Generates prep roadmap and materials (questions, resources)
 */
export const generateRoadmapAndMaterials = async (topic, role, company, difficulty) => {
    try {
        const prompt = `
You are an expert technical interviewer and syllabus designer.
Generate a structured learning roadmap and preparation questions for:
Topic: ${topic}
Target Role: ${role || "N/A"}
Target Company: ${company || "N/A"}
Difficulty: ${difficulty}

Return ONLY a JSON object with the following exact keys and structure:
{
  "roadmap": [
    {
      "phase": "Phase 1: Title",
      "description": "Short summary of what to study",
      "resources": ["Resource Name/Link 1", "Resource Name/Link 2"]
    }
  ],
  "questions": [
    {
      "type": "CODING",
      "title": "Question Title",
      "description": "Question details and prompt",
      "difficulty": "Easy",
      "source": "LeetCode",
      "url": "https://leetcode.com",
      "correctAnswer": "Brief reference solution/explanation"
    },
    {
      "type": "THEORY",
      "title": "Question Title",
      "description": "Question details",
      "difficulty": "Medium",
      "source": "Prep Ninja AI",
      "url": "",
      "correctAnswer": "Reference answer explanation"
    }
  ]
}

Rules:
1. Roadmap should have exactly 4 phases.
2. Questions array should contain exactly 6 questions total:
   - 2 CODING questions (with external url if applicable, e.g. LeetCode/HackerRank, or blank)
   - 2 THEORY questions
   - 1 INTERVIEW question
   - 1 BEHAVIORAL question
3. Question difficulties must match the overall difficulty requested.
4. Avoid markdown syntax wrappers around the JSON block. Return ONLY the JSON object.
`;

        const text = await callGeminiWithFallback(prompt);
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Roadmap & Materials Error:", error);
        // Return dummy default roadmap matching schema
        return {
            roadmap: [
                { phase: "Phase 1: Fundamentals", description: `Learn basics of ${topic}`, resources: ["GeeksforGeeks", "MDN / Official docs"] },
                { phase: "Phase 2: Core Concepts", description: `Explore intermediate items of ${topic}`, resources: ["TutorialsPoint", "Medium articles"] },
                { phase: "Phase 3: Deep Dive & Troubleshooting", description: `Advanced operations and practices`, resources: ["StackOverflow", "YouTube courses"] },
                { phase: "Phase 4: Interview & Practice", description: `Mock interview and problem solving`, resources: ["LeetCode", "Prep Ninja Mock Interview"] }
            ],
            questions: [
                { type: "THEORY", title: `What is ${topic}?`, description: `Explain core concepts of ${topic}.`, difficulty: "Easy", source: "Prep Ninja AI", url: "", correctAnswer: `Detailed overview of ${topic}.` },
                { type: "CODING", title: `Reverse/Implement ${topic}`, description: `Write a simple program demonstrating ${topic}.`, difficulty: "Easy", source: "Prep Ninja AI", url: "", correctAnswer: "Code demonstration." },
                { type: "THEORY", title: `Common pitfalls in ${topic}`, description: `List 3 common problems when using ${topic}.`, difficulty: "Medium", source: "Prep Ninja AI", url: "", correctAnswer: "Pitfalls overview." },
                { type: "CODING", title: `Optimize ${topic} algorithm`, description: `Given a bottleneck, optimize the usage of ${topic}.`, difficulty: "Medium", source: "Prep Ninja AI", url: "", correctAnswer: "Optimized code snippet." },
                { type: "INTERVIEW", title: `How does ${topic} compare?`, description: `Explain differences between ${topic} and other paradigms.`, difficulty: "Medium", source: "Prep Ninja AI", url: "", correctAnswer: " Paradigms comparison." },
                { type: "BEHAVIORAL", title: "Tell me about a time you solved a problem", description: `Describe a scenario where you had to apply ${topic} under tight deadline.`, difficulty: "Medium", source: "Prep Ninja AI", url: "", correctAnswer: "STAR method behavioral sample answer." }
            ]
        };
    }
};

/**
 * Generates MCQs for study quizzes
 */
export const generateQuizQuestions = async (topic, difficulty) => {
    try {
        const prompt = `
You are an expert academic evaluator.
Generate 5 Multiple-Choice Questions (MCQs) for testing knowledge on:
Topic: ${topic}
Difficulty: ${difficulty}

Return ONLY a JSON array of questions, matching this exact structure:
[
  {
    "questionText": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option B"
  }
]

Rules:
1. Options must contain exactly 4 choices.
2. "correctAnswer" MUST match one of the items inside "options" exactly.
3. Questions must be highly conceptual and challenging.
`;

        const text = await callGeminiWithFallback(prompt);
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Quiz Questions Error:", error);
        return [
            {
                questionText: `What is the primary purpose of ${topic}?`,
                options: ["Option A: Basic use case", "Option B: Secondary benefit", "Option C: Irrelevant action", "Option D: None of the above"],
                correctAnswer: "Option A: Basic use case"
            },
            {
                questionText: `Which of the following is true regarding ${topic}?`,
                options: ["It is synchronous only", "It is used widely in modern engineering", "It is deprecated", "It has no performance cost"],
                correctAnswer: "It is used widely in modern engineering"
            },
            {
                questionText: `Which difficulty level matches this ${topic} quiz?`,
                options: ["Beginner", "Intermediate", "Advanced", "Selected: " + difficulty],
                correctAnswer: "Selected: " + difficulty
            },
            {
                questionText: `What is a common helper when debugging ${topic}?`,
                options: ["Print logs", "Restart machine", "Delete repository", "Ignore errors"],
                correctAnswer: "Print logs"
            },
            {
                questionText: `Why is ${topic} essential in software development?`,
                options: ["Boosts performance and structure", "It is not essential", "It adds code lines", "It is only for backend"],
                correctAnswer: "Boosts performance and structure"
            }
        ];
    }
};

/**
 * Generates personalized week-by-week study plan
 */
export const generatePersonalizedStudyPlan = async (role, timeline, skills) => {
    try {
        const prompt = `
You are an expert career planner and academic advisor.
Create a weekly preparation roadmap to help a candidate land a role as a ${role} in ${timeline}.
Candidate's Current Skills: ${skills.length > 0 ? skills.join(", ") : "None specified"}

Return ONLY a JSON object matching this exact structure:
{
  "roadmap": [
    {
      "week": 1,
      "title": "Week 1: Focus Area",
      "tasks": [
        { "text": "Task description 1" },
        { "text": "Task description 2" }
      ]
    }
  ],
  "milestones": [
    {
      "title": "Milestone Title",
      "daysFromStart": 7
    }
  ]
}

Rules:
1. Divide the plan into weeks based on the timeline (e.g. 4 Weeks => 4 roadmap items, 12 Weeks => 12 items). Limit to maximum 8 weeks for sizing constraints if timeline is longer.
2. Each week should contain 3-4 specific tasks.
3. Provide exactly 3 milestones. The "daysFromStart" should indicate the target day of accomplishment (e.g., 7 for Week 1, 14 for Week 2, etc.).
`;

        const text = await callGeminiWithFallback(prompt);
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Study Plan Error:", error);
        return {
            roadmap: [
                { week: 1, title: "Week 1: Core Fundamentals & Syntax", tasks: [{ text: "Revise core concepts of the role" }, { text: "Solve 5 beginner coding problems" }, { text: "Review interview behavioral questions" }] },
                { week: 2, title: "Week 2: Advanced Topics & Projects", tasks: [{ text: "Build a prototype/project using key tech" }, { text: "Solve 5 medium coding problems" }, { text: "Take a mock interview session" }] },
                { week: 3, title: "Week 3: System Design & Frameworks", tasks: [{ text: "Learn system architecture foundations" }, { text: "Improve resume ATS compatibility rating" }, { text: "Study top 20 theoretical interview questions" }] },
                { week: 4, title: "Week 4: Final Rehearsal & Mock Practice", tasks: [{ text: "Take 2 technical mock interviews" }, { text: "Fine-tune LinkedIn and portfolio details" }, { text: "Do full revision quizzes" }] }
            ],
            milestones: [
                { title: "Complete Core Fundamentals Review", daysFromStart: 7 },
                { title: "Perform Project Integration & Initial Mock Test", daysFromStart: 14 },
                { title: "Complete Advanced Practice & Portfolio Polish", daysFromStart: 28 }
            ]
        };
    }
};

