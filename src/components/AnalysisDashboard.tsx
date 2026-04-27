/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { InternPerformance } from '../types';

const MOCK_DATA: InternPerformance[] = [
  { week: 'Week 1', tasksCompleted: 4, hoursWorked: 35, productivityScore: 72 },
  { week: 'Week 2', tasksCompleted: 6, hoursWorked: 40, productivityScore: 85 },
  { week: 'Week 3', tasksCompleted: 5, hoursWorked: 38, productivityScore: 78 },
  { week: 'Week 4', tasksCompleted: 8, hoursWorked: 45, productivityScore: 92 },
  { week: 'Week 5', tasksCompleted: 7, hoursWorked: 42, productivityScore: 88 },
];

export function AnalysisDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Metric Cards */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500">Avg. Tasks / Week</p>
          <h3 className="text-3xl font-bold text-slate-900">6.0</h3>
          <div className="mt-2 text-xs text-emerald-600 font-medium">↑ 12% from target</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500">Utilization Rate</p>
          <h3 className="text-3xl font-bold text-slate-900">84.5%</h3>
          <div className="mt-2 text-xs text-emerald-600 font-medium">↑ Optimal Range</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500">Projected Milestone</p>
          <h3 className="text-3xl font-bold text-slate-900">May 15</h3>
          <div className="mt-2 text-xs text-blue-600 font-medium">On Track</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Productivity Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
          <h3 className="text-lg font-semibold mb-6">Productivity Index (ML Tracking)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="productivityScore" 
                stroke="#6366f1" 
                strokeWidth={3} 
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="Productivity %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Workload Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
          <h3 className="text-lg font-semibold mb-6">Workload Allocation (Dataset Analysis)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_DATA}>
              <defs>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="tasksCompleted" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorTasks)" 
                strokeWidth={2}
                name="Completed Tasks"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
