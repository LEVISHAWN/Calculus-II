import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Play, RotateCcw, Info, Code2 } from 'lucide-react';
import { MathView } from './MathView';

interface FuncOption {
  id: string;
  name: string;
  latex: string;
  fn: (x: number) => number;
  antiFn: (x: number) => number;
  defaultA: number;
  defaultB: number;
}

const FUNCTIONS: FuncOption[] = [
  {
    id: 'poly',
    name: 'Cubic Acceleration f(x) = x³ - 2x + 3',
    latex: 'f(x) = x^3 - 2x + 3',
    fn: (x) => Math.pow(x, 3) - 2 * x + 3,
    antiFn: (x) => Math.pow(x, 4) / 4 - Math.pow(x, 2) + 3 * x,
    defaultA: 0,
    defaultB: 2.5,
  },
  {
    id: 'quad',
    name: 'Standard Parabola f(x) = x²',
    latex: 'f(x) = x^2',
    fn: (x) => x * x,
    antiFn: (x) => Math.pow(x, 3) / 3,
    defaultA: 0,
    defaultB: 3,
  },
  {
    id: 'exp',
    name: 'Exponential Growth f(x) = eˣ',
    latex: 'f(x) = e^x',
    fn: (x) => Math.exp(x),
    antiFn: (x) => Math.exp(x),
    defaultA: 0,
    defaultB: 2,
  },
  {
    id: 'sin',
    name: 'Harmonic Wave f(x) = sin(x) + 1.2',
    latex: 'f(x) = \\sin(x) + 1.2',
    fn: (x) => Math.sin(x) + 1.2,
    antiFn: (x) => -Math.cos(x) + 1.2 * x,
    defaultA: 0,
    defaultB: Math.PI,
  },
];

