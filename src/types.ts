/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface InternPerformance {
  week: string;
  tasksCompleted: number;
  hoursWorked: number;
  productivityScore: number;
}

export interface TaskPredictionInput {
  hoursWorked: number;
  complexity: number; // 1-10
  feedbackRating: number; // 1-5
  focusLevel: number; // 1-10
}

export interface PredictionResult {
  probability: number;
  recommendation: string;
}

export interface SentimentResult {
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  score: number;
  analysis: string;
}

export interface PriceLevel {
  price: string;
  confidence: number;
  reason: string;
}

export interface CaseStudyResult {
  id: string;
  timestamp: number;
  currentPrice?: string;
  supportLevels: PriceLevel[];
  resistanceLevels: PriceLevel[];
  trend: 'Uptrend' | 'Downtrend' | 'Sideways';
  breakoutLevel: string;
  tradeBias: 'Buy' | 'Sell' | 'Wait';
  tradingInsight: string;
  observation: string;
  imageUrl?: string;
}
