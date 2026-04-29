import React from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  Layers
} from 'lucide-react';

const InsightCard = ({ title, value, change, isPositive }: { title: string, value: string, change: string, isPositive: boolean }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group shadow-xl"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">{title}</p>
    <div className="text-3xl font-black text-white tracking-tighter mb-2">{value}</div>
    <div className={`flex items-center gap-1.5 text-[11px] font-black ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
      {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      {change}
      <span className="text-slate-600 ml-1 underline decoration-white/10">24H Delta</span>
    </div>
  </motion.div>
);

export const MarketInsights = () => {
  const globalMarkets = [
    { name: 'NIFTY 50', price: '24,120.45', change: '+1.24%', trend: 'up' },
    { name: 'BANK NIFTY', price: '52,840.10', change: '-0.45%', trend: 'down' },
    { name: 'S&P 500', price: '5,142.30', change: '+0.82%', trend: 'up' },
    { name: 'BTC/USD', price: '64,120.00', change: '+3.15%', trend: 'up' },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {globalMarkets.map((market, idx) => (
          <InsightCard 
            key={idx}
            title={market.name}
            value={market.price}
            change={market.change}
            isPositive={market.trend === 'up'}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Live Momentum Scanner */}
        <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-indigo-500 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity size={200} />
          </div>
          
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-white tracking-tighter italic">Live Momentum Matrix</h3>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Real-time signal aggregation active</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-300 uppercase tracking-widest hover:bg-white/10 transition-all">Intraday</button>
              <button className="px-5 py-2 bg-indigo-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-600/20">Scalper</button>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { asset: 'RELIANCE', signal: 'Strong Buy', rsi: '64.2', vol: '+24%', color: 'text-emerald-400' },
              { asset: 'HDFC BANK', signal: 'Neutral', rsi: '52.1', vol: '-5%', color: 'text-amber-400' },
              { asset: 'TCS', signal: 'Sell', rsi: '38.4', vol: '+12%', color: 'text-rose-400' },
              { asset: 'INFY', signal: 'Buy', rsi: '58.9', vol: '+8%', color: 'text-emerald-400' },
            ].map((row, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-indigo-500/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-indigo-500/40 transition-colors">
                    <BarChart2 className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-white tracking-tight">{row.asset}</div>
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-0.5">NSE Cluster #00{i+1}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-12">
                   <div className="text-center hidden md:block">
                      <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Momentum</div>
                      <div className={`text-sm font-black uppercase tracking-widest ${row.color}`}>{row.signal}</div>
                   </div>
                   <div className="text-center hidden md:block">
                      <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">RSI (14)</div>
                      <div className="text-sm font-black text-white italic">{row.rsi}</div>
                   </div>
                   <div className="text-right">
                      <div className={`text-lg font-black italic ${row.vol.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{row.vol}</div>
                      <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-0.5 whitespace-nowrap">Volume Delta</div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Global Sentiment Meter */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent"></div>
             <div className="relative z-10 text-center space-y-8">
                <div className="w-20 h-20 bg-indigo-500 rounded-[1.8rem] flex items-center justify-center mx-auto shadow-3xl shadow-indigo-500/30">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">Sentiment Matrix</h4>
                  <h3 className="text-4xl font-black text-white tracking-widest italic">BULLISH</h3>
                </div>
                
                <div className="flex items-center justify-center gap-1.5 w-full">
                  {[...Array(10)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-10 w-2 rounded-full ${i < 7 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-white/5'}`}
                    />
                  ))}
                </div>
                
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                  Institutional accumulation phase detected across major indices. High liquidity inflows in tech sectors.
                </p>
             </div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden group">
             <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-slate-200 uppercase tracking-widest">Alpha Alerts</h4>
             </div>
             
             <div className="space-y-4">
                {[
                  { text: 'Unusual Volume in BANKNIFTY 53000 CE', time: '2m ago' },
                  { text: 'Gap Up opening predicted for NIFTY tomorrow', time: '15m ago' },
                ].map((alert, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-white/10 transition-all">
                    <div className="w-1 h-full bg-indigo-500 rounded-full mt-1 shrink-0"></div>
                    <div>
                      <p className="text-xs font-bold text-slate-300 leading-snug">{alert.text}</p>
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-2 block">{alert.time}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
