const { GoogleGenerativeAI } = require("@google/generative-ai");
const asyncHandler = require("express-async-handler");

const getMentorResponse = asyncHandler(async (req, res) => {
    const { messages, mode, code } = req.body;

    if (!messages || !Array.isArray(messages)) {
        res.status(400);
        throw new Error("Messages are required and must be an array");
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        // Fallback/Mock response if no API key is provided
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const mockResponse = "I'm currently in offline mode because no GEMINI_API_KEY was found in the backend configuration. Please add a valid key to enable my full capabilities! In the meantime, I can tell you that coding is awesome. 🚀";
        
        // Simulate streaming for the mock response
        const words = mockResponse.split(' ');
        for (let i = 0; i < words.length; i++) {
            const chunk = JSON.stringify({
                choices: [{ delta: { content: words[i] + (i === words.length - 1 ? '' : ' ') } }]
            });
            res.write(`data: ${chunk}\n\n`);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        res.write('data: [DONE]\n\n');
        res.end();
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construct system prompt based on mode
    let systemPrompt = "You are a friendly and helpful AI Coding Mentor named NexCode Architect. ";
    if (mode === "explain") systemPrompt += "Focus on explaining concepts simply with examples. ";
    if (mode === "debug") systemPrompt += "Help the user find bugs in their code. Analyze the logic carefully. ";
    if (mode === "hints") systemPrompt += "Don't give the full solution immediately. Provide step-by-step hints. ";
    if (mode === "roadmap") systemPrompt += "Create a structured learning path or roadmap based on the user's goals. ";

    if (code) {
        systemPrompt += `\n\nContext Code:\n\`\`\`\n${code}\n\`\`\`\n`;
    }

    try {
        const lastMessage = messages[messages.length - 1].content;
        const history = messages.slice(0, -1).map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }]
        }));

        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const result = await chat.sendMessageStream(lastMessage);

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            const data = JSON.stringify({
                choices: [{ delta: { content: chunkText } }]
            });
            res.write(`data: ${data}\n\n`);
        }

        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error("Gemini Error:", error);
        res.write(`data: ${JSON.stringify({ error: "AI service failed to respond" })}\n\n`);
        res.end();
    }
});

const getCodeReview = asyncHandler(async (req, res) => {
    const { code, language, problemTitle, problemDescription, reviewType } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.json({
            success: true,
            feedback: {
                overall_score: 8,
                summary: "This is a mock review because GEMINI_API_KEY is missing. Your code looks clean and follows basic patterns.",
                strengths: ["Clean syntax", "Good naming conventions"],
                improvements: [
                    {
                        category: "optimization",
                        severity: "minor",
                        issue: "Potential for better time complexity",
                        suggestion: "Consider using a more efficient algorithm if data size grows."
                    }
                ],
                time_complexity: "O(n)",
                space_complexity: "O(1)",
                better_approach: "The current approach is solid for most use cases."
            }
        });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        As an expert code reviewer, analyze the following code.
        
        Language: ${language}
        Problem: ${problemTitle || "General Code"}
        Description: ${problemDescription || "N/A"}
        Review Type: ${reviewType || "full"}
        
        Code:
        \`\`\`
        ${code}
        \`\`\`
        
        Provide a detailed review in JSON format with the following structure:
        {
            "overall_score": (number 1-10),
            "summary": (brief string),
            "strengths": [strings],
            "improvements": [
                {
                    "category": ("logic" | "optimization" | "style" | "edge_case"),
                    "severity": ("minor" | "moderate" | "critical"),
                    "issue": (string),
                    "suggestion": (string),
                    "code_snippet": (optional string)
                }
            ],
            "time_complexity": (string),
            "space_complexity": (string),
            "better_approach": (optional string)
        }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from the response (Gemini might wrap it in markdown code blocks)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const feedback = JSON.parse(jsonMatch[0]);
            res.json({ success: true, feedback });
        } else {
            throw new Error("Failed to parse AI response as JSON");
        }
    } catch (error) {
        console.error("Gemini Review Error:", error);
        res.status(500).json({ success: false, error: "Failed to generate code review" });
    }
});

module.exports = {
    getMentorResponse,
    getCodeReview
};
