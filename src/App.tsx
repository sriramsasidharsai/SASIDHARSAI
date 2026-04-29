/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  BookOpenText, 
  BrainCircuit, 
  Github, 
  Monitor, 
  Menu, 
  X, 
  SearchCode,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  Globe,
  Settings,
  Bell,
  User,
  LogOut,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';
import { AnalysisDashboard } from './components/AnalysisDashboard.tsx';
import { PredictionEngine } from './components/PredictionEngine.tsx';
import { AcademicResourceHub } from './components/AcademicResourceHub.tsx';
import { CaseStudyAnalyzer } from './components/CaseStudyAnalyzer.tsx';

/** Utility for Tailwind class merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'predictor' | 'case-study' | 'resources'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Terminal', icon: LayoutDashboard },
    { id: 'predictor', label: 'ML Engine', icon: BrainCircuit },
    { id: 'case-study', label: 'Vision AI', icon: SearchCode },
    { id: 'resources', label: 'Vault', icon: BookOpenText },
  ] as const;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-rose-600/5 blur-[100px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150"></div>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b",
        scrolled ? "bg-black/60 backdrop-blur-xl border-white/5 py-4" : "bg-transparent border-transparent py-6"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tighter leading-none">QUANTUM</span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none mt-1 italic">Intelligence</span>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex items-center bg-white/5 border border-white/5 p-1 rounded-2xl backdrop-blur-md">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all duration-300 text-sm font-bold uppercase tracking-widest",
                  activeTab === tab.id 
                    ? "bg-white/10 text-white shadow-lg border border-white/10" 
                    : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-indigo-400" : "text-current")} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-colors relative">
               <Bell className="w-5 h-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-black"></span>
            </button>
            <div className="h-6 w-px bg-white/10 mx-1"></div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-500/50 transition-colors">
               <User className="w-6 h-6 text-slate-400" />
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-400">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <main className="relative pt-32 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                v4.0 Protocol Active
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] text-balance">
                Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-indigo-500 drop-shadow-sm">Quantitative</span> Analysis
              </h1>
              <p className="text-lg text-slate-400 max-w-xl font-medium leading-relaxed">
                Unlock professional-grade market insights using neural network forecasting and AI vision OCR price extraction. 
                Designed for institutional velocity.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={() => setActiveTab('case-study')}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all flex items-center gap-3"
                >
                  Analyze Chart <ChevronRight size={18} />
                </button>
                <div className="flex items-center gap-6 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                   <div className="flex flex-col">
                      <span className="text-xl font-black text-white leading-none">98.4%</span>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Accuracy</span>
                   </div>
                   <div className="w-px h-8 bg-white/10"></div>
                   <div className="flex flex-col">
                      <span className="text-xl font-black text-white leading-none">{'<'}2s</span>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Latency</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="flex-1 hidden md:block">
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full group-hover:bg-indigo-500/30 transition-colors"></div>
                <div className="relative bg-black/40 border border-white/10 p-4 rounded-[2.5rem] backdrop-blur-2xl shadow-3xl overflow-hidden">
                   <div className="aspect-[4/3] bg-slate-900/50 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,rgba(99,102,241,0.1),transparent_50%)]"></div>
                      <TrendingUp className="w-20 h-20 text-indigo-500/40 mb-4" />
                      <div className="space-y-2">
                        <div className="h-2 w-32 bg-white/10 rounded-full mx-auto"></div>
                        <div className="h-2 w-24 bg-white/5 rounded-full mx-auto"></div>
                      </div>
                      <div className="mt-8 p-3 bg-white/5 border border-white/5 rounded-xl flex items-center gap-3 backdrop-blur-md">
                         <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                           <ShieldCheck size={16} />
                         </div>
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Secure Terminal Enforced</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

          {/* Tab Content */}
          <section className="min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'dashboard' && <AnalysisDashboard />}
                {activeTab === 'predictor' && <PredictionEngine />}
                {activeTab === 'case-study' && <CaseStudyAnalyzer />}
                {activeTab === 'resources' && <AcademicResourceHub />}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 py-12 border-t border-white/5 bg-black/40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center border border-indigo-500/30">
               <Cpu className="w-4 h-4 text-indigo-400" />
             </div>
             <span className="font-black text-white tracking-widest text-xs uppercase">Quantum.AI Neural Engine</span>
          </div>
          <div className="flex items-center gap-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-400 transition-colors">Architecture</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Legal</a>
          </div>
          <div className="flex items-center gap-4">
             <a href="https://github.com" className="p-2 bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
               <Github size={18} />
             </a>
             <button className="px-5 py-2 bg-white text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all">
               System Status
             </button>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center p-8"
          >
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-8 text-white p-2">
              <X size={32} />
            </button>
            <div className="space-y-6 text-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "block w-full text-4xl font-black tracking-tighter uppercase",
                    activeTab === tab.id ? "text-indigo-400" : "text-white/40 hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
