/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { InternPerformance } from '../types';
import { RefreshCcw, TrendingUp, Users, Calendar, BarChart3, Activity, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export function AnalysisDashboard() {
  const [data, setData] = useState<InternPerformance[]>([]);
  const [metrics, setMetrics] = useState({ avgTasks: '0.0', utilization: '0.0%' });
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());

  const fetchData = async () => {
    try {
      const response = await fetch('/api/interns/metrics');
      const result = await response.json();
      setData(result.history);
      setMetrics({ avgTasks: result.avgTasks, utilization: result.utilization + '%' });
      setLastSync(new Date());
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black flex items-center gap-3 text-white tracking-tight">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <Activity className="text-indigo-400 w-6 h-6" />
            </div>
            Live Performance Matrix
          </h2>
          <p className="text-slate-500 text-xs font-medium ml-12">Real-time quantitative tracking of neural output clusters</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
          <Clock className="w-4 h-4 text-indigo-400" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Last Core Sync</span>
            <span className="text-xs font-bold text-white mt-1">{lastSync.toLocaleTimeString()}</span>
          </div>
          <RefreshCcw className="w-4 h-4 text-indigo-500/50 animate-spin" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 flex flex-col justify-between h-44 group hover:border-indigo-500/30 transition-all shadow-2xl relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all relative z-10">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Weekly Tasks</p>
            <h3 className="text-4xl font-black text-white tracking-tighter mt-1">{loading ? '...' : metrics.avgTasks}</h3>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-500/5 blur-3xl rounded-full"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 flex flex-col justify-between h-44 group hover:border-emerald-500/30 transition-all shadow-2xl relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all relative z-10">
            <Users className="w-6 h-6" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Efficiency Index</p>
            <h3 className="text-4xl font-black text-white tracking-tighter mt-1">{loading ? '...' : metrics.utilization}</h3>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2rem] shadow-2xl shadow-indigo-500/20 flex flex-col justify-between h-44 text-white relative overflow-hidden group"
        >
          <div className="relative z-10">
             <Calendar className="w-8 h-8 mb-4 text-indigo-200" />
             <div className="flex justify-between items-end">
               <div>
                  <p className="text-[10px] font-black text-indigo-200/80 uppercase tracking-[0.2em]">Target Deadline</p>
                  <h3 className="text-3xl font-black tracking-tighter mt-1">May 15, 2026</h3>
               </div>
               <div className="text-right">
                  <span className="text-3xl font-black tracking-tighter">75%</span>
                  <p className="text-[10px] font-black text-indigo-200/80 uppercase tracking-widest">Complete</p>
               </div>
             </div>
          </div>
          <div className="relative z-10 h-2 w-full bg-black/20 rounded-full overflow-hidden mt-4">
             <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
             />
          </div>
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 blur-3xl rounded-full group-hover:scale-110 transition-transform duration-1000"></div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Productivity Index Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-8 bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 min-h-[500px] flex flex-col shadow-2xl overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.05),transparent_60%)]"></div>
          <div className="flex justify-between items-center mb-10 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">Cognitive Output Flow</h3>
              <p className="text-sm text-slate-500 font-medium">Algorithmic analysis of weekly production cycles</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
               <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Engine: RF-v4-Alpha</span>
            </div>
          </div>
          
          <div className="flex-grow z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis dataKey="week" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} dy={10} fontStyle="italic" />
                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} dx={-10} fontStyle="italic" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a',
                    borderRadius: '20px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    padding: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                  itemStyle={{ color: '#fff', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase' }}
                  labelStyle={{ color: '#6366f1', marginBottom: '8px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.1em' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="productivityScore" 
                  stroke="#6366f1" 
                  strokeWidth={5} 
                  fillOpacity={1} 
                  fill="url(#colorProd)"
                  name="Efficiency"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Workload Distribution */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 space-y-4"
        >
          <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl h-full flex flex-col justify-between min-h-[500px]">
             <div>
               <div className="flex items-center justify-between mb-8">
                  <h4 className="text-white text-lg font-black tracking-tight">Task Volume</h4>
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                     <TrendingUp className="w-4 h-4" />
                  </div>
               </div>
               <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={data}>
                     <XAxis dataKey="week" hide={true} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                     />
                     <Bar 
                       dataKey="tasksCompleted" 
                       fill="#818cf8" 
                       radius={[10, 10, 10, 10]}
                       barSize={12}
                       name="Volume"
                     />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             </div>
             
             <div className="space-y-6 pt-8 border-t border-white/5">
               <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Integrity</span>
                    <span className="text-sm font-black text-white mt-1 uppercase italic tracking-tighter">Verified Stream</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-400 tracking-tighter leading-none">99.9%</span>
                  </div>
               </div>
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '99.9%' }}
                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  />
               </div>
               <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic opacity-60">
                 System services are aggregating real-time intern pulse data from institutional Edorient endpoints. Neural weighting applied.
               </p>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
