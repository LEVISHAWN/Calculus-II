import React, { useState } from 'react';
import { ArrowRight, RotateCcw, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import { MathView } from './MathView';

interface TabularProblem {
  id: string;
  title: string;
  latexProblem: string;
  dInitial: string;
  iInitial: string;
  rows: {
    sign: '+' | '-';
    dLatex: string;
    iLatex: string;
    productLatex: string;
    explanation: string;
  }[];
  finalLatex: string;
}

const TABULAR_PROBLEMS: TabularProblem[] = [
  {
    id: 'poly-exp',
    title: 'Cubic × Exponential: ∫ x³ e^(2x) dx',
    latexProblem: '\\int x^3 e^{2x} \\, dx',
    dInitial: 'x^3',
    iInitial: 'e^{2x}',
    rows: [
      {
        sign: '+',
        dLatex: 'x^3',
        iLatex: 'e^{2x}',
        productLatex: '+ (x^3) \\cdot \\left(\\frac{1}{2}e^{2x}\\right)',
        explanation: 'Initial terms: differentiate x³ next, integrate e^(2x)',
      },
      {
        sign: '-',
        dLatex: '3x^2',
        iLatex: '\\frac{1}{2}e^{2x}',
        productLatex: '- (3x^2) \\cdot \\left(\\frac{1}{4}e^{2x}\\right)',
        explanation: 'd/dx(x³) = 3x²; ∫ (1/2)e^(2x) = (1/4)e^(2x)',
      },
      {
        sign: '+',
        dLatex: '6x',
        iLatex: '\\frac{1}{4}e^{2x}',
        productLatex: '+ (6x) \\cdot \\left(\\frac{1}{8}e^{2x}\\right)',
        explanation: 'd/dx(3x²) = 6x; ∫ (1/4)e^(2x) = (1/8)e^(2x)',
      },
      {
        sign: '-',
        dLatex: '6',
        iLatex: '\\frac{1}{8}e^{2x}',
        productLatex: '- (6) \\cdot \\left(\\frac{1}{16}e^{2x}\\right)',
        explanation: 'd/dx(6x) = 6; ∫ (1/8)e^(2x) = (1/16)e^(2x)',
      },
      {
        sign: '+',
        dLatex: '0',
        iLatex: '\\frac{1}{16}e^{2x}',
        productLatex: '',
        explanation: 'd/dx(6) = 0! Term reached zero, so table terminates.',
      },
    ],
    finalLatex: 'e^{2x} \\left( \\frac{x^3}{2} - \\frac{3x^2}{4} + \\frac{3x}{4} - \\frac{3}{8} \\right) + C',
  },
  {
    id: 'poly-trig',
    title: 'Parabola × Sine: ∫ x² sin(x) dx',
    latexProblem: '\\int x^2 \\sin x \\, dx',
    dInitial: 'x^2',
    iInitial: '\\sin x',
    rows: [
      {
        sign: '+',
        dLatex: 'x^2',
        iLatex: '\\sin x',
        productLatex: '+ (x^2) \\cdot (-\\cos x)',
        explanation: 'Initial pair: differentiate x², integrate sin(x)',
      },
      {
        sign: '-',
        dLatex: '2x',
        iLatex: '-\\cos x',
        productLatex: '- (2x) \\cdot (-\\sin x)',
        explanation: 'd/dx(x²) = 2x; ∫ -cos(x) = -sin(x)',
      },
      {
        sign: '+',
        dLatex: '2',
        iLatex: '-\\sin x',
        productLatex: '+ (2) \\cdot (\\cos x)',
        explanation: 'd/dx(2x) = 2; ∫ -sin(x) = cos(x)',
      },
      {
        sign: '-',
        dLatex: '0',
        iLatex: '\\cos x',
        productLatex: '',
        explanation: 'd/dx(2) = 0! Zero reached, table terminates.',
      },
    ],
    finalLatex: '-x^2 \\cos x + 2x \\sin x + 2\\cos x + C',
  },
  {
    id: 'poly-exp-decay',
    title: 'Decay Waveform: ∫ x² e^(-x) dx',
    latexProblem: '\\int x^2 e^{-x} \\, dx',
    dInitial: 'x^2',
    iInitial: 'e^{-x}',
    rows: [
      {
        sign: '+',
        dLatex: 'x^2',
        iLatex: 'e^{-x}',
        productLatex: '+ (x^2) \\cdot (-e^{-x})',
        explanation: 'Initial pair',
      },
      {
        sign: '-',
        dLatex: '2x',
        iLatex: '-e^{-x}',
        productLatex: '- (2x) \\cdot (e^{-x})',
        explanation: 'd/dx(x²) = 2x; ∫ -e^(-x) = e^(-x)',
      },
      {
        sign: '+',
        dLatex: '2',
        iLatex: 'e^{-x}',
        productLatex: '+ (2) \\cdot (-e^{-x})',
        explanation: 'd/dx(2x) = 2; ∫ e^(-x) = -e^(-x)',
      },
      {
        sign: '-',
        dLatex: '0',
        iLatex: '-e^{-x}',
        productLatex: '',
        explanation: 'Zero reached!',
      },
    ],
    finalLatex: '-e^{-x}(x^2 + 2x + 2) + C',
  },
];

export const TabularMethodVisualizer: React.FC = () => {
  const [selectedProbId, setSelectedProbId] = useState<string>('poly-exp');
  const [activeStep, setActiveStep] = useState<number>(1);

  const problem = TABULAR_PROBLEMS.find((p) => p.id === selectedProbId) || TABULAR_PROBLEMS[0];
  const maxSteps = problem.rows.length;

  const handleProbChange = (id: string) => {
    setSelectedProbId(id);
    setActiveStep(1);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-semibold text-lg text-slate-100">
              Interactive Tabular Method (DI Method Simulator)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Differentiate down to 0, integrate repeatedly, and multiply diagonally with alternating signs.
          </p>
        </div>

        {/* Problem selector */}
        <div className="flex gap-1.5 flex-wrap">
          {TABULAR_PROBLEMS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleProbChange(p.id)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                selectedProbId === p.id
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                  : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">TARGET INTEGRAL:</span>
          <MathView math={problem.latexProblem} className="text-indigo-300 font-bold text-base" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
            disabled={activeStep <= 1}
            className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
          >
            Previous
          </button>
          <span className="text-xs font-mono text-slate-400">
            Row {activeStep} / {maxSteps}
          </span>
          <button
            onClick={() => setActiveStep((prev) => Math.min(maxSteps, prev + 1))}
            disabled={activeStep >= maxSteps}
            className="px-2.5 py-1 text-xs rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-medium flex items-center gap-1"
          >
            Next Row <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveStep(maxSteps)}
            className="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            Show All
          </button>
          <button
            onClick={() => setActiveStep(1)}
            className="p-1 text-slate-400 hover:text-slate-200"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* The DI Table */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 bg-slate-800/60 border-b border-slate-800 py-2.5 px-4 text-xs font-mono font-semibold text-slate-300">
            <div className="col-span-2 text-center text-amber-400">SIGN (±)</div>
            <div className="col-span-5 text-center text-sky-400">D (Differentiate)</div>
            <div className="col-span-5 text-center text-emerald-400">I (Integrate)</div>
          </div>

          <div className="divide-y divide-slate-800/60 p-2 space-y-1">
            {problem.rows.map((row, idx) => {
              const isVisible = idx < activeStep;
              const isTerminal = idx === problem.rows.length - 1;
              const hasDiagonal = isVisible && idx < activeStep - 1 && !isTerminal;

              return (
                <div
                  key={idx}
                  className={`grid grid-cols-12 items-center py-2.5 px-3 rounded-lg transition-all duration-300 ${
                    isVisible
                      ? idx === activeStep - 1
                        ? 'bg-indigo-950/40 border border-indigo-500/40'
                        : 'bg-slate-900/50'
                      : 'opacity-20'
                  }`}
                >
                  {/* Sign */}
                  <div className="col-span-2 flex justify-center">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold font-mono text-sm ${
                        row.sign === '+'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}
                    >
                      {row.sign}
                    </span>
                  </div>

                  {/* D Column */}
                  <div className="col-span-5 flex items-center justify-center relative">
                    <MathView math={row.dLatex} className="text-slate-200 font-mono text-sm" />
                    {/* Visual diagonal line indicator */}
                    {hasDiagonal && (
                      <div className="hidden sm:flex absolute right-1 items-center text-emerald-400 text-xs font-mono font-bold animate-pulse">
                        <span className="text-[10px] text-slate-400 mr-1">diag</span>
                        ↘
                      </div>
                    )}
                  </div>

                  {/* I Column */}
                  <div className="col-span-5 flex items-center justify-center">
                    <MathView math={row.iLatex} className="text-slate-200 font-mono text-sm" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-900/60 border-t border-slate-800/80 p-3 text-xs text-slate-400 flex items-center gap-2">
            <span className="text-emerald-400 font-mono">💡 Rule:</span>
            <span>
              Connect row <span className="font-mono text-slate-200">k</span> of D diagonally down to
              row <span className="font-mono text-slate-200">k+1</span> of I. Multiply and attach row{' '}
              <span className="font-mono text-slate-200">k</span>'s sign!
            </span>
          </div>
        </div>

        {/* Diagonal Products Accumulated */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex-1">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Accumulated Diagonal Terms
            </h4>

            <div className="space-y-2 mt-3">
              {problem.rows.slice(0, activeStep - 1).map((row, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs font-mono"
                >
                  <span className="text-slate-400">Term {idx + 1}:</span>
                  <MathView math={row.productLatex} className="text-emerald-300 font-semibold" />
                </div>
              ))}

              {activeStep <= 1 && (
                <div className="text-center py-6 text-slate-500 text-xs italic">
                  Advance to Row 2 to generate the first diagonal product...
                </div>
              )}
            </div>
          </div>

          {/* Final simplified answer */}
          {activeStep === maxSteps && (
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-4 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4" /> Final Simplified Result
              </div>
              <div className="overflow-x-auto py-1">
                <MathView math={problem.finalLatex} block className="text-slate-100 text-base" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
