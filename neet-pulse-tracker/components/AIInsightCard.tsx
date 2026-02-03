import React, { useState } from 'react';
import { Bot, Loader2, ShieldAlert, Terminal, Gauge } from 'lucide-react';
import { TestRecord } from '../types';
import { getPerformanceAnalysis } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Props {
  history: TestRecord[];
}

const ProbabilityMeter: React.FC<{ value: number }> = ({ value }) => {
  // SVG configuration
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // We want a 240 degree arc (approx 66% of circle), starting from bottom left
  const arcLength = circumference * 0.75; 
  const strokeDashoffset = arcLength - (value / 100) * arcLength;
  
  // Color determination
  let color = '#ef4444'; // Red
  if (value > 40) color = '#eab308'; // Yellow
  if (value > 75) color = '#06b6d4'; // Cyan
  if (value > 90) color = '#10b981'; // Emerald

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
       <div className="relative w-40 h-40 flex items-center justify-center">
         {/* Background Arc */}
         <svg height={radius * 2.5} width={radius * 2.5} className="rotate-[135deg]">
           <circle
             stroke="#1e293b"
             strokeWidth={stroke}
             fill="transparent"
             r={normalizedRadius}
             cx={radius * 1.25}
             cy={radius * 1.25}
             style={{ strokeDasharray: `${arcLength} ${circumference}` }}
           />
           {/* Progress Arc */}
           <circle
             stroke={color}
             strokeWidth={stroke}
             fill="transparent"
             r={normalizedRadius}
             cx={radius * 1.25}
             cy={radius * 1.25}
             strokeLinecap="round"
             style={{ 
                strokeDasharray: `${arcLength} ${circumference}`,
                strokeDashoffset,
                transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease'
             }}
             className="drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
           />
         </svg>
         
         {/* Center Text */}
         <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-sci-fi font-bold text-white tabular-nums drop-shadow-md">
                {value}%
            </span>
            <span className="text-[10px] font-mono-sci-fi text-slate-400 tracking-wider">PROBABILITY</span>
         </div>
       </div>
       
       {/* Decorative ticks */}
       <div className="absolute inset-0 w-full h-full animate-spin-slow-reverse opacity-20 pointer-events-none">
          <div className="w-full h-full rounded-full border border-dashed border-cyan-500"></div>
       </div>
    </div>
  );
};

const AIInsightCard: React.FC<Props> = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<{ text: string; probability: number } | null>(null);

  const handleGenerateInsight = async () => {
    if (history.length === 0) return;
    setLoading(true);
    const result = await getPerformanceAnalysis(history);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="glass-panel rounded-xl p-1 mb-8 relative group overflow-hidden border border-red-900/30">
        {/* Holographic scanning line effect container */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 p-4 opacity-30 animate-pulse text-red-500">
            <ShieldAlert size={40} />
        </div>

      <div className="bg-black/40 rounded-lg p-5 relative z-10 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4 border-b border-red-900/30 pb-3">
          <div className="p-2 bg-red-900/20 border border-red-500/30 rounded">
            <Bot className="text-red-500" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-sci-fi text-red-500 tracking-widest uppercase">Combat Drill Instructor</h3>
            <p className="text-[10px] text-red-400/60 font-mono-sci-fi uppercase tracking-wider">AI-POWERED PERFORMANCE REVIEW</p>
          </div>
        </div>

        {!insight && !loading && (
          <div>
            <p className="text-slate-400 mb-6 max-w-xl font-mono-sci-fi text-sm leading-relaxed">
              {'>'} INITIATE PERFORMANCE REVIEW SEQUENCE.<br/>
              {'>'} CALCULATE ADMISSION PROBABILITY.<br/>
              {'>'} ANALYSIS OF WEAKNESSES IS MANDATORY.<br/>
              {'>'} PREPARE FOR BRUTAL HONESTY.
            </p>
            <button
              onClick={handleGenerateInsight}
              disabled={history.length === 0}
              className={`w-full sm:w-auto px-6 py-3 rounded border font-mono-sci-fi text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 relative overflow-hidden
                ${history.length === 0 
                  ? 'border-slate-800 text-slate-700 bg-slate-900 cursor-not-allowed' 
                  : 'border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'}`}
            >
              <Terminal size={16} />
              Execute Analysis
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="animate-spin text-red-500 mb-3" size={32} />
            <p className="text-red-400 font-mono-sci-fi animate-pulse text-xs uppercase tracking-widest">Processing Tactical Data...</p>
          </div>
        )}

        {insight && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
             {/* Text Analysis Column */}
             <div className="md:col-span-2 bg-red-950/20 border border-red-900/50 rounded p-5 relative order-2 md:order-1">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-red-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500"></div>
                
                <div className="prose prose-invert prose-sm max-w-none font-mono-sci-fi text-slate-300">
                    <ReactMarkdown components={{
                        strong: ({node, ...props}) => <span className="text-red-400 font-bold uppercase" {...props} />,
                        h1: ({node, ...props}) => <h1 className="text-red-500 font-sci-fi uppercase text-lg border-b border-red-900 pb-2 mb-4" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-red-400 font-sci-fi uppercase text-base mt-4 mb-2" {...props} />,
                        li: ({node, ...props}) => <li className="text-slate-300 mb-1" {...props} />
                    }}>{insight.text}</ReactMarkdown>
                </div>
                <button 
                  onClick={() => setInsight(null)}
                  className="mt-6 text-xs text-red-400/50 hover:text-red-400 font-mono-sci-fi uppercase tracking-widest border border-transparent hover:border-red-900 px-2 py-1"
                >
                  [ Acknowledge & Dismiss ]
                </button>
             </div>

             {/* Probability Meter Column */}
             <div className="md:col-span-1 flex flex-col items-center justify-start order-1 md:order-2">
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 w-full flex flex-col items-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-900/10 pointer-events-none"></div>
                    <h4 className="font-sci-fi text-xs text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Gauge size={14} /> Admission Probability
                    </h4>
                    <ProbabilityMeter value={insight.probability} />
                    <div className="text-center mt-2 px-2">
                        <p className="text-[10px] text-slate-400 font-mono-sci-fi">
                            ESTIMATED CHANCE OF SECURING GOVT MEDICAL SEAT BASED ON CURRENT TRAJECTORY.
                        </p>
                    </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsightCard;