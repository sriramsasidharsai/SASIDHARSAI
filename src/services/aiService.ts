/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { SentimentResult } from "../types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeFeedbackSentiment(text: string): Promise<SentimentResult> {
  if (!process.env.GEMINI_API_KEY) {
    // Fallback if API key is not provided (mock simulation)
    const isNegative = text.toLowerCase().includes('slow') || text.toLowerCase().includes('error');
    return {
      sentiment: isNegative ? 'Negative' : 'Positive',
      score: isNegative ? 0.2 : 0.8,
      analysis: "This is a simulated analysis. Add a GEMINI_API_KEY to see real AI power."
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze the sentiment of this employee/intern feedback: "${text}". 
    Return a valid JSON object in this format: 
    { "sentiment": "Positive" | "Neutral" | "Negative", "score": number (0 to 1), "analysis": "brief 1 sentence explanation" }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonStr = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      sentiment: 'Neutral',
      score: 0.5,
      analysis: "Unable to reach AI analysis engine."
    };
  }
}
