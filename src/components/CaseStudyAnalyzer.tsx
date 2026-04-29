/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  Zap
} from 'lucide-react';
import { analyzeGraphImage } from '../services/aiService';
import { CaseStudyResult, PriceLevel } from '../types';

export function CaseStudyAnalyzer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CaseStudyResult | null>(null);

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
      setResult(analysis);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const LevelCard = ({ level, type }: { level: PriceLevel; type: 'support' | 'resistance' }) => (
    <div className={`p-4 rounded-2xl border ${
      type === 'support' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'
    } transition-all hover:shadow-md`}>
      <div className="flex justify-between items-center mb-2">
        <span className={`text-[10px] font-black uppercase tracking-widest ${
          type === 'support' ? 'text-emerald-700' : 'text-rose-700'
        }`}>
          {type} Target
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-slate-400">CI</span>
          <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${type === 'support' ? 'bg-emerald-500' : 'bg-rose-500'}`} 
              style={{ width: `${level.confidence * 100}%` }}
            />
          </div>
        </div>
      </div>
      <div className="text-2xl font-black text-slate-900 tracking-tighter mb-1">{level.price}</div>
      <p className="text-[10px] text-slate-500 font-medium leading-tight">{level.reason}</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Upload */}
        <div className="xl:col-span-5 bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm sticky top-24">
          <h3 className="text-xl font-black mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            Vision Terminal
          </h3>
          
          <div className="space-y-6">
            <div className="relative group">
              <div className={`w-full aspect-[4/3] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden ${
                selectedImage ? 'border-indigo-500 bg-white shadow-xl' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-indigo-300'
              }`}>
                {selectedImage ? (
                  <img src={selectedImage} alt="Chart Analysis" className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-indigo-400" />
                    </div>
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Drop Chart Image</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest px-4 py-1 bg-slate-100 rounded-full inline-block">NIFTY / Stocks / Indices</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {selectedImage && (
                <button 
                  onClick={() => { setSelectedImage(null); setResult(null); }}
                  className="absolute top-4 right-4 p-2 bg-slate-900/10 hover:bg-slate-900/20 backdrop-blur-md rounded-full text-slate-900 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button 
              onClick={runAnalysis}
              disabled={!selectedImage || isAnalyzing}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:shadow-none"
            >
              {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-white" />}
              {isAnalyzing ? 'Decoding Market Structure...' : 'Extract Exact Price Levels'}
            </button>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="xl:col-span-7 space-y-4">
          {!result && !isAnalyzing ? (
            <div className="bg-indigo-50/50 border border-indigo-100 p-12 rounded-[2.5rem] h-full min-h-[500px] flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-indigo-100 flex items-center justify-center mb-6">
                <FileSearch className="w-10 h-10 text-indigo-300" />
              </div>
              <h4 className="text-indigo-900 text-2xl font-black tracking-tight mb-3">AI Vision Technicals</h4>
              <p className="text-indigo-600/70 text-sm max-w-[320px] font-medium leading-relaxed">
                Upload any candlestick chart. Our AI will automatically detect support, resistance, trend, and provide numeric price extraction for your technical report.
              </p>
            </div>
          ) : isAnalyzing ? (
            <div className="bg-white border border-slate-200 p-12 rounded-[2.5rem] h-full min-h-[500px] flex flex-col items-center justify-center text-center animate-pulse">
               <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
               <h4 className="text-slate-900 text-lg font-black uppercase tracking-widest">Scanning Price Axis...</h4>
               <p className="text-slate-400 text-xs mt-2 font-bold">GEMINI 1.5 FLASH VISION PROCESSING</p>
            </div>
          ) : result && (
            <div className="space-y-4 animate-in slide-in-from-right duration-700">
              {/* Header Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                   <div className={`p-2 rounded-lg mb-2 ${
                     result.trend === 'Uptrend' ? 'bg-emerald-50 text-emerald-600' : 
                     result.trend === 'Downtrend' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                   }`}>
                     {result.trend === 'Uptrend' ? <TrendingUp className="w-5 h-5" /> : 
                      result.trend === 'Downtrend' ? <TrendingDown className="w-5 h-5" /> : <ArrowRightCircle className="w-5 h-5" />}
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Market Trend</p>
                   <p className="font-black text-slate-900">{result.trend}</p>
                </div>

                <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-100 flex flex-col items-center justify-center text-center text-white relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <Zap className="w-5 h-5 mb-2 text-indigo-200 fill-indigo-200" />
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Breakout Level</p>
                   <p className="font-black text-xl tracking-tighter">{result.breakoutLevel}</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                   <div className="p-2 bg-amber-50 text-amber-600 rounded-lg mb-2">
                     <AlertCircle className="w-5 h-5" />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Risk Rating</p>
                   <p className="font-black text-slate-900">Moderate</p>
                </div>
              </div>

              {/* Levels Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    Support Targets
                  </h5>
                  {result.supportLevels.map((lvl, i) => <LevelCard key={i} level={lvl} type="support" />)}
                </div>
                <div className="space-y-3">
                  <h5 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <TrendingDown className="w-3 h-3 text-rose-500 rotate-180" />
                    Resistance Targets
                  </h5>
                  {result.resistanceLevels.map((lvl, i) => <LevelCard key={i} level={lvl} type="resistance" />)}
                </div>
              </div>

              {/* Insight Hub */}
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative shadow-2xl">
                <div className="relative z-10 flex gap-6 items-start">
                   <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/30">
                     <Lightbulb className="w-8 h-8 text-indigo-400" />
                   </div>
                   <div className="space-y-2">
                     <h4 className="text-xl font-black tracking-tight">AI Trading Insight</h4>
                     <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
                       "{result.tradingInsight}"
                     </p>
                     <div className="pt-4 flex items-center gap-4">
                        <div className="flex -space-x-2">
                          {[1,2,3].map(i => <div key={i} className={`w-6 h-6 rounded-full border-2 border-slate-900 bg-indigo-${i}00`}></div>)}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model Consensus: Highly Relevant</span>
                     </div>
                   </div>
                </div>
                <div className="absolute -bottom-6 -right-6 text-white opacity-5 text-9xl font-black italic select-none">BULL</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-inner">
                 <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                   <BarChart3 className="w-3 h-3" />
                   Technical Summary
                 </h5>
                 <p className="text-xs text-slate-500 italic leading-relaxed">{result.observation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
