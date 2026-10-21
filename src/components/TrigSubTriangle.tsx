import React, { useState } from 'react';
import { MathView } from './MathView';
import { Triangle, ArrowRight, BookOpen } from 'lucide-react';

type CaseType = 'sin' | 'tan' | 'sec';

export const TrigSubTriangle: React.FC = () => {
  const [activeCase, setActiveCase] = useState<CaseType>('sin');
  const [paramA, setParamA] = useState<number>(3);

  const a = paramA;
  const aSquared = a * a;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="font-semibold text-lg text-slate-100">
              Trigonometric Substitution Triangle Engine
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Turn radical algebra into right-triangle trigonometry and un-substitute with SOH-CAH-TOA
          </p>
        </div>

        {/* Case selector */}
        <div className="flex gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveCase('sin')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
              activeCase === 'sin'
                ? 'bg-cyan-600/40 text-cyan-200 border border-cyan-500/50 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            √(a² - x²) [x = a sin θ]
          </button>
          <button
            onClick={() => setActiveCase('tan')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
              activeCase === 'tan'
                ? 'bg-cyan-600/40 text-cyan-200 border border-cyan-500/50 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            √(a² + x²) [x = a tan θ]
          </button>
          <button
            onClick={() => setActiveCase('sec')}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
              activeCase === 'sec'
                ? 'bg-cyan-600/40 text-cyan-200 border border-cyan-500/50 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            √(x² - a²) [x = a sec θ]
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* SVG Triangle Visual */}
        <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[280px]">
          <svg viewBox="0 0 320 220" className="w-full max-w-[280px] h-auto">
            {/* Right triangle: (40, 180) to (240, 180) to (240, 40) */}
            <polygon
              points="50,180 250,180 250,50"
              fill="rgba(6, 182, 212, 0.12)"
              stroke="#06b6d4"
              strokeWidth="2.5"
            />
            {/* Right angle marker at (250, 180) */}
            <polyline
              points="235,180 235,165 250,165"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            {/* Theta arc at (50, 180) */}
            <path
              d="M 85,180 A 35 35 0 0 0 78,160"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
            />
            <text x="92" y="172" fill="#f59e0b" fontSize="14" fontWeight="bold">
              θ
            </text>

            {/* Labels depending on activeCase */}
            {activeCase === 'sin' && (
              <>
                {/* Hypotenuse */}
                <text x="135" y="100" fill="#a78bfa" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Hyp = a ({a})
                </text>
                {/* Opposite */}
                <text x="260" y="115" fill="#38bdf8" fontSize="13" fontWeight="bold">
                  Opp = x
                </text>
                {/* Adjacent */}
                <text x="150" y="202" fill="#34d399" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Adj = √({aSquared} - x²)
                </text>
              </>
            )}

            {activeCase === 'tan' && (
              <>
                {/* Hypotenuse */}
                <text x="130" y="100" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">
                  Hyp = √({aSquared} + x²)
                </text>
                {/* Opposite */}
                <text x="260" y="115" fill="#38bdf8" fontSize="13" fontWeight="bold">
                  Opp = x
                </text>
                {/* Adjacent */}
                <text x="150" y="202" fill="#a78bfa" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Adj = a ({a})
                </text>
              </>
            )}

            {activeCase === 'sec' && (
              <>
                {/* Hypotenuse */}
                <text x="135" y="100" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Hyp = x
                </text>
                {/* Opposite */}
                <text x="260" y="115" fill="#34d399" fontSize="12" fontWeight="bold">
                  Opp = √(x² - {aSquared})
                </text>
                {/* Adjacent */}
                <text x="150" y="202" fill="#a78bfa" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Adj = a ({a})
                </text>
              </>
            )}
          </svg>

          <div className="flex items-center gap-2 mt-3 w-full justify-center">
            <span className="text-xs text-slate-400">Parameter a:</span>
            {[2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => setParamA(val)}
                className={`text-xs px-2.5 py-1 rounded font-mono font-medium ${
                  paramA === val ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                a={val}
              </button>
            ))}
          </div>
        </div>

        {/* Formulas & Back-Substitution mapping */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-mono text-cyan-300 uppercase tracking-wider mb-2">
              1. Master Substitution Set
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">SUBSTITUTION</span>
                {activeCase === 'sin' && <MathView math={`x = ${a}\\sin\\theta`} />}
                {activeCase === 'tan' && <MathView math={`x = ${a}\\tan\\theta`} />}
                {activeCase === 'sec' && <MathView math={`x = ${a}\\sec\\theta`} />}
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">DIFFERENTIAL (dx)</span>
                {activeCase === 'sin' && <MathView math={`dx = ${a}\\cos\\theta \\, d\\theta`} />}
                {activeCase === 'tan' && <MathView math={`dx = ${a}\\sec^2\\theta \\, d\\theta`} />}
                {activeCase === 'sec' && <MathView math={`dx = ${a}\\sec\\theta\\tan\\theta \\, d\\theta`} />}
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">RADICAL COLLAPSE</span>
                {activeCase === 'sin' && <MathView math={`\\sqrt{${aSquared} - x^2} = ${a}\\cos\\theta`} />}
                {activeCase === 'tan' && <MathView math={`\\sqrt{${aSquared} + x^2} = ${a}\\sec\\theta`} />}
                {activeCase === 'sec' && <MathView math={`\\sqrt{x^2 - ${aSquared}} = ${a}\\tan\\theta`} />}
              </div>
            </div>
          </div>

          {/* SOH CAH TOA Back-substitution lookup */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
              2. SOH-CAH-TOA Reverse Lookup (Returning to x)
            </h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 font-mono">sin θ (Opp/Hyp)</span>
                {activeCase === 'sin' && <MathView math={`\\frac{x}{${a}}`} block />}
                {activeCase === 'tan' && <MathView math={`\\frac{x}{\\sqrt{${aSquared} + x^2}}`} block />}
                {activeCase === 'sec' && <MathView math={`\\frac{\\sqrt{x^2 - ${aSquared}}}{x}`} block />}
              </div>

              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 font-mono">cos θ (Adj/Hyp)</span>
                {activeCase === 'sin' && <MathView math={`\\frac{\\sqrt{${aSquared} - x^2}}{${a}}`} block />}
                {activeCase === 'tan' && <MathView math={`\\frac{${a}}{\\sqrt{${aSquared} + x^2}}`} block />}
                {activeCase === 'sec' && <MathView math={`\\frac{${a}}{x}`} block />}
              </div>

              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 font-mono">tan θ (Opp/Adj)</span>
                {activeCase === 'sin' && <MathView math={`\\frac{x}{\\sqrt{${aSquared} - x^2}}`} block />}
                {activeCase === 'tan' && <MathView math={`\\frac{x}{${a}}`} block />}
                {activeCase === 'sec' && <MathView math={`\\frac{\\sqrt{x^2 - ${aSquared}}}{${a}}`} block />}
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800/80">
              ⚡ <strong>Exam Tip:</strong> Never leave your final answer in terms of θ! Read the sides of
              your triangle to translate any trig function back into x in 5 seconds.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
