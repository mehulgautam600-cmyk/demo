import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { TestRecord } from '../types';
import { MAX_SCORE_PHYSICS, MAX_SCORE_CHEMISTRY, MAX_SCORE_BIOLOGY } from '../constants';

interface Props {
  data: TestRecord[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 border border-cyan-500/30 p-3 shadow-[0_0_15px_rgba(6,182,212,0.15)] rounded text-xs font-mono-sci-fi backdrop-blur-md">
        <p className="text-cyan-400 mb-2 border-b border-cyan-900 pb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="flex justify-between gap-4">
            <span>{entry.name}:</span>
            <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardCharts: React.FC<Props> = ({ data }) => {
  const chartData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(d => ({
    name: d.date.substring(5), // shorten date
    fullDate: d.date,
    Physics: d.scores.physics,
    Chemistry: d.scores.chemistry,
    Biology: d.scores.biology,
    Total: d.total,
  }));

  const latestTest = data.length > 0 ? data[0] : null;

  // Normalize scores for Radar chart (Percentage based)
  const radarData = latestTest ? [
    { subject: 'Physics', A: (latestTest.scores.physics / MAX_SCORE_PHYSICS) * 100, fullMark: 100 },
    { subject: 'Chemistry', A: (latestTest.scores.chemistry / MAX_SCORE_CHEMISTRY) * 100, fullMark: 100 },
    { subject: 'Biology', A: (latestTest.scores.biology / MAX_SCORE_BIOLOGY) * 100, fullMark: 100 },
  ] : [];

  if (data.length === 0) {
    return (
      <div className="glass-panel h-64 flex items-center justify-center rounded-xl border-dashed border-slate-700">
        <p className="font-mono-sci-fi text-slate-500 tracking-widest">DATA STREAM OFFLINE</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Total Score Trend */}
      <div className="glass-panel p-4 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
        <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>

        <h3 className="font-sci-fi text-sm text-cyan-300 mb-4 tracking-wider flex items-center gap-2">
          <span className="w-1 h-4 bg-cyan-500 inline-block"></span>
          TOTAL OUTPUT TRAJECTORY
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 720]} tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="Total" 
                stroke="#06b6d4" 
                fillOpacity={1} 
                fill="url(#colorTotal)" 
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject-wise Breakdown Trend */}
      <div className="glass-panel p-4 rounded-xl relative">
        <h3 className="font-sci-fi text-sm text-cyan-300 mb-4 tracking-wider flex items-center gap-2">
           <span className="w-1 h-4 bg-purple-500 inline-block"></span>
           SUB-SYSTEM PERFORMANCE
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 360]} tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'Share Tech Mono' }} />
              <Line type="monotone" dataKey="Physics" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{r: 4}} />
              <Line type="monotone" dataKey="Chemistry" stroke="#8b5cf6" strokeWidth={2} dot={false} activeDot={{r: 4}} />
              <Line type="monotone" dataKey="Biology" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{r: 4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weakness Radar */}
      {latestTest && (
        <div className="lg:col-span-2 glass-panel p-4 rounded-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
           <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
           
           <div className="w-full md:w-1/3 z-10">
             <h3 className="font-sci-fi text-sm text-cyan-300 mb-2 tracking-wider">
               TRIANGULATION ANALYSIS
             </h3>
             <p className="font-mono-sci-fi text-slate-400 text-xs mb-4">
               Latest Test: {latestTest.testName}
             </p>
             <div className="space-y-3 font-mono-sci-fi text-sm">
                <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                   <span className="text-blue-400">PHYSICS</span>
                   <span className="text-white">{(radarData[0].A).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                   <span className="text-purple-400">CHEMISTRY</span>
                   <span className="text-white">{(radarData[1].A).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                   <span className="text-emerald-400">BIOLOGY</span>
                   <span className="text-white">{(radarData[2].A).toFixed(1)}%</span>
                </div>
             </div>
             <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded text-xs text-red-300 font-mono-sci-fi">
                DETECTED WEAKEST LINK: <span className="font-bold text-red-100">{
                  radarData.reduce((prev, curr) => prev.A < curr.A ? prev : curr).subject.toUpperCase()
                }</span>
             </div>
           </div>

           <div className="h-64 w-full md:w-2/3 z-10">
             <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                 <PolarGrid gridType="polygon" stroke="#334155" />
                 <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Share Tech Mono' }} />
                 <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                 <Radar
                   name="Performance"
                   dataKey="A"
                   stroke="#06b6d4"
                   strokeWidth={2}
                   fill="#06b6d4"
                   fillOpacity={0.3}
                 />
                 <Tooltip content={<CustomTooltip />} />
               </RadarChart>
             </ResponsiveContainer>
           </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCharts;
