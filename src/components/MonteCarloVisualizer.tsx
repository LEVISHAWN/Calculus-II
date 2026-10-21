import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Play, RotateCcw, Cpu, Sparkles } from 'lucide-react';
import { MathView } from './MathView';

export const MonteCarloVisualizer: React.FC = () => {
  const [targetSamples, setTargetSamples] = useState<number>(1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Target function: 4 / (1 + x^2) on [0, 1] whose exact integral is PI ≈ 3.14159265
  // Bounding box: x in [0, 1], y in [0, 4], Area = 4
  const exactPi = Math.PI;

  const [points, setPoints] = useState<{ x: number; y: number; inside: boolean }[]>([]);

  const generateSamples = (count: number) => {
    const newPoints: { x: number; y: number; inside: boolean }[] = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random();
      const y = Math.random() * 4;
      const fnY = 4 / (1 + x * x);
      newPoints.push({
        x,
        y,
        inside: y <= fnY,
      });
    }
    setPoints(newPoints);
  };

  useEffect(() => {
    generateSamples(targetSamples);
  }, [targetSamples]);

  const insideCount = useMemo(() => points.filter((p) => p.inside).length, [points]);
  const estimatedIntegral = useMemo(() => {
    if (points.length === 0) return 0;
    const boxArea = 1 * 4;
    return (insideCount / points.length) * boxArea;
  }, [points, insideCount]);

  const errorPct = useMemo(() => {
    if (points.length === 0) return 0;
    return Math.abs((estimatedIntegral - exactPi) / exactPi) * 100;
  }, [estimatedIntegral, exactPi, points]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const pad = 35;
    const plotW = width - pad * 2;
    const plotH = height - pad * 2;

    const mapX = (x: number) => pad + x * plotW;
    const mapY = (y: number) => pad + plotH - (y / 4) * plotH;

    // Background bounding box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(pad, pad, plotW, plotH);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(pad, pad, plotW, plotH);

    // Draw curve 4 / (1 + x^2)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const x = i / steps;
      const y = 4 / (1 + x * x);
      const cx = mapX(x);
      const cy = mapY(y);
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    // Draw random sampled points (subset for performance if high)
    const pointsToDraw = points.slice(0, 3000);
    pointsToDraw.forEach((p) => {
      const px = mapX(p.x);
      const py = mapY(p.y);
      ctx.fillStyle = p.inside ? 'rgba(52, 211, 153, 0.7)' : 'rgba(148, 163, 184, 0.25)';
      ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
    });

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('y = 4', 4, pad + 10);
    ctx.fillText('y = 0', 4, pad + plotH);
    ctx.fillText('x = 0', pad - 8, pad + plotH + 18);
    ctx.fillText('x = 1', pad + plotW - 10, pad + plotH + 18);
  }, [points]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-semibold text-lg text-slate-100">
              Monte Carlo Numerical Integration & GPU Path Tracing
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Estimating the impossible integral ∫₀¹ 4/(1 + x²) dx = π by shooting random rays into bounding space
          </p>
        </div>

        {/* Sample size options */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1">Rays / Samples:</span>
          {[200, 1000, 5000, 20000].map((n) => (
            <button
              key={n}
              onClick={() => setTargetSamples(n)}
              className={`text-xs px-2.5 py-1 rounded-lg font-mono font-medium transition-all ${
                targetSamples === n
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {n >= 1000 ? `${n / 1000}k` : n}
            </button>
          ))}
          <button
            onClick={() => generateSamples(targetSamples)}
            className="p-1.5 ml-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
            title="Resample"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={480}
            height={280}
            className="w-full h-auto block rounded-lg"
          />
          <div className="flex items-center gap-4 mt-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              Under curve (Inside): {insideCount}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              Rejected: {points.length - insideCount}
            </span>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col justify-between space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] font-mono uppercase text-slate-400">Exact Value (π)</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                {exactPi.toFixed(6)}
              </div>
              <span className="text-[10px] text-slate-500">∫ 4/(1 + x²) dx</span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] font-mono uppercase text-slate-400">Monte Carlo Estimate</span>
              <div className="text-xl font-bold font-mono text-sky-400 mt-1">
                {estimatedIntegral.toFixed(6)}
              </div>
              <span
                className={`text-[10px] font-mono ${
                  errorPct < 1 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                Error: {errorPct.toFixed(3)}%
              </span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-indigo-300 font-mono font-semibold">
              <Cpu className="w-4 h-4" /> Why Computer Science Uses This:
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              In 3D photorealistic path tracing (e.g. Blender Cycles, Unreal Engine 5 Lumen), the
              rendering equation has hundreds of light bounces. Standard Riemann integration suffers
              from the <em>Curse of Dimensionality</em> (O(N^d) cost), while Monte Carlo convergence
              error is strictly <strong>O(1/√N)</strong> regardless of how many dimensions the integral
              has!
            </p>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
              <span className="text-purple-400">const</span> estimated = (inside / total) *
              boundingBoxArea;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
