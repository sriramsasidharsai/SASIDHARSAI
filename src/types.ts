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

export interface CaseStudyResult {
  supportLevel: string;
  resistanceLevel: string;
  trend: string;
  observation: string;
}
