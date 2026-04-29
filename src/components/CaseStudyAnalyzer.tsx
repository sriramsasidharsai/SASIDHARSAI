/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileSearch, 
  TrendingDown, 
  TrendingUp, 
  ArrowRightCircle, 
  Loader2, 
  AlertCircle,
  BarChart3,
  Lightbulb,
  Zap,
  Target,
  History,
  Copy,
  Download,
  Trash2,
  CheckCircle2,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeGraphImage } from '../services/aiService';
import { CaseStudyResult, PriceLevel } from '../types';

export function CaseStudyAnalyzer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CaseStudyResult | null>(null);
  const [history, setHistory] = useState<CaseStudyResult[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('analysis_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (newResult: CaseStudyResult) => {
    const updated = [newResult, ...history.slice(0, 9)];
    setHistory(updated);
    localStorage.setItem('analysis_history', JSON.stringify(updated));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      const bufferReader = new FileReader();
      bufferReader.onload = (event) => {
        setImageBuffer(event.target?.result as ArrayBuffer);
      };
      bufferReader.readAsArrayBuffer(file);
    }
  };

  const runAnalysis = async () => {
    if (!imageBuffer) return;
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeGraphImage(imageBuffer, mimeType);
      const enrichedResult = { ...analysis, imageUrl: selectedImage || undefined };
      setResult(enrichedResult);
      saveToHistory(enrichedResult);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `Chart Analysis: ${result.trend}\nCurrent Price: ${result.currentPrice}\nBias: ${result.tradeBias}\nSupport: ${result.supportLevels[0]?.price}\nResistance: ${result.resistanceLevels[0]?.price}\nInsight: ${result.tradingInsight}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const LevelCard = ({ level, type }: { level: PriceLevel; type: 'support' | 'resistance' }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-2xl border backdrop-blur-md transition-all hover:scale-[1.02] ${
        type === 'support' 
          ? 'bg-emerald-500/5 border-emerald-500/20 shadow-lg shadow-emerald-500/5' 
          : 'bg-rose-500/5 border-rose-500/20 shadow-lg shadow-rose-500/5'
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className={`text-[10px] font-black uppercase tracking-widest ${
          type === 'support' ? 'text-emerald-400' : 'text-rose-400'
        }`}>
          {type} Level
        </span>
        <span className="text-[10px] font-bold text-slate-500">{(level.confidence * 100).toFixed(0)}% Conf.</span>
      </div>
      <div className="text-2xl font-black text-white tracking-tighter mb-1">{level.price}</div>
      <p className="text-[10px] text-slate-400 font-medium leading-tight">{level.reason}</p>
    </motion.div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input & History */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-colors"></div>
             
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/30">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  Vision Pro
                </h3>
                <span className="text-[10px] font-bold bg-white/5 text-slate-400 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">Live Engine</span>
             </div>
            
            <div className="space-y-6">
              <div className="relative group">
                <div className={`w-full aspect-[4/3] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden ${
                  selectedImage ? 'border-indigo-500/50 bg-black/40 shadow-inner' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-indigo-500/30'
                }`}>
                  {selectedImage ? (
                    <motion.img 
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      src={selectedImage} 
                      alt="Chart Analysis" 
                      className="w-full h-full object-contain p-2" 
                    />
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                        <Upload className="w-8 h-8 text-indigo-400" />
                      </div>
                      <p className="text-sm font-black text-slate-200 uppercase tracking-tight">Drop Chart Image</p>
                      <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest px-4 py-1 bg-white/5 rounded-full inline-block">NIFTY • STOCKS • CRYPTO</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                </div>
                {selectedImage && !isAnalyzing && (
                  <button 
                    onClick={() => { setSelectedImage(null); setResult(null); }}
                    className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-rose-500 transition-all z-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button 
                onClick={runAnalysis}
                disabled={!selectedImage || isAnalyzing}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                {isAnalyzing ? 'Decoding Market...' : 'Run Analysis'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5">
             <div className="flex items-center gap-3 mb-6">
                <History className="w-5 h-5 text-slate-400" />
                <h4 className="text-sm font-black text-slate-200 uppercase tracking-widest">Recent Scans</h4>
             </div>
             <div className="space-y-3">
                {history.length > 0 ? history.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => setResult(item)}
                    className="w-full flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-black/40 overflow-hidden shrink-0 border border-white/5">
                      {item.imageUrl && <img src={item.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />}
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-white truncate">{item.currentPrice || 'N/A'}</div>
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString()} • {item.trend}</div>
                    </div>
                    <ArrowRightCircle className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </button>
                )) : (
                  <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-3xl">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">No Recent Activity</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Right Column: Terminal Display */}
        <div className="xl:col-span-8">
           <AnimatePresence mode="wait">
            {!result && !isAnalyzing ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="bg-slate-900/30 border border-white/5 p-12 rounded-[3rem] h-[600px] flex flex-col items-center justify-center text-center backdrop-blur-sm"
              >
                <div className="w-24 h-24 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center mb-8 relative">
                   <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full animate-pulse"></div>
                   <Target className="w-12 h-12 text-indigo-400 relative z-10" />
                </div>
                <h4 className="text-white text-3xl font-black tracking-tight mb-4">Awaiting Signal...</h4>
                <p className="text-slate-500 text-base max-w-[360px] font-medium leading-relaxed">
                  Upload a chart to initiate high-precision price extraction and technical structure mapping.
                </p>
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-900 border border-white/5 p-12 rounded-[3rem] h-[600px] flex flex-col items-center justify-center text-center relative overflow-hidden"
              >
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_70%)] animate-pulse"></div>
                 <div className="relative z-10">
                    <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-8 shadow-[0_0_40px_rgba(99,102,241,0.2)]"></div>
                    <h4 className="text-white text-xl font-black uppercase tracking-[0.2em] mb-2 animate-pulse">Neural Path Scan</h4>
                    <p className="text-indigo-400 text-xs font-bold tracking-widest">EXTRACTING PRICE MATRIX • CANDLESTICK OCR ACTIVE</p>
                 </div>
              </motion.div>
            ) : result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Dashboard Top Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900/80 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Price</p>
                    <div className="text-2xl font-black text-white tracking-tighter">{result.currentPrice}</div>
                  </div>
                  <div className="bg-slate-900/80 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Trend Signal</p>
                    <div className={`text-xl font-black tracking-tight flex items-center gap-2 ${
                      result.trend === 'Uptrend' ? 'text-emerald-400' : result.trend === 'Downtrend' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {result.trend === 'Uptrend' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                      {result.trend}
                    </div>
                  </div>
                  <div className={`p-6 rounded-[2rem] border backdrop-blur-xl flex flex-col justify-center ${
                    result.tradeBias === 'Buy' ? 'bg-emerald-500/10 border-emerald-500/30' : 
                    result.tradeBias === 'Sell' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-amber-500/10 border-amber-500/30'
                  }`}>
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Trade Bias</p>
                    <div className={`text-2xl font-black tracking-tight ${
                      result.tradeBias === 'Buy' ? 'text-emerald-400' : 
                      result.tradeBias === 'Sell' ? 'text-rose-400' : 'text-amber-400'
                    }`}>{result.tradeBias}</div>
                  </div>
                  <div className="bg-indigo-600 p-6 rounded-[2rem] shadow-xl shadow-indigo-600/20 text-white flex flex-col justify-center">
                    <p className="text-[10px] font-black opacity-80 uppercase tracking-widest mb-1">Breakout Zone</p>
                    <div className="text-2xl font-black tracking-tighter">{result.breakoutLevel}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Support Column */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Defence Mechanisms (Support)</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {result.supportLevels.map((lvl, i) => <LevelCard key={i} level={lvl} type="support" />)}
                    </div>
                  </div>

                  {/* Resistance Column */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-4">
                      <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Supply Barriers (Resistance)</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {result.resistanceLevels.map((lvl, i) => <LevelCard key={i} level={lvl} type="resistance" />)}
                    </div>
                  </div>
                </div>

                {/* Insight Section */}
                <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[3rem] relative overflow-hidden group">
                  <div className="absolute bottom-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <BarChart3 size={240} className="text-white" />
                  </div>
                  <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                    <div className="w-20 h-20 bg-indigo-500 text-white rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl shadow-indigo-500/40">
                      <Lightbulb className="w-10 h-10" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                         <h4 className="text-2xl font-black text-white tracking-tight">AI Generated Alpha</h4>
                         <div className="flex items-center gap-2">
                           <button 
                            onClick={copyToClipboard}
                            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 transition-all flex items-center gap-2"
                           >
                             {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                             <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'Copied' : 'Extract'}</span>
                           </button>
                           <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 transition-all flex items-center gap-2">
                             <Download size={16} />
                             <span className="text-[10px] font-black uppercase tracking-widest">Export</span>
                           </button>
                         </div>
                      </div>
                      <p className="text-lg text-slate-300 leading-relaxed font-medium italic">
                        "{result.tradingInsight}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 p-6 rounded-3xl flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-indigo-400" />
                      <p className="text-[11px] text-slate-500 italic font-medium">{result.observation}</p>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Network Verified</span>
                   </div>
                </div>
              </motion.div>
            )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
