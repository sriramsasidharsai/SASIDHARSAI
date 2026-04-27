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
import { RefreshCcw, TrendingUp, Users, Calendar } from 'lucide-react';

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
    const interval = setInterval(fetchData, 5000); // Polling every 5 seconds for "real-time"
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="text-indigo-600 w-5 h-5" />
          Live Metrics Stream
        </h2>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <RefreshCcw className="w-3 h-3 animate-spin-slow" />
          Last Sync: {lastSync.toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Bento Stat Cards */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between h-40 group hover:border-indigo-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
            <RefreshCcw className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Tasks / Week</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{loading ? '...' : metrics.avgTasks}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between h-40 group hover:border-emerald-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Utilization Rate</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{loading ? '...' : metrics.utilization}</h3>
          </div>
        </div>

        <div className="md:col-span-2 bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-100 flex flex-col justify-between h-40 text-white relative overflow-hidden">
          <div className="relative z-10">
             <Calendar className="w-6 h-6 mb-2 opacity-80" />
             <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Target Goal: Milestone Alpha</p>
             <h3 className="text-2xl font-black tracking-tight mt-1">May 15, 2026</h3>
          </div>
          <div className="relative z-10 flex items-center gap-2">
            <div className="h-1.5 flex-grow bg-indigo-500 rounded-full overflow-hidden">
               <div className="h-full bg-white w-3/4 animate-pulse"></div>
            </div>
            <span className="text-[10px] font-bold">75%</span>
          </div>
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Productivity Index Card - Large Bento */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 min-h-[450px] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Productivity Forecaster</h3>
              <p className="text-sm text-slate-500">Real-time ML analysis of weekly output variance</p>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">Model: RF-v4</span>
          </div>
          
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="productivityScore" 
                  stroke="#4f46e5" 
                  strokeWidth={4} 
                  dot={{ fill: '#4f46e5', strokeWidth: 2, r: 5 }} 
                  activeDot={{ r: 8, strokeWidth: 0 }}
                  name="Productivity %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Small Data Card - Bento */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl h-full flex flex-col justify-between min-h-[450px]">
             <div>
               <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Workload Distribution</h4>
               <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={data}>
                     <defs>
                       <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <XAxis dataKey="week" hide={true} />
                     <Tooltip />
                     <Area 
                       type="monotone" 
                       dataKey="tasksCompleted" 
                       stroke="#818cf8" 
                       fillOpacity={1} 
                       fill="url(#colorTasks)" 
                       strokeWidth={3}
                       name="Tasks"
                     />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
             </div>
             <div className="pt-6 border-t border-slate-800">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-xs text-slate-400">System Integrity</span>
                 <span className="text-xs font-bold text-emerald-400">99.9%</span>
               </div>
               <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-full"></div>
               </div>
               <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
                 API services are polling live log data from simulated Edorient Technologies Jira middleware endpoints.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

