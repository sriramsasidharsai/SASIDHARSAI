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

    const prompt = `Act as a Professional High-Frequency Trading Analyst. Analyze this chart image (likely NIFTY/BANKNIFTY or Stocks).
    
    TASKS:
    1. OCR Calibration: Scan the vertical Y-axis to read visible price values.
    2. Precision Extraction: 
       - currentPrice: Identify the latest market price.
       - supportLevels: Find EXACT numeric prices where bulls defend (swing lows, wicks).
       - resistanceLevels: Find EXACT numeric prices where bears defend (swing highs, rejection).
       - breakoutLevel: Identify the key level where a trend shift occurs.
    3. Structural Analysis:
       - Detect Trend: 'Uptrend', 'Downtrend', or 'Sideways' (volatility contraction).
       - Trade Bias: Recommend 'Buy', 'Sell', or 'Wait' based on proximity to levels.
    4. Commentary: Provide a professional insight and summary.

    FORMAT RULES:
    - Return ONLY valid JSON.
    - Prices must be strings for precision.
    - Confidence is a number between 0 and 1.

    JSON SCHEMA:
    {
      "currentPrice": "string",
      "supportLevels": [
        { "price": "string", "confidence": number, "reason": "string" }
      ],
      "resistanceLevels": [
        { "price": "string", "confidence": number, "reason": "string" }
      ],
      "trend": "Uptrend" | "Downtrend" | "Sideways",
      "breakoutLevel": "string",
      "tradeBias": "Buy" | "Sell" | "Wait",
      "tradingInsight": "string",
      "observation": "short technical note"
    }`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format from AI Vision model.");
    
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      ...parsed,
      id: crypto.randomUUID(),
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
