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
      id: "mock_" + Date.now(),
      timestamp: Date.now(),
      currentPrice: "23,875.40",
      supportLevels: [
        { price: "23,820.00", confidence: 0.95, reason: "Strong demand zone / visible consolidation" },
        { price: "23,760.00", confidence: 0.88, reason: "Previous major breakout point" }
      ],
      resistanceLevels: [
        { price: "23,910.50", confidence: 0.93, reason: "Multi-candle rejection / heavy supply" },
        { price: "23,980.00", confidence: 0.82, reason: "Gap fill target / technical ceiling" }
      ],
      trend: "Uptrend",
      breakoutLevel: "23,925.00",
      tradeBias: "Buy",
      tradingInsight: "Price is maintaining structure above the support cluster. A volume-backed move above 23,925 confirms bull dominance for 24k targets.",
      observation: "Simulated analysis. Please connect a valid Gemini API key for real-time price extraction."
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const base64Data = Buffer.from(imageBuffer).toString("base64");

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType
      },
    };

    const prompt = `Act as an Elite Institutional Trading OCR v4. Analyze this market chart image.
    
    CRITICAL OBJECTIVES:
    1. OCR Scan System: Extract precise numeric values from Y-axis price scales.
    2. Identification: 
       - currentPrice: Extract the current ticker price.
       - supportLevels: Detect exact Support 1 and Support 2 price levels where prices bounced or consolidated.
       - resistanceLevels: Detect exact Resistance 1 and Resistance 2 price levels where prices faced rejection or supply.
       - breakoutLevel: Find the strongest breakout/breakdown level nearby.
    3. Technical Matrix:
       - Trend: Categorize as 'Uptrend', 'Downtrend', or 'Sideways'.
       - Trade Bias: Conclude as 'Buy', 'Sell', or 'Neutral'.
    4. Intelligence Output: 
       - Provide a high-precision trading insight (Alpha).
       - Provide a technical observation summary.

    OUTPUT GUIDELINES:
    - Return ONLY a JSON object.
    - NO Markdown markers.
    - Prices must be strings for floating point integrity in display.

    JSON SCHEMA:
    {
      "currentPrice": "string",
      "supportLevels": [
        { "price": "string", "confidence": number (0.0-1.0), "reason": "string" }
      ],
      "resistanceLevels": [
        { "price": "string", "confidence": number (0.0-1.0), "reason": "string" }
      ],
      "trend": "Uptrend" | "Downtrend" | "Sideways",
      "breakoutLevel": "string",
      "tradeBias": "Buy" | "Sell" | "Neutral",
      "tradingInsight": "string",
      "observation": "string"
    }`;

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Vision Engine: Matrix Parse Failure");
    
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      ...parsed,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
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
