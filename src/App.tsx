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
import { MarketAnalyzer } from './components/MarketAnalyzer.tsx';
import { MarketInsights } from './components/MarketInsights.tsx';

/** Utility for Tailwind class merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'insights'>('analyzer');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'analyzer', label: 'Vision Analyzer', icon: SearchCode },
    { id: 'insights', label: 'Market Insights', icon: LayoutDashboard },
  ] as const;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full"></div>
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
              <span className="text-xl font-black text-white tracking-tighter leading-none">VISION</span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none mt-1 italic">Pro Technicals</span>
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
            <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 hidden md:block">
              Connect Exchange
            </button>
            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-400">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'analyzer' && <MarketAnalyzer />}
              {activeTab === 'insights' && <MarketInsights />}
            </motion.div>
          </AnimatePresence>
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