export const RiemannVisualizer: React.FC = () => {
  const [selectedFuncId, setSelectedFuncId] = useState<string>('poly');
  const [nSteps, setNSteps] = useState<number>(12);
  const [method, setMethod] = useState<'left' | 'right' | 'midpoint' | 'trapezoid'>('left');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentFunc = useMemo(
    () => FUNCTIONS.find((f) => f.id === selectedFuncId) || FUNCTIONS[0],
    [selectedFuncId]
  );

  const a = currentFunc.defaultA;
  const b = currentFunc.defaultB;

  // Exact Analytical Integral
  const exactValue = useMemo(() => {
    return currentFunc.antiFn(b) - currentFunc.antiFn(a);
  }, [currentFunc, a, b]);

  // Numerical approximation
  const { approxValue, samplePoints } = useMemo(() => {
    const dx = (b - a) / nSteps;
    let sum = 0;
    const samples: { x: number; y: number; barX: number; barW: number; barH: number }[] = [];

    for (let i = 0; i < nSteps; i++) {
      const xLeft = a + i * dx;
      const xRight = xLeft + dx;
      let evalX = xLeft;
      let barHeight = 0;

      if (method === 'left') {
        evalX = xLeft;
        barHeight = currentFunc.fn(evalX);
        sum += barHeight * dx;
      } else if (method === 'right') {
        evalX = xRight;
        barHeight = currentFunc.fn(evalX);
        sum += barHeight * dx;
      } else if (method === 'midpoint') {
        evalX = xLeft + dx / 2;
        barHeight = currentFunc.fn(evalX);
        sum += barHeight * dx;
      } else if (method === 'trapezoid') {
        const yL = currentFunc.fn(xLeft);
        const yR = currentFunc.fn(xRight);
        barHeight = (yL + yR) / 2;
        sum += barHeight * dx;
      }

      samples.push({
        x: evalX,
        y: currentFunc.fn(evalX),
        barX: xLeft,
        barW: dx,
        barH: barHeight,
      });
    }

    return { approxValue: sum, samplePoints: samples };
  }, [currentFunc, a, b, nSteps, method]);

  const errorPct = useMemo(() => {
    if (Math.abs(exactValue) < 1e-9) return 0;
    return Math.abs((approxValue - exactValue) / exactValue) * 100;
  }, [approxValue, exactValue]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const padLeft = 45;
    const padRight = 20;
    const padTop = 25;
    const padBottom = 35;

    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    // Calculate function bounds
    let minY = 0;
    let maxY = 0;
    const nEval = 150;
    for (let i = 0; i <= nEval; i++) {
      const x = a + (i / nEval) * (b - a);
      const y = currentFunc.fn(x);
      if (y > maxY) maxY = y;
      if (y < minY) minY = y;
    }
    maxY = Math.max(maxY * 1.15, 1);
    minY = Math.min(minY * 1.1, 0);

    const mapX = (x: number) => padLeft + ((x - a) / (b - a)) * plotW;
    const mapY = (y: number) => padTop + plotH - ((y - minY) / (maxY - minY)) * plotH;

    // Draw background grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const yGridSteps = 4;
    for (let i = 0; i <= yGridSteps; i++) {
      const yVal = minY + (i / yGridSteps) * (maxY - minY);
      const canvasY = mapY(yVal);
      ctx.moveTo(padLeft, canvasY);
      ctx.lineTo(width - padRight, canvasY);

      // Label
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(yVal.toFixed(1), padLeft - 6, canvasY + 3);
    }
    ctx.stroke();

    // Draw Axes
    const zeroY = mapY(0);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padLeft, zeroY);
    ctx.lineTo(width - padRight, zeroY);
    ctx.stroke();

    // Draw Riemann Rectangles
    samplePoints.forEach((sp, idx) => {
      const rx = mapX(sp.barX);
      const rw = mapX(sp.barX + sp.barW) - rx;
      const ry = mapY(Math.max(0, sp.barH));
      const rh = Math.abs(mapY(0) - ry);

      if (method === 'trapezoid') {
        const yL = mapY(currentFunc.fn(sp.barX));
        const yR = mapY(currentFunc.fn(sp.barX + sp.barW));
        ctx.fillStyle = idx % 2 === 0 ? 'rgba(99, 102, 241, 0.35)' : 'rgba(79, 70, 229, 0.25)';
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.7)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(rx, zeroY);
        ctx.lineTo(rx, yL);
        ctx.lineTo(rx + rw, yR);
        ctx.lineTo(rx + rw, zeroY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = idx % 2 === 0 ? 'rgba(99, 102, 241, 0.35)' : 'rgba(79, 70, 229, 0.25)';
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.7)';
        ctx.lineWidth = 1;

        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeRect(rx, ry, rw, rh);

        // Evaluation dot
        const evalCanvasX = mapX(sp.x);
        const evalCanvasY = mapY(sp.y);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(evalCanvasX, evalCanvasY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw Continuous Curve f(x)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= nEval; i++) {
      const x = a + (i / nEval) * (b - a);
      const y = currentFunc.fn(x);
      const cx = mapX(x);
      const cy = mapY(y);
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    // Draw X-axis tick labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`a = ${a.toFixed(1)}`, mapX(a), zeroY + 16);
    ctx.fillText(`b = ${b.toFixed(1)}`, mapX(b), zeroY + 16);
  }, [currentFunc, a, b, nSteps, method, samplePoints]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
            <h3 className="font-semibold text-lg text-slate-100">
              Interactive Accumulator & Riemann Sum Engine
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Watch how a discrete for-loop converges to the exact continuous integral as Δx → 0
          </p>
        </div>

        {/* Function Selector */}
        <select
          value={selectedFuncId}
          onChange={(e) => setSelectedFuncId(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
        >
          {FUNCTIONS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
        {/* Canvas Visualizer */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative bg-slate-950/70 border border-slate-800/80 rounded-xl p-2 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={640}
              height={320}
              className="w-full h-auto block rounded-lg"
            />
            <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-700/60 rounded-md px-2.5 py-1 text-[11px] font-mono text-cyan-300">
              dx = {((b - a) / nSteps).toFixed(4)}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 space-y-3 bg-slate-800/40 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <span>Partition Slices (N)</span>
                <span className="text-indigo-400 font-mono font-bold">[{nSteps}]</span>
              </label>
              <div className="flex gap-1">
                {[4, 12, 30, 80].map((quickN) => (
                  <button
                    key={quickN}
                    onClick={() => setNSteps(quickN)}
                    className={`text-[10px] px-2 py-0.5 rounded font-mono transition-colors ${
                      nSteps === quickN
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    N={quickN}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="range"
              min="2"
              max="100"
              step="1"
              value={nSteps}
              onChange={(e) => setNSteps(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />

            <div className="grid grid-cols-4 gap-2 pt-1">
              {(['left', 'right', 'midpoint', 'trapezoid'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`py-1.5 px-2 text-xs rounded-lg font-medium capitalize border transition-all ${
                    method === m
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-sm'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats & CS Code Analogy */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Comparison Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Exact Integral (F(b) - F(a))
              </span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                {exactValue.toFixed(4)}
              </div>
              <span className="text-[10px] text-slate-500">Calculated via Antiderivative</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Riemann Approximation
              </span>
              <div className="text-xl font-bold font-mono text-indigo-400 mt-1">
                {approxValue.toFixed(4)}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className={`text-[10px] font-mono font-medium ${
                    errorPct < 1 ? 'text-emerald-400' : errorPct < 5 ? 'text-amber-400' : 'text-rose-400'
                  }`}
                >
                  Error: {errorPct.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Code representation */}
          <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-3.5 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-indigo-300">
                <Code2 className="w-3.5 h-3.5" />
                Live Algorithm Loop (O(N))
              </span>
              <span className="text-[10px] text-slate-500">TypeScript</span>
            </div>

            <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed flex-1">
              <span className="text-purple-400">const</span> dx = ({b.toFixed(2)} - {a.toFixed(2)}) /{' '}
              <span className="text-amber-300">{nSteps}</span>;{'\n'}
              <span className="text-purple-400">let</span> totalArea ={' '}
              <span className="text-amber-300">0</span>;{'\n'}
              {'\n'}
              <span className="text-purple-400">for</span> (
              <span className="text-purple-400">let</span> i ={' '}
              <span className="text-amber-300">0</span>; i &lt;{' '}
              <span className="text-amber-300">{nSteps}</span>; i++) &#123;{'\n'}
              {'  '}
              <span className="text-purple-400">const</span> x = {a.toFixed(2)} + i * dx;{'\n'}
              {'  '}totalArea += <span className="text-cyan-300">f</span>(x) * dx;{'\n'}
              &#125;{'\n'}
              {'\n'}
              <span className="text-slate-500">// Returns: {approxValue.toFixed(4)}</span>
            </pre>

            <div className="mt-3 bg-indigo-950/40 border border-indigo-800/40 rounded-lg p-2 text-[11px] text-indigo-200/90">
              💡 <strong>CS Takeaway:</strong> An integral is simply an accumulated reduction. When N
              reaches infinity, the error converges to 0 with asymptotic rate O(1/N) (or O(1/N²) for
              Trapezoidal rule).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
