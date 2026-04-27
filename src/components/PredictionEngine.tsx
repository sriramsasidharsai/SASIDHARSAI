/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Zap, MessageCircle, AlertCircle, Sparkles, Cpu } from 'lucide-react';
import { analyzeFeedbackSentiment } from '../services/aiService';
import { SentimentResult } from '../types';

export function PredictionEngine() {
  const [hours, setHours] = useState(40);
  const [complexity, setComplexity] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const calculateProbability = () => {
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-in slide-in-from-bottom duration-700">
      {/* Parameter Input Bento */}
      <div className="lg:col-span-7 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
        <h3 className="text-xl font-black mb-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          Model Hyperparameters
        </h3>
        
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Hours commitment / week</label>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black">{hours}H</span>
            </div>
            <input 
              type="range" min="10" max="60" value={hours} 
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Task Complexity Score</label>
              <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-black">LVL {complexity}</span>
            </div>
            <input 
              type="range" min="1" max="10" value={complexity} 
              onChange={(e) => setComplexity(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Supervisor Observations (AI Integration)
            </label>
            <div className="relative">
              <textarea 
                placeholder="Describe intern behavior or feedback..."
                className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-indigo-500 focus:ring-0 transition-all text-sm h-40 resize-none"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <button 
                onClick={handleAIScan}
                disabled={isAnalyzing || !feedback}
                className="absolute bottom-4 right-4 px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-400" />}
                Analyze with Gemini
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-4">
        {/* Result Bento */}
        <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden h-[300px] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
          <div>
            <h3 className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1">Completion Probability</h3>
            <div className="text-7xl font-black tracking-tighter">
              {prob}<span className="text-2xl text-indigo-300 ml-1">%</span>
            </div>
          </div>
          
          <div className="border-t border-indigo-500 pt-4">
            <p className="text-sm font-medium text-indigo-100 leading-snug">
               Model predicts a <strong>{Number(prob) > 70 ? 'High' : 'Moderate'}</strong> likelihood of milestone completion based on current workload.
            </p>
          </div>
        </div>

        {/* Sentiment Insight Bento */}
        <AnimatePresence mode="wait">
          {sentiment ? (
            <motion.div 
              key="sentiment"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4 h-[180px]"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                sentiment.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-600' : 
                sentiment.sentiment === 'Negative' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
              }`}>
                <Cpu className="w-8 h-8" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-black text-slate-900 tracking-tight">AI Sentiment Insight</h4>
                  <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${
                     sentiment.sentiment === 'Positive' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>{sentiment.sentiment}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed italic line-clamp-2">"{sentiment.analysis}"</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="placeholder"
              className="bg-slate-50 p-6 rounded-[2rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center h-[180px]"
            >
              <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Awaiting AI input...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

