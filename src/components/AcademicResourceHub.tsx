/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, FileCode, BookOpen, Presentation, Terminal } from 'lucide-react';
import { PYTHON_CODE, EXECUTION_GUIDE } from '../lib/pythonCode';

export function AcademicResourceHub() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Academic Resource Center</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          This portal provides the full source code and documentation required for your final year project submission and viva presentation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors cursor-default">
          <BookOpen className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="font-bold text-lg mb-2">Problem Statement</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Internships in IT companies like Edorient Technologies often lack automated tracking for subjective performance metrics. Traditional spreadsheets fail to predict task delays or analyze sentiment in supervisor feedback. This ML-based system bridges that gap.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-200 transition-colors cursor-default">
          <Presentation className="w-8 h-8 text-emerald-600 mb-4" />
          <h3 className="font-bold text-lg mb-2">Viva Focus Points</h3>
          <ul className="text-sm text-slate-500 space-y-2 list-disc pl-4">
            <li>Algorithm: Random Forest Classifier for robust result variance.</li>
            <li>Dataset: Synthetic augmentation based on real-world IT story points.</li>
            <li>Normalization: Using StandardScaler to balance hours vs. feedback.</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-600" />
            Python implementation (Scikit-Learn)
          </h3>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Full Code"}
          </button>
        </div>
        
        <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <div className="bg-slate-800/50 px-6 py-3 flex items-center justify-between">
            <div className="flex gap-1.5 font-mono text-[10px]">
              <div className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">main.py</div>
              <div className="px-2 py-0.5 text-slate-500">model_eval.log</div>
            </div>
          </div>
          <pre className="p-6 text-sm overflow-x-auto text-indigo-300 font-mono leading-relaxed max-h-[500px]">
            {PYTHON_CODE}
          </pre>
        </div>
      </div>

      <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-900">
            <Terminal className="w-5 h-5" />
            Execution Guide
          </h3>
          <div className="prose prose-indigo max-w-none text-indigo-800/80 text-sm">
            <ReactMarkdown>{EXECUTION_GUIDE}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
