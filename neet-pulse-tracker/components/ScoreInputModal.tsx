import React, { useState } from 'react';
import { X, Save, Disc } from 'lucide-react';
import { SubjectScores, TestRecord } from '../types';
import { MAX_SCORE_BIOLOGY, MAX_SCORE_CHEMISTRY, MAX_SCORE_PHYSICS, MAX_SCORE_TOTAL } from '../constants';
import { calculateTotal } from '../services/storageService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: TestRecord) => void;
}

const ScoreInputModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [testName, setTestName] = useState('');
  const [scores, setScores] = useState<SubjectScores>({ physics: 0, chemistry: 0, biology: 0 });

  if (!isOpen) return null;

  const handleScoreChange = (subject: keyof SubjectScores, value: string) => {
    const numVal = parseInt(value) || 0;
    let max = 0;
    if (subject === 'physics') max = MAX_SCORE_PHYSICS;
    if (subject === 'chemistry') max = MAX_SCORE_CHEMISTRY;
    if (subject === 'biology') max = MAX_SCORE_BIOLOGY;

    setScores(prev => ({ ...prev, [subject]: Math.min(numVal, max) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = calculateTotal(scores);
    const newRecord: TestRecord = {
      id: crypto.randomUUID(),
      date,
      testName: testName || `MOCK-${date.replace(/-/g, '')}`,
      scores,
      total
    };
    onSave(newRecord);
    setTestName('');
    setScores({ physics: 0, chemistry: 0, biology: 0 });
    onClose();
  };

  const currentTotal = calculateTotal(scores);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-md overflow-hidden transform transition-all rounded-xl relative border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
        
        {/* Header */}
        <div className="bg-slate-900/80 p-4 flex justify-between items-center border-b border-cyan-500/20">
          <h2 className="text-lg font-sci-fi text-cyan-400 tracking-wider flex items-center gap-2">
            <Disc className="animate-spin-slow" size={20} />
            INPUT DATA RECORD
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-cyan-400 transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1">
            <label className="block text-[10px] font-mono-sci-fi text-cyan-600 uppercase tracking-widest">Timestamp</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 text-white p-2 rounded focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] outline-none font-mono-sci-fi transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono-sci-fi text-cyan-600 uppercase tracking-widest">Designation Identifier</label>
            <input 
              type="text" 
              placeholder="e.g. ALPHA TEST 01"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 text-white p-2 rounded focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] outline-none font-mono-sci-fi transition-all placeholder-slate-700"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-mono-sci-fi text-blue-500 uppercase tracking-widest">Physics</label>
              <div className="relative">
                <input 
                  type="number" 
                  min="0"
                  max={MAX_SCORE_PHYSICS}
                  value={scores.physics || ''}
                  onChange={(e) => handleScoreChange('physics', e.target.value)}
                  className="w-full bg-slate-900/50 border border-blue-900 text-blue-100 p-2 text-center font-mono-sci-fi font-bold rounded focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-mono-sci-fi text-purple-500 uppercase tracking-widest">Chem</label>
              <div className="relative">
                <input 
                  type="number" 
                  min="0"
                  max={MAX_SCORE_CHEMISTRY}
                  value={scores.chemistry || ''}
                  onChange={(e) => handleScoreChange('chemistry', e.target.value)}
                  className="w-full bg-slate-900/50 border border-purple-900 text-purple-100 p-2 text-center font-mono-sci-fi font-bold rounded focus:border-purple-500 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-mono-sci-fi text-emerald-500 uppercase tracking-widest">Biology</label>
              <div className="relative">
                <input 
                  type="number" 
                  min="0"
                  max={MAX_SCORE_BIOLOGY}
                  value={scores.biology || ''}
                  onChange={(e) => handleScoreChange('biology', e.target.value)}
                  className="w-full bg-slate-900/50 border border-emerald-900 text-emerald-100 p-2 text-center font-mono-sci-fi font-bold rounded focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
             <div className="text-sm font-mono-sci-fi text-slate-400">
                AGGREGATE: <span className={`font-bold text-xl ${currentTotal > 600 ? 'text-emerald-400 neon-text' : 'text-cyan-400'}`}>{currentTotal}</span> <span className="text-[10px]">/ {MAX_SCORE_TOTAL}</span>
             </div>
             <button 
               type="submit"
               className="bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500 text-cyan-400 px-6 py-2 rounded font-sci-fi text-sm uppercase tracking-wider flex items-center gap-2 transition hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
             >
               <Save size={16} />
               UPLOAD
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScoreInputModal;
