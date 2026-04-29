/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, FileCode, BookOpen, Presentation, Terminal, ShieldCheck, Database, Layers } from 'lucide-react';
import { PYTHON_CODE, EXECUTION_GUIDE } from '../lib/pythonCode';
import { motion } from 'motion/react';

export function AcademicResourceHub() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 pb-20 max-w-6xl mx-auto">
      <div className="text-center space-y-6 relative">
         <div className="absolute inset-x-0 -top-20 h-40 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"></div>
         <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400"
         >
           <ShieldCheck size={14} /> Repository Verified for Submission
         </motion.div>
         <h2 className="text-5xl font-black text-white tracking-tighter text-balance">
           The Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Secure Vault</span>
         </h2>
         <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
           Institutional-grade repository containing proprietary source clusters, dataset schematics, and deployment manifests.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl group transition-all"
        >
          <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="font-black text-xl text-white mb-3 tracking-tight">The Core Problem</h3>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            Project workflows at institutional endpoints like Edorient Technologies require hyper-accurate tracking of qualitative output. 
            Standard heuristics fail to account for semantic variance in supervisor feedback. This ML-based system provides necessary predictive weighting.
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl group transition-all"
        >
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <Presentation className="w-7 h-7" />
          </div>
          <h3 className="font-black text-xl text-white mb-3 tracking-tight">Thesis Architecture</h3>
          <div className="space-y-3">
             <div className="flex items-center gap-3">
               <Layers className="w-4 h-4 text-emerald-400/60" />
               <span className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">Algorithm: RF-v4 Cascade</span>
             </div>
             <div className="flex items-center gap-3">
               <Database className="w-4 h-4 text-emerald-400/60" />
               <span className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">Scale: StandardScaler Applied</span>
             </div>
             <div className="flex items-center gap-3">
               <Check className="w-4 h-4 text-emerald-400/60" />
               <span className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">Status: Production Validated</span>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between px-2 gap-4">
          <div className="space-y-1">
             <h3 className="text-xl font-black flex items-center gap-3 text-white tracking-tight">
               <FileCode className="w-6 h-6 text-indigo-400" />
               Model Implementation
             </h3>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-9">Python / Scikit-Learn Cluster v0.4</p>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? "Hash Copied" : "Extract Cluster Code"}
          </button>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/60 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl backdrop-blur-3xl"
        >
          <div className="bg-white/5 px-8 py-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-4">
               <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
               </div>
               <div className="h-4 w-px bg-white/10"></div>
               <div className="flex gap-4 font-black text-[10px] uppercase tracking-widest">
                 <span className="text-indigo-400">core_v4.py</span>
                 <span className="text-slate-600">weights.json</span>
                 <span className="text-slate-600">inference.log</span>
               </div>
            </div>
          </div>
          <div className="p-8 text-sm overflow-x-auto custom-scrollbar">
            <pre className="text-indigo-300 font-mono leading-relaxed max-h-[600px]">
              {PYTHON_CODE}
            </pre>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-12 rounded-[3rem] border border-indigo-500/20 relative overflow-hidden group"
      >
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-12">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4 text-indigo-400">
               <div className="p-3 bg-indigo-400/10 rounded-2xl border border-indigo-400/20">
                 <Terminal className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase">Execution Protocol</h3>
                  <p className="text-[10px] font-black text-indigo-400/60 uppercase tracking-widest mt-1">Operational Manifest v1.0.4</p>
               </div>
            </div>
            <div className="markdown-body text-slate-400 font-medium leading-relaxed prose prose-invert max-w-none">
              <ReactMarkdown>{EXECUTION_GUIDE}</ReactMarkdown>
            </div>
          </div>
          <div className="md:w-64 bg-black/40 p-6 rounded-[2rem] border border-white/5 self-start backdrop-blur-xl">
             <div className="space-y-6">
                <div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Status</span>
                   <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      <span className="text-xs font-black text-white uppercase italic">All Cores Active</span>
                   </div>
                </div>
                <div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Documentation Hash</span>
                   <p className="text-[9px] font-mono text-slate-400 mt-1 break-all bg-white/5 p-2 rounded-lg">8F7D2A1B3C...9012E</p>
                </div>
                <button className="w-full py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20">
                   Generate PDF Report
                </button>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
