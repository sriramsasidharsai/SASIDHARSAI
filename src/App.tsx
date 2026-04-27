/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  BookOpenText, 
  Settings,
  Github,
  Monitor,
  Menu,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AnalysisDashboard } from './components/AnalysisDashboard.tsx';
import { PredictionEngine } from './components/PredictionEngine.tsx';
import { AcademicResourceHub } from './components/AcademicResourceHub.tsx';

/** Utility for Tailwind class merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'predictor' | 'resources'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard },
    { id: 'predictor', label: 'ML Prediction Engine', icon: BrainCircuit },
    { id: 'resources', label: 'Project Resource Hub', icon: BookOpenText },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Monitor className="text-white w-6 h-6" />
              </div>
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                InternPulse AI
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-1 bg-slate-100 p-1 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                    activeTab === tab.id 
                      ? "bg-white text-indigo-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
               <div className="flex flex-col items-end mr-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Engineering Model</span>
                  <span className="text-xs font-medium text-slate-600">v1.2.0-Final</span>
               </div>
               <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                 <Settings className="w-5 h-5" />
               </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-100 text-slate-600"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white z-40 p-4 space-y-2 animate-in slide-in-from-top duration-300">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-4 rounded-xl text-md font-bold flex items-center gap-3",
                activeTab === tab.id ? "bg-indigo-50 text-indigo-600" : "text-slate-600"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                IT domain: Edorient Technolgies
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                Stable Release
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'dashboard' && "Performance Analytics"}
              {activeTab === 'predictor' && "AI Task Forecaster"}
              {activeTab === 'resources' && "Project Documentation"}
            </h1>
            <p className="text-slate-500 mt-2">
              {activeTab === 'dashboard' && "Real-time visualization of intern metrics and productivity benchmarks."}
              {activeTab === 'predictor' && "Predictive model simulation using ensemble learning heuristics."}
              {activeTab === 'resources' && "Source code, dataset schemas, and implementation guides for submission."}
            </p>
          </div>
          
          {activeTab !== 'resources' && (
            <div className="flex gap-2">
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:border-slate-300 transition-all">
                 <Github className="w-4 h-4" /> Export Assets
               </button>
            </div>
          )}
        </header>

        <section className="relative">
          {activeTab === 'dashboard' && <AnalysisDashboard />}
          {activeTab === 'predictor' && <PredictionEngine />}
          {activeTab === 'resources' && <AcademicResourceHub />}
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100 py-8 text-center text-slate-400 text-sm">
        <p>&copy; 2026 Internship Pulse AI - CS Internal Project Module</p>
        <p className="mt-1 font-medium text-slate-300">Developed for Professional Training Internship Report Submission</p>
      </footer>
    </div>
  );
}

