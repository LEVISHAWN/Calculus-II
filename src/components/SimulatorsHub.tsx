import React, { useState } from 'react';
import { RiemannVisualizer } from './RiemannVisualizer';
import { TabularMethodVisualizer } from './TabularMethodVisualizer';
import { TrigSubTriangle } from './TrigSubTriangle';
import { MonteCarloVisualizer } from './MonteCarloVisualizer';
import { Sliders, Activity, Table, Triangle, Cpu } from 'lucide-react';

export const SimulatorsHub: React.FC = () => {
  const [activeLab, setActiveLab] = useState<'riemann' | 'tabular' | 'trig-sub' | 'monte-carlo'>('riemann');

  return (
    <div className="space-y-6">
      {/* Selector Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg">
                <Sliders className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-100">Interactive Calculus & CS Visual Labs</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Hands-on interactive sandboxes to build deep geometric and computational intuition
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveLab('riemann')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeLab === 'riemann'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Riemann Accumulator
            </button>
            <button
              onClick={() => setActiveLab('tabular')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeLab === 'tabular'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" /> Tabular DI Method
            </button>
            <button
              onClick={() => setActiveLab('trig-sub')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeLab === 'trig-sub'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Triangle className="w-3.5 h-3.5" /> Trig Sub Triangle
            </button>
            <button
              onClick={() => setActiveLab('monte-carlo')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeLab === 'monte-carlo'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" /> Monte Carlo Path Tracer
            </button>
          </div>
        </div>
      </div>

      {/* Render Active Lab */}
      <div>
        {activeLab === 'riemann' && <RiemannVisualizer />}
        {activeLab === 'tabular' && <TabularMethodVisualizer />}
        {activeLab === 'trig-sub' && <TrigSubTriangle />}
        {activeLab === 'monte-carlo' && <MonteCarloVisualizer />}
      </div>
    </div>
  );
};
