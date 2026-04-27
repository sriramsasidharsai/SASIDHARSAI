/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Zap, MessageCircle, AlertCircle } from 'lucide-react';
import { analyzeFeedbackSentiment } from '../services/aiService';
import { SentimentResult } from '../types';

export function PredictionEngine() {
  const [hours, setHours] = useState(40);
  const [complexity, setComplexity] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const calculateProbability = () => {
    // Simulated ML Logic based on the Python model's criteria
    const base = 50;
    const hourFactor = (hours - 30) * 1.5;
    const complexityPenalty = complexity * 4;
    const score = base + hourFactor - complexityPenalty + (sentiment ? (sentiment.score * 30) : 15);
    return Math.min(Math.max(score, 5), 98).toFixed(1);
  };

  const handleAIScan = async () => {
    if (!feedback.trim()) return;
    setIsAnalyzing(true);
    const result = await analyzeFeedbackSentiment(feedback);
    setSentiment(result);
    setIsAnalyzing(false);
  };

  const prob = calculateProbability();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom duration-700">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Zap className="text-amber-500 w-6 h-6" />
            Parameter Input
          </h3>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <label className="font-semibold text-slate-700">Hours Worked / Week: {hours}</label>
                <span className="text-slate-400">Standard 40h</span>
              </div>
              <input 
                type="range" min="10" max="60" value={hours} 
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <label className="font-semibold text-slate-700">Task Complexity Level: {complexity}</label>
                <span className="text-slate-400 text-xs">Based on Jira/Story Points</span>
              </div>
              <input 
                type="range" min="1" max="10" value={complexity} 
                onChange={(e) => setComplexity(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-slate-400" />
                Work Log / Supervisor Feedback
              </label>
              <textarea 
                placeholder="e.g., Intern was proactive but struggled with React hooks implementation..."
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 transition-all text-sm h-32"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <button 
                onClick={handleAIScan}
                disabled={isAnalyzing || !feedback}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 flex justify-center items-center gap-2"
              >
                {isAnalyzing ? "Processing AI Insight..." : "Scan with Gemini AI"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-indigo-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <h3 className="text-indigo-200 text-sm font-medium mb-1">Completion Probability</h3>
          <div className="text-6xl font-black mb-4 tracking-tighter">
            {prob}<span className="text-2xl text-indigo-400">%</span>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-indigo-900">
            <p className="text-sm text-indigo-100/70 leading-relaxed italic">
              "Based on historical data from Edorient Technologies workflow samples, this intern is 
              {Number(prob) > 70 ? ' likely to exceed' : ' currently facing some bottlenecks in'} project expectations."
            </p>
            
            {sentiment && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg text-xs font-semibold ${
                  sentiment.sentiment === 'Positive' ? 'bg-emerald-500/20 text-emerald-300' : 
                  sentiment.sentiment === 'Negative' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-500/20 text-slate-300'
                }`}
              >
                Sentiment: {sentiment.sentiment} ({Math.round(sentiment.score * 100)}%)
                <div className="mt-1 font-normal opacity-70">{sentiment.analysis}</div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm flex gap-4 items-start">
          <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
          <div className="text-sm">
            <h4 className="font-bold text-slate-900 mb-1">Observation Log</h4>
            <p className="text-slate-500 leading-snug">Complexity scores above 7 require at least 45h/week for optimal completion.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
