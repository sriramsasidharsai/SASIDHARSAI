/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Zap, MessageCircle, AlertCircle, Sparkles, Cpu, RefreshCcw, Sliders, BrainCircuit, Target, Terminal } from 'lucide-react';
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      {/* Parameter Input */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-12 flex flex-col md:flex-row items-center justify-between gap-6 mb-4"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-black flex items-center gap-3 text-white tracking-tight">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <Zap className="text-amber-400 w-6 h-6" />
            </div>
            Model Hyperparameters
          </h2>
          <p className="text-slate-500 text-xs font-medium ml-12 italic tracking-wide">Fine-tune training parameters for predictive inference calibration</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
           <Terminal className="w-4 h-4 text-emerald-400" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Core Ver: Neural.v7.2</span>
        </div>
      </motion.div>

      <div className="lg:col-span-7 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="space-y-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-3 h-3 text-indigo-400" />
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Workload/Hr</label>
                  </div>
                  <span className="text-xl font-black text-indigo-400 tracking-tighter italic">{hours}H</span>
                </div>
                <input 
                  type="range" min="10" max="60" value={hours} 
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full h-1.5 bg-black/40 rounded-full appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-3 h-3 text-rose-400" />
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Complexity</label>
                  </div>
                  <span className="text-xl font-black text-rose-400 tracking-tighter italic">LVL {complexity}</span>
                </div>
                <input 
                  type="range" min="1" max="10" value={complexity} 
                  onChange={(e) => setComplexity(Number(e.target.value))}
                  className="w-full h-1.5 bg-black/40 rounded-full appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-indigo-400" />
                  Neural Context Injection
                </h4>
                <div className="h-px flex-grow bg-white/5 mx-4"></div>
              </div>
              <div className="relative group">
                <textarea 
                  placeholder="Input qualitative observations for semantic weighting..."
                  className="w-full p-6 rounded-2xl border border-white/5 bg-black/40 text-slate-200 placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-0 transition-all text-sm h-48 resize-none shadow-inner"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <div className="absolute inset-x-0 bottom-0 p-4 flex justify-end bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl pointer-events-none">
                  <button 
                    onClick={handleAIScan}
                    disabled={isAnalyzing || !feedback}
                    className="pointer-events-auto px-8 py-3 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all flex items-center gap-3 disabled:opacity-50 disabled:grayscale"
                  >
                    {isAnalyzing ? <RefreshCcw className="w-4 h-4 animate-spin text-white" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                    Compute Semantic Bias
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="lg:col-span-5 space-y-8">
        {/* Probability Meter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden h-[300px] flex flex-col justify-between group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
               <Target className="w-4 h-4 text-indigo-200" />
               <h3 className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em] leading-none">Inference Probability</h3>
            </div>
            <div className="text-[100px] font-black tracking-tighter leading-none mt-2 flex items-baseline">
              {prob}<span className="text-3xl text-indigo-300/80 ml-2 tracking-normal">%</span>
            </div>
          </div>
          
          <div className="relative z-10 border-t border-indigo-400/30 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
              <p className="text-xs font-bold text-indigo-100 leading-snug tracking-tight">
                 Confidence: <strong>{Number(prob) > 70 ? 'HIGH MAGNITUDE' : 'MODERATE CLUSTER'}</strong>. High probability of milestone success detected in current training set.
              </p>
            </div>
          </div>
        </motion.div>

        {/* AI Insight */}
        <AnimatePresence mode="wait">
          {sentiment ? (
            <motion.div 
              key="sentiment"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col gap-6 h-[260px] relative overflow-hidden"
            >
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full"></div>
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                    sentiment.sentiment === 'Positive' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                    sentiment.sentiment === 'Negative' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'
                  }`}>
                    <Cpu className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-black text-white tracking-tight leading-none">Neural Insights</h4>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Sentiment extraction complete</p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic border ${
                   sentiment.sentiment === 'Positive' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {sentiment.sentiment}
                </div>
              </div>
              <div className="flex-grow bg-black/20 p-5 rounded-2xl border border-white/5 relative z-10">
                <p className="text-xs text-slate-400 leading-relaxed italic font-medium">"{sentiment.analysis}"</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="placeholder"
              className="bg-slate-900/20 p-8 rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center h-[260px] space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-slate-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Awaiting Neural Context</p>
                <p className="text-xs text-slate-600 font-medium max-w-[200px]">Inject observations to calibrate the prediction probability engine.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
