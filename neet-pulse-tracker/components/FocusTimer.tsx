import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

const NEET_DURATION_MINUTES = 200; // 3 hours 20 minutes

const FocusTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(NEET_DURATION_MINUTES * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'TEST' | 'STUDY'>('TEST');

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'TEST' ? NEET_DURATION_MINUTES * 60 : 50 * 60); // 50 min for study block
  };

  const switchMode = (newMode: 'TEST' | 'STUDY') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'TEST' ? NEET_DURATION_MINUTES * 60 : 50 * 60);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel rounded-xl p-4 border-l-4 border-l-cyan-500 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-2 opacity-20">
        <Timer size={40} />
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-sci-fi text-sm text-cyan-400 uppercase tracking-widest">NEURAL SYNC TIMER</h3>
        <div className="flex gap-2 text-[10px] font-mono-sci-fi">
          <button 
            onClick={() => switchMode('TEST')}
            className={`px-2 py-1 rounded ${mode === 'TEST' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-500'}`}
          >
            MOCK
          </button>
          <button 
            onClick={() => switchMode('STUDY')}
            className={`px-2 py-1 rounded ${mode === 'STUDY' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-500'}`}
          >
            FOCUS
          </button>
        </div>
      </div>

      <div className="text-center py-2">
        <div className="font-mono-sci-fi text-4xl md:text-5xl font-bold text-white tracking-widest tabular-nums neon-text">
          {formatTime(timeLeft)}
        </div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
          {isActive ? 'SYNC ACTIVE' : 'SYSTEM IDLE'}
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-2">
        <button 
          onClick={toggleTimer}
          className={`p-2 rounded-full border transition-all ${
            isActive 
              ? 'border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10' 
              : 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'
          }`}
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button 
          onClick={resetTimer}
          className="p-2 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};

export default FocusTimer;
