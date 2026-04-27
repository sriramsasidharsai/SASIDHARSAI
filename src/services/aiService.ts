/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { SentimentResult, CaseStudyResult } from "../types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeGraphImage(imageBuffer: ArrayBuffer, mimeType: string): Promise<CaseStudyResult> {
  if (!process.env.GEMINI_API_KEY) {
    return {
      supportLevel: "70%",
      resistanceLevel: "95%",
      trend: "Simulated Bullish",
      observation: "Please add GEMINI_API_KEY for real image analysis."
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const base64Data = btoa(
      new Uint8Array(imageBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType
      },
    };

    const prompt = `Analyze this productivity/performance index graph. 
    1. Identify the 'Support Level' (the bottom threshold where performance usually bounces back).
    2. Identify the 'Resistance Level' (the ceiling where performance plateaus).
    3. Determine the overall trend.
    4. Provide a 1-sentence technical observation.
    Return a valid JSON object:
    { "supportLevel": "string", "resistanceLevel": "string", "trend": "string", "observation": "string" }`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const jsonStr = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Vision Analysis failed:", error);
    throw error;
  }
}

export async function analyzeFeedbackSentiment(text: string): Promise<SentimentResult> {
  if (!process.env.GEMINI_API_KEY) {
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
