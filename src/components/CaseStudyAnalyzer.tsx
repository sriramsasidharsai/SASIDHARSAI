/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Upload, FileSearch, TrendingDown, TrendingUp, ShieldAlert, Loader2 } from 'lucide-react';
import { analyzeGraphImage } from '../services/aiService';
import { CaseStudyResult } from '../types';

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

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            Upload Performance Graph
          </h3>
          
          <div className="space-y-6">
            <div className="relative group">
              <div className={`w-full aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                selectedImage ? 'border-indigo-500 bg-white' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}>
                {selectedImage ? (
                  <img src={selectedImage} alt="Graph Preview" className="w-full h-full object-contain p-4 rounded-3xl" />
                ) : (
                  <div className="text-center p-8">
                    <FileSearch className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">Drop internship graph or click to upload</p>
                    <p className="text-[10px] text-slate-400 mt-2">Support JPG, PNG (Max 5MB)</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <button 
              onClick={runAnalysis}
              disabled={!selectedImage || isAnalyzing}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
              {isAnalyzing ? 'Analyzing Technicals...' : 'Scan for Support & Resistance'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {result ? (
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-right duration-500">
              <div className="bg-emerald-500 p-6 rounded-[2rem] text-white flex flex-col justify-between h-40 shadow-lg shadow-emerald-100">
                <ShieldAlert className="w-6 h-6 mb-2 opacity-80" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Support Level</p>
                  <h4 className="text-3xl font-black">{result.supportLevel}</h4>
                </div>
              </div>
              <div className="bg-rose-500 p-6 rounded-[2rem] text-white flex flex-col justify-between h-40 shadow-lg shadow-rose-100">
                <TrendingDown className="w-6 h-6 mb-2 opacity-80 rotate-180" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Resistance Level</p>
                  <h4 className="text-3xl font-black">{result.resistanceLevel}</h4>
                </div>
              </div>
              <div className="col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                   <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Case Study Conclusion</h4>
                   <span className="text-[10px] font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md">TREND: {result.trend.toUpperCase()}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "{result.observation}"
                </p>
                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-[11px] text-slate-400">
                  Note: This technical analysis uses Gemini AI Vision to identify productivity plateaus and minimum operational thresholds for the internship log.
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[2rem] h-full min-h-[400px] flex flex-col items-center justify-center text-center opacity-60">
              <TrendingUp className="w-12 h-12 text-indigo-300 mb-4" />
              <h4 className="text-indigo-900 font-black tracking-tight mb-2">Technical Analysis Engine</h4>
              <p className="text-indigo-600 text-sm max-w-[280px]">Upload any performance graph to automatically detect support and resistance levels for your case study report.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
