import React from 'react';
import { TestRecord } from '../types';
import { Trash2, TrendingUp, TrendingDown, Minus, Cpu } from 'lucide-react';
import { getProgressStatus } from '../services/storageService';

interface Props {
  data: TestRecord[];
  onDelete: (id: string) => void;
}

const HistoryList: React.FC<Props> = ({ data, onDelete }) => {
  if (data.length === 0) {
    return (
      <div className="glass-panel text-center py-10 rounded-xl border-dashed border-slate-700">
        <Cpu className="mx-auto text-slate-700 mb-3" size={48} />
        <p className="text-slate-500 font-mono-sci-fi">ARCHIVES EMPTY. INITIALIZE FIRST TEST SEQUENCE.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <h3 className="font-sci-fi text-cyan-400 tracking-wider text-sm">ARCHIVED LOGS</h3>
        <span className="text-xs font-mono-sci-fi text-slate-500">{data.length} RECORDS FOUND</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] text-slate-400 font-mono-sci-fi uppercase bg-slate-900/80">
              <th className="p-4 tracking-wider">Timestamp</th>
              <th className="p-4 tracking-wider">Designation</th>
              <th className="p-4 text-center text-blue-400">Phys</th>
              <th className="p-4 text-center text-purple-400">Chem</th>
              <th className="p-4 text-center text-emerald-400">Bio</th>
              <th className="p-4 text-center text-cyan-400">Agg</th>
              <th className="p-4 text-center">Vector</th>
              <th className="p-4 text-right">Ops</th>
            </tr>
          </thead>
          <tbody className="font-mono-sci-fi text-sm">
            {data.map((record, index) => {
              const previousRecord = data[index + 1];
              const status = previousRecord 
                ? getProgressStatus(record.total, previousRecord.total)
                : { label: '-', color: 'text-slate-600', icon: 'equal' as const };

              return (
                <tr key={record.id} className="border-b border-slate-800 hover:bg-cyan-900/10 transition-colors group">
                  <td className="p-4 text-slate-300 whitespace-nowrap">{record.date}</td>
                  <td className="p-4 text-white font-semibold">{record.testName}</td>
                  <td className="p-4 text-center text-slate-400 group-hover:text-blue-300 transition-colors">{record.scores.physics}</td>
                  <td className="p-4 text-center text-slate-400 group-hover:text-purple-300 transition-colors">{record.scores.chemistry}</td>
                  <td className="p-4 text-center text-slate-400 group-hover:text-emerald-300 transition-colors">{record.scores.biology}</td>
                  <td className="p-4 text-center font-bold text-cyan-400 text-base shadow-cyan-500/50">{record.total}</td>
                  <td className="p-4 text-center">
                    <div className={`flex items-center justify-center gap-1 ${status.color} text-xs`}>
                        {status.icon === 'up' && <TrendingUp size={12} />}
                        {status.icon === 'down' && <TrendingDown size={12} />}
                        {status.icon === 'equal' && <Minus size={12} />}
                        {status.icon !== 'equal' && <span>{Math.abs(record.total - (previousRecord?.total || 0))}</span>}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => onDelete(record.id)}
                      className="text-slate-600 hover:text-red-500 transition p-1 opacity-50 hover:opacity-100"
                      title="Purge Record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryList;
