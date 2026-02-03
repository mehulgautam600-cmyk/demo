import React, { useEffect, useState } from 'react';
import { Plus, LayoutDashboard, History as HistoryIcon, Zap, Crosshair } from 'lucide-react';
import { TestRecord } from './types';
import { getStoredTests, saveTest, deleteTest, getProgressStatus, getTargetScore, saveTargetScore } from './services/storageService';
import ScoreInputModal from './components/ScoreInputModal';
import DashboardCharts from './components/DashboardCharts';
import HistoryList from './components/HistoryList';
import AIInsightCard from './components/AIInsightCard';
import FocusTimer from './components/FocusTimer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
  const [data, setData] = useState<TestRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetScore, setTargetScore] = useState(650);
  const [editingTarget, setEditingTarget] = useState(false);

  useEffect(() => {
    setData(getStoredTests());
    setTargetScore(getTargetScore());
  }, []);

  const handleSaveTest = (record: TestRecord) => {
    const updatedData = saveTest(record);
    setData(updatedData);
  };

  const handleDeleteTest = (id: string) => {
    if (confirm('CONFIRM PURGE: Delete this data record permanently?')) {
      const updatedData = deleteTest(id);
      setData(updatedData);
    }
  };

  const updateTargetScore = () => {
    saveTargetScore(targetScore);
    setEditingTarget(false);
  };

  // Derived state for stats
  const latestTest = data.length > 0 ? data[0] : null;
  const previousTest = data.length > 1 ? data[1] : null;
  const averageScore = data.length > 0 
    ? Math.round(data.reduce((acc, curr) => acc + curr.total, 0) / data.length) 
    : 0;
  
  const status = latestTest && previousTest 
    ? getProgressStatus(latestTest.total, previousTest.total)
    : { label: 'NO DATA', color: 'text-slate-500', icon: 'equal' };

  // Calculate distance to target
  const distanceToTarget = latestTest ? targetScore - latestTest.total : 0;
  const progressPercent = latestTest ? Math.min(100, Math.max(0, (latestTest.total / 720) * 100)) : 0;

  return (
    <div className="min-h-screen pb-24 md:pb-10 font-sans selection:bg-cyan-500/30">
      
      {/* Sci-Fi Navbar */}
      <nav className="glass-panel sticky top-0 z-40 border-b border-cyan-500/20 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
             <div className="flex items-center gap-3">
               <div className="relative">
                 <div className="absolute inset-0 bg-cyan-500 blur-sm opacity-50"></div>
                 <Zap className="text-cyan-400 relative z-10" size={24} />
               </div>
               <h1 className="text-2xl font-sci-fi font-bold text-white tracking-widest">
                 NEET<span className="text-cyan-400">PULSE</span>
               </h1>
             </div>
             
             {/* Desktop Tabs */}
             <div className="hidden md:flex space-x-2 bg-slate-900/50 p-1 rounded border border-slate-700">
               <button 
                 onClick={() => setActiveTab('dashboard')}
                 className={`px-4 py-1.5 rounded text-xs font-sci-fi tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-slate-400 hover:text-white'}`}
               >
                 DASHBOARD
               </button>
               <button 
                 onClick={() => setActiveTab('history')}
                 className={`px-4 py-1.5 rounded text-xs font-sci-fi tracking-widest transition-all ${activeTab === 'history' ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-slate-400 hover:text-white'}`}
               >
                 LOGS
               </button>
             </div>

             <button 
               onClick={() => setIsModalOpen(true)}
               className="bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded text-xs font-sci-fi tracking-widest flex items-center gap-2 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition active:scale-95"
             >
               <Plus size={16} />
               <span className="hidden sm:inline">INPUT DATA</span>
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Stats Panel */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
               {/* Stat Card 1 */}
               <div className="glass-panel p-4 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition">
                      <Crosshair size={40} />
                  </div>
                  <p className="text-[10px] font-mono-sci-fi text-slate-400 uppercase tracking-widest mb-1">Current Output</p>
                  <p className="text-3xl font-mono-sci-fi font-bold text-white neon-text">{latestTest ? latestTest.total : '---'}</p>
                  <p className="text-[10px] text-slate-500 mt-1">MAX CAPACITY: 720</p>
               </div>
               
               {/* Stat Card 2 */}
               <div className="glass-panel p-4 rounded-xl">
                  <p className="text-[10px] font-mono-sci-fi text-slate-400 uppercase tracking-widest mb-1">Mean Performance</p>
                  <p className="text-3xl font-mono-sci-fi font-bold text-blue-400">{averageScore}</p>
                  <p className="text-[10px] text-slate-500 mt-1">ACROSS {data.length} CYCLES</p>
               </div>

               {/* Stat Card 3 */}
               <div className="glass-panel p-4 rounded-xl">
                  <p className="text-[10px] font-mono-sci-fi text-slate-400 uppercase tracking-widest mb-1">Trend Vector</p>
                  <div className={`text-xl font-mono-sci-fi font-bold mt-1 ${status.color} flex items-center gap-1`}>
                     {status.label}
                  </div>
               </div>

               {/* Target Setting Card */}
               <div className="glass-panel p-4 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500/30 transition cursor-pointer" onClick={() => setEditingTarget(true)}>
                  <p className="text-[10px] font-mono-sci-fi text-slate-400 uppercase tracking-widest mb-1">Mission Target</p>
                  {editingTarget ? (
                    <div className="flex items-center gap-1">
                        <input 
                            autoFocus
                            type="number" 
                            className="w-16 bg-black text-white border border-cyan-500 rounded px-1 text-lg font-mono-sci-fi"
                            value={targetScore}
                            onChange={(e) => setTargetScore(parseInt(e.target.value))}
                            onBlur={updateTargetScore}
                            onKeyDown={(e) => e.key === 'Enter' && updateTargetScore()}
                        />
                    </div>
                  ) : (
                    <div className="flex items-end gap-2">
                        <p className="text-3xl font-mono-sci-fi font-bold text-purple-400">{targetScore}</p>
                        <p className="text-[10px] text-slate-500 mb-1">REQ</p>
                    </div>
                  )}
                  {latestTest && (
                     <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${Math.min(100, (latestTest.total / targetScore) * 100)}%` }}></div>
                     </div>
                  )}
               </div>
            </div>

            {/* Timer Widget */}
            <div className="lg:col-span-1">
                <FocusTimer />
            </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <AIInsightCard history={data} />
            <DashboardCharts data={data} />
            
            {/* Recent Mini History for Dashboard */}
            <div className="md:hidden">
              <h3 className="font-sci-fi text-cyan-400 text-sm tracking-widest mb-2">RECENT CYCLES</h3>
              <HistoryList data={data.slice(0, 3)} onDelete={handleDeleteTest} />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
           <div className="animate-fade-in">
             <HistoryList data={data} onDelete={handleDeleteTest} />
           </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 glass-panel rounded-full flex justify-around p-3 z-50 border border-slate-700/50 shadow-2xl">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`flex flex-col items-center gap-1 text-[10px] font-sci-fi tracking-wider ${activeTab === 'dashboard' ? 'text-cyan-400' : 'text-slate-500'}`}
        >
          <LayoutDashboard size={20} />
          COMMS
        </button>
        <div className="w-px bg-slate-700 h-8 self-center"></div>
        <button 
          onClick={() => setActiveTab('history')} 
          className={`flex flex-col items-center gap-1 text-[10px] font-sci-fi tracking-wider ${activeTab === 'history' ? 'text-cyan-400' : 'text-slate-500'}`}
        >
          <HistoryIcon size={20} />
          LOGS
        </button>
      </div>

      <ScoreInputModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTest} 
      />
    </div>
  );
};

export default App;
