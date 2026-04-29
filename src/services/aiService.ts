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
      supportLevels: [
        { price: "23,820", confidence: 0.9, reason: "Recent swing low / triple bottom" },
        { price: "23,760", confidence: 0.85, reason: "Major accumulation zone" }
      ],
      resistanceLevels: [
        { price: "23,910", confidence: 0.92, reason: "Multi-touch rejection area" },
        { price: "23,980", confidence: 0.8, reason: "Visible gap fill resistance" }
      ],
      trend: "Uptrend",
      breakoutLevel: "23,925",
      tradingInsight: "Price is testing the immediate resistance cluster. A sustained breakout above 23,925 could invite fresh buying interest towards the 24k psychological mark.",
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

    const prompt = `Act as a Professional Financial Technical Analyst. Analyze this candlestick chart image.
    1. Read the Y-Axis price labels/values to calibrate the scale.
    2. Identify major Support and Resistance levels. Provide EXACT numeric price values based on your reading of the chart.
    3. Detect Trend (Uptrend, Downtrend, or Sideways).
    4. Pinpoint the most significant Breakout Level.
    5. Provide a professional Trading Insight.

    Return ONLY a valid JSON object:
    {
      "supportLevels": [
        { "price": "string", "confidence": number (0-1), "reason": "string" }
      ],
      "resistanceLevels": [
        { "price": "string", "confidence": number (0-1), "reason": "string" }
      ],
      "trend": "Uptrend" | "Downtrend" | "Sideways",
      "breakoutLevel": "string",
      "tradingInsight": "string",
      "observation": "technical summary"
    }`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid format from AI");
    return JSON.parse(jsonMatch[0]);
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
