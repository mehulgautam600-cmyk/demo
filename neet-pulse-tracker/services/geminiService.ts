import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL_TEXT } from "../constants";
import { TestRecord } from "../types";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPerformanceAnalysis = async (history: TestRecord[]): Promise<{ text: string; probability: number }> => {
  if (history.length === 0) return { text: "DATA VOID. INSUFFICIENT INPUTS FOR TACTICAL ANALYSIS.", probability: 0 };

  // Sort by date ascending for the AI to see the timeline
  const sortedHistory = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Take the last 5 tests for context to save tokens/focus
  const recentHistory = sortedHistory.slice(-5);

  const prompt = `
    You are a MILITARY-GRADE ACADEMIC DRILL SERGEANT for the NEET exam.
    
    Analyze the following mock test history:
    ${recentHistory.map((t, index) => 
      `Test ${index + 1} (${t.date}): Total ${t.total}/720 [Physics: ${t.scores.physics}, Chemistry: ${t.scores.chemistry}, Biology: ${t.scores.biology}]`
    ).join('\n')}

    The latest test score is the PRIORITY.
    Govt Medical College Cutoff reference: ~610-630+ out of 720.

    INSTRUCTIONS:
    1. CALCULATE PROBABILITY: Estimate the probability (0-100%) of this student getting a Government Medical College seat based on their scores, consistency, and recent trend.
       - If score < 400: Probability < 5%
       - If score 400-500: Probability 5-20%
       - If score 500-580: Probability 20-60%
       - If score 580-620: Probability 60-85%
       - If score > 620: Probability 85-99%
       *Adjust based on improvement rate.*

    2. BE BRUTAL in the text analysis.
    3. Identify the WEAKEST LINK.
    4. Provide 3 TACTICAL DIRECTIVES.

    OUTPUT FORMAT:
    Start the response with the probability inside a tag like this: <PROBABILITY>75</PROBABILITY>
    Followed by the Markdown analysis:
    - STATUS REPORT
    - DAMAGE REPORT
    - TACTICAL DIRECTIVES
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
    });
    
    const rawText = response.text || "SYSTEM ERROR: UNABLE TO GENERATE TACTICAL REPORT.";
    
    // Extract Probability
    const match = rawText.match(/<PROBABILITY>(\d+)<\/PROBABILITY>/);
    let probability = 0;
    let cleanText = rawText;

    if (match && match[1]) {
      probability = parseInt(match[1], 10);
      cleanText = rawText.replace(/<PROBABILITY>\d+<\/PROBABILITY>/, '').trim();
    }

    return { text: cleanText, probability };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "CONNECTION FAILURE: AI MENTOR OFFLINE.", probability: 0 };
  }
};
