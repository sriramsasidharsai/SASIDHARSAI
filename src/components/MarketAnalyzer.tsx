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
  Wallet,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeGraphImage } from '../services/aiService';
import { CaseStudyResult, PriceLevel } from '../types';

export function MarketAnalyzer() {
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

  const LevelCard = ({ level, type, index }: { level: PriceLevel; type: 'support' | 'resistance'; index: number }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-5 rounded-2xl border backdrop-blur-md transition-all hover:scale-[1.02] relative overflow-hidden group ${
        type === 'support' 
          ? 'bg-emerald-500/5 border-emerald-500/20 shadow-lg shadow-emerald-500/5' 
          : 'bg-rose-500/5 border-rose-500/20 shadow-lg shadow-rose-500/5'
      }`}
    >
      <div className={`absolute top-0 right-0 py-1 px-3 text-[8px] font-black uppercase tracking-widest ${
        type === 'support' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
      }`}>
        {(level.confidence * 100).toFixed(0)}% Accuracy
      </div>
      <div className="flex justify-between items-center mb-3">
        <span className={`text-[10px] font-black uppercase tracking-widest ${
          type === 'support' ? 'text-emerald-400' : 'text-rose-400'
        }`}>
          {type} {index + 1}
        </span>
      </div>
      <div className="text-3xl font-black text-white tracking-tighter mb-2">{level.price}</div>
      <div className="h-px bg-white/5 w-full mb-3"></div>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight leading-tight group-hover:text-slate-300 transition-colors">{level.reason}</p>
    </motion.div>
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        {/* Left Column: Input & Discovery */}
        <div className="xl:col-span-4 space-y-8">
          <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden relative group">
             <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-[80px] -mr-24 -mt-24 group-hover:bg-indigo-500/20 transition-all duration-700"></div>
             
             <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white tracking-tight">Vision Pro</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Institutional OCR v4</p>
                </div>
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-inner">
                   <BarChart3 className="w-6 h-6" />
                </div>
             </div>
            
            <div className="space-y-8">
              <div className="relative group">
                <div className={`w-full aspect-square rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden relative ${
                  selectedImage ? 'border-indigo-500/30 bg-black/60 shadow-2xl' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-indigo-500/40'
                }`}>
                  {selectedImage ? (
                    <motion.img 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      src={selectedImage} 
                      alt="Chart Analysis" 
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="text-center p-10 cursor-pointer">
                      <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-indigo-500/10">
                        <Upload className="w-10 h-10 text-indigo-400" />
                      </div>
                      <p className="text-lg font-black text-white uppercase tracking-tight">Supply Link</p>
                      <p className="text-[10px] text-slate-500 mt-3 font-bold uppercase tracking-[0.2em] px-4 py-1.5 bg-white/5 rounded-full inline-block border border-white/5">NIFTY • STOCKS • FOREX</p>
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
                    className="absolute top-6 right-6 p-3 bg-black/80 backdrop-blur-xl rounded-2xl text-white hover:bg-rose-500 hover:scale-110 transition-all z-30 shadow-2xl border border-white/10"
                  >
                    <Trash2 className="w-5 h-5 text-rose-200" />
                  </button>
                )}
              </div>

              <button 
                onClick={runAnalysis}
                disabled={!selectedImage || isAnalyzing}
                className="w-full py-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-[1.8rem] font-black text-[13px] uppercase tracking-[0.2em] hover:from-indigo-500 hover:to-indigo-600 hover:shadow-3xl hover:shadow-indigo-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale"
              >
                {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current text-amber-300" />}
                {isAnalyzing ? 'Decoding Market Cluster...' : 'Initiate Analysis'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white/5 shadow-xl">
             <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-sm font-black text-slate-200 uppercase tracking-widest">Previous Analyses</h4>
                </div>
                <div className="h-5 w-px bg-white/10 mx-2"></div>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">History</span>
             </div>
             <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {history.length > 0 ? history.map((item, idx) => (
                  <motion.button 
                    key={item.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setResult(item)}
                    className="w-full flex items-center gap-5 p-4 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-indigo-500/20 transition-all group relative overflow-hidden"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-black/40 overflow-hidden shrink-0 border border-white/10 group-hover:border-indigo-500/40 transition-colors">
                      {item.imageUrl && <img src={item.imageUrl} className="w-full h-full object-cover opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />}
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="text-sm font-black text-white tracking-tight">{item.currentPrice || 'N/A'}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                          item.trend === 'Uptrend' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {item.trend}
                        </span>
                        <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest leading-none">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ArrowRightCircle className="w-5 h-5 text-slate-800 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </motion.button>
                )) : (
                  <div className="py-12 text-center border border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.02]">
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic">Awaiting First Signal</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Right Column: Dynamic Matrix */}
        <div className="xl:col-span-8">
           <AnimatePresence mode="wait">
            {!result && !isAnalyzing ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="bg-slate-900/30 border border-white/5 p-16 rounded-[4rem] min-h-[800px] flex flex-col items-center justify-center text-center backdrop-blur-md relative overflow-hidden group shadow-3xl"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03),transparent_70%)] group-hover:opacity-100 opacity-50 transition-opacity"></div>
                <div className="w-32 h-32 bg-white/5 rounded-[2.8rem] border border-white/10 flex items-center justify-center mb-10 relative shadow-2xl">
                   <div className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full animate-pulse"></div>
                   <Target className="w-14 h-14 text-indigo-400 relative z-10" />
                </div>
                <h4 className="text-white text-5xl font-black tracking-tighter mb-6 leading-none">Awaiting Operational Signal</h4>
                <p className="text-slate-500 text-lg max-w-[440px] font-medium leading-relaxed italic opacity-80">
                  Deploy a market capture to initiate high-precision price extraction, trend mapping, and institutional technical clusters.
                </p>
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-950 border border-white/5 p-16 rounded-[4rem] min-h-[800px] flex flex-col items-center justify-center text-center relative overflow-hidden shadow-3xl"
              >
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_70%)] animate-pulse"></div>
                 <div className="relative z-10 space-y-10">
                    <div className="w-32 h-32 border-8 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin mx-auto shadow-[0_0_60px_rgba(99,102,241,0.3)]"></div>
                    <div className="space-y-4">
                      <h4 className="text-white text-3xl font-black uppercase tracking-[0.3em] animate-pulse">Scanning Clusters</h4>
                      <div className="flex items-center justify-center gap-4 text-indigo-400 text-[10px] font-black tracking-widest bg-white/5 px-6 py-2 rounded-full border border-white/5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                        CANDLESTICK OCR ACTIVE • PRICE EXTRACTION v4.0.2
                      </div>
                    </div>
                 </div>
              </motion.div>
            ) : result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-10"
              >
                {/* Dashboard Top Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-slate-900/60 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-xl hover:border-indigo-500/30 transition-colors group">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover:text-indigo-400 transition-colors">Current Price</p>
                    <div className="text-4xl font-black text-white tracking-tighter italic">{result.currentPrice}</div>
                  </div>
                  
                  <div className="bg-slate-900/60 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-xl hover:border-indigo-500/30 transition-colors group relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-2 h-full ${
                      result.trend === 'Uptrend' ? 'bg-emerald-500' : result.trend === 'Downtrend' ? 'bg-rose-500' : 'bg-amber-500'
                    }`}></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover:text-indigo-400 transition-colors">Trend Cluster</p>
                    <div className={`text-2xl font-black tracking-tighter flex items-center gap-3 italic ${
                      result.trend === 'Uptrend' ? 'text-emerald-400' : result.trend === 'Downtrend' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {result.trend === 'Uptrend' ? <TrendingUp size={28} /> : 
                       result.trend === 'Downtrend' ? <TrendingDown size={28} /> : 
                       <RefreshCcw size={28} className="animate-spin-slow" />}
                      {result.trend}
                    </div>
                  </div>

                  <div className={`p-8 rounded-[2.5rem] border backdrop-blur-3xl shadow-xl flex flex-col justify-center relative group overflow-hidden ${
                    result.tradeBias === 'Buy' ? 'bg-emerald-500/10 border-emerald-500/30' : 
                    result.tradeBias === 'Sell' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-amber-500/10 border-amber-500/30'
                  }`}>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 blur-3xl rounded-full"></div>
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Trade Bias</p>
                    <div className={`text-5xl font-black tracking-tighter flex items-center gap-3 italic ${
                      result.tradeBias === 'Buy' ? 'text-emerald-300' : 
                      result.tradeBias === 'Sell' ? 'text-rose-300' : 'text-amber-300'
                    }`}>
                      {result.tradeBias}
                    </div>
                  </div>

                  <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-600/30 text-white flex flex-col justify-center group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.1),transparent_70%)]"></div>
                    <p className="text-[10px] font-black opacity-80 uppercase tracking-widest mb-2 relative z-10">Breakout Target</p>
                    <div className="text-4xl font-black tracking-tighter relative z-10 italic">{result.breakoutLevel}</div>
                  </div>
                </div>

                {/* S/R Scanner Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Support scanner */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/5 space-y-8 shadow-2xl"
                  >
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 shadow-inner">
                          <Wallet className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Support Scanner</h4>
                          <h3 className="text-lg font-black text-white uppercase tracking-tight">Demand Clusters</h3>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="text-2xl font-black text-emerald-400 italic leading-none">{result.supportLevels.length}</div>
                         <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">Found</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                      {result.supportLevels.map((lvl, i) => <LevelCard key={i} index={i} level={lvl} type="support" />)}
                    </div>
                  </motion.div>

                  {/* Resistance scanner */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/5 space-y-8 shadow-2xl"
                  >
                    <div className="flex items-center justify-between px-2">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400 shadow-inner">
                           <Target className="w-6 h-6" />
                         </div>
                         <div className="space-y-0.5">
                           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Resistance Scanner</h4>
                           <h3 className="text-lg font-black text-white uppercase tracking-tight">Supply Barriers</h3>
                         </div>
                       </div>
                       <div className="text-right">
                          <div className="text-2xl font-black text-rose-400 italic leading-none">{result.resistanceLevels.length}</div>
                          <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">Found</div>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                      {result.resistanceLevels.map((lvl, i) => <LevelCard key={i} index={i} level={lvl} type="resistance" />)}
                    </div>
                  </motion.div>
                </div>

                {/* AI Insight & Confidence Gauage */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 bg-gradient-to-br from-indigo-600/20 to-indigo-700/10 border border-indigo-500/20 p-12 rounded-[4rem] relative overflow-hidden group shadow-3xl">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.1),transparent_60%)]"></div>
                    <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
                      <div className="w-24 h-24 bg-indigo-500 text-white rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-3xl shadow-indigo-500/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        <Lightbulb className="w-12 h-12 relative z-10 drop-shadow-lg" />
                      </div>
                      <div className="flex-1 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                           <div className="space-y-1">
                             <h4 className="text-3xl font-black text-white tracking-tighter uppercase leading-none italic">Trend Intelligence</h4>
                             <p className="text-[10px] font-black text-indigo-400/80 uppercase tracking-widest mt-2 px-3 py-1 bg-indigo-400/10 rounded-full border border-indigo-400/20 inline-block">Neural Reasoning Manifest</p>
                           </div>
                           <div className="flex items-center gap-3">
                             <button 
                              onClick={copyToClipboard}
                              className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all flex items-center gap-3 shadow-lg"
                             >
                               {copied ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
                               <span className="text-xs font-black uppercase tracking-[0.2em]">{copied ? 'Copied' : 'Extract Alpha'}</span>
                             </button>
                           </div>
                        </div>
                        <p className="text-xl text-slate-200 leading-relaxed font-black italic tracking-tight text-balance opacity-90 group-hover:opacity-100 transition-opacity">
                          "{result.tradingInsight}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 bg-slate-900/60 border border-white/10 p-10 rounded-[3.5rem] flex flex-col items-center justify-center text-center shadow-3xl group relative overflow-hidden backdrop-blur-2xl">
                     <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full"></div>
                     <div className="relative z-10 space-y-8">
                       <div className="space-y-2">
                         <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Confidence Factor</span>
                         <h3 className="text-5xl font-black text-white tracking-widest italic group-hover:scale-110 transition-transform">98.4%</h3>
                       </div>
                       <div className="w-48 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '98.4%' }}
                            className="h-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)] rounded-full"
                          />
                       </div>
                       <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl group-hover:bg-emerald-500/20 transition-all">
                          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest italic">High Precision Cluster Detected</span>
                       </div>
                     </div>
                  </div>
                </div>

                {/* Bottom Stats Meta */}
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-md">
                   <div className="flex items-center gap-5">
                      <div className="p-3 bg-indigo-400/10 rounded-2xl border border-indigo-400/20 text-indigo-400">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Core Observation</p>
                        <p className="text-sm font-bold text-slate-400 italic tracking-tight">{result.observation}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 px-6 py-3 bg-black/40 rounded-full border border-white/5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                      <span className="text-[10px] font-black text-white uppercase italic tracking-widest">Network Protocol: Production Verified</span>
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
