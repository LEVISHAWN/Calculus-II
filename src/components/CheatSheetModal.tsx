import React, { useState } from 'react';
import { MathView } from './MathView';
import { Search, X, Copy, Check, FileText, Code2, BookMarked } from 'lucide-react';

interface CheatItem {
  category: 'Basic' | 'Trig' | 'Inverse Trig' | 'Exponentials' | 'Techniques' | 'Python SymPy';
  title: string;
  latex: string;
  notes: string;
  pythonCode?: string;
}

const CHEAT_ITEMS: CheatItem[] = [
  // Basic
  {
    category: 'Basic',
    title: 'Power Rule (n ≠ -1)',
    latex: '\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C',
    notes: 'Increment power by 1, divide by new power.',
    pythonCode: 'sympy.integrate(x**n, x)',
  },
  {
    category: 'Basic',
    title: 'Reciprocal Logarithm (n = -1)',
    latex: '\\int \\frac{1}{x} \\, dx = \\ln|x| + C',
    notes: 'Crucial: absolute values required.',
    pythonCode: 'sympy.integrate(1/x, x) # log(x)',
  },
  {
    category: 'Basic',
    title: 'Constant Rule',
    latex: '\\int k \\, dx = kx + C',
    notes: 'Linear accumulation of constant rate.',
  },
  {
    category: 'Basic',
    title: 'Linear Shift Rule',
    latex: '\\int f(ax + b) \\, dx = \\frac{1}{a} F(ax + b) + C',
    notes: 'Divide by the inner linear slope a.',
  },

  // Trig
  {
    category: 'Trig',
    title: 'Sine Integral',
    latex: '\\int \\sin(kx) \\, dx = -\\frac{1}{k}\\cos(kx) + C',
    notes: 'Minus sign on cosine result.',
  },
  {
    category: 'Trig',
    title: 'Cosine Integral',
    latex: '\\int \\cos(kx) \\, dx = \\frac{1}{k}\\sin(kx) + C',
    notes: 'Direct sine result.',
  },
  {
    category: 'Trig',
    title: 'Secant Squared',
    latex: '\\int \\sec^2(x) \\, dx = \\tan(x) + C',
    notes: 'Derivative of tan is sec^2.',
  },
  {
    category: 'Trig',
    title: 'Secant × Tangent',
    latex: '\\int \\sec(x)\\tan(x) \\, dx = \\sec(x) + C',
    notes: 'Standard trig derivative pair.',
  },
  {
    category: 'Trig',
    title: 'Tangent Integral',
    latex: '\\int \\tan(x) \\, dx = \\ln|\\sec(x)| + C = -\\ln|\\cos(x)| + C',
    notes: 'Derived from quotient sin/cos.',
  },
  {
    category: 'Trig',
    title: 'Secant Integral',
    latex: '\\int \\sec(x) \\, dx = \\ln|\\sec(x) + \\tan(x)| + C',
    notes: 'Multiplied by (sec x + tan x)/(sec x + tan x).',
  },
  {
    category: 'Trig',
    title: 'Sine Squared (Half-Angle)',
    latex: '\\int \\sin^2(x) \\, dx = \\frac{x}{2} - \\frac{\\sin(2x)}{4} + C',
    notes: 'Using sin^2 x = (1 - cos 2x)/2.',
  },
  {
    category: 'Trig',
    title: 'Cosine Squared (Half-Angle)',
    latex: '\\int \\cos^2(x) \\, dx = \\frac{x}{2} + \\frac{\\sin(2x)}{4} + C',
    notes: 'Using cos^2 x = (1 + cos 2x)/2.',
  },
  {
    category: 'Trig',
    title: 'Sine × Cosine Product-to-Sum',
    latex: '\\sin(mx)\\cos(nx) = \\frac{1}{2}[\\sin((m+n)x) + \\sin((m-n)x)]',
    notes: 'Converts product into two individual sine waves.',
  },

  // Inverse Trig
  {
    category: 'Inverse Trig',
    title: 'Standard Arc-tangent',
    latex: '\\int \\frac{1}{a^2 + x^2} \\, dx = \\frac{1}{a} \\arctan\\left(\\frac{x}{a}\\right) + C',
    notes: 'Notice 1/a factor outside.',
    pythonCode: 'sympy.integrate(1/(a**2 + x**2), x)',
  },
  {
    category: 'Inverse Trig',
    title: 'Standard Arc-sine',
    latex: '\\int \\frac{1}{\\sqrt{a^2 - x^2}} \\, dx = \\arcsin\\left(\\frac{x}{a}\\right) + C',
    notes: 'NO 1/a factor outside.',
    pythonCode: 'sympy.integrate(1/sympy.sqrt(a**2 - x**2), x)',
  },
  {
    category: 'Inverse Trig',
    title: 'Standard Arc-secant',
    latex: '\\int \\frac{1}{x\\sqrt{x^2 - a^2}} \\, dx = \\frac{1}{a} \\text{arcsec}\\left(\\frac{|x|}{a}\\right) + C',
    notes: 'Has 1/a outside and x in denominator.',
  },

  // Exponentials
  {
    category: 'Exponentials',
    title: 'Natural Exponential',
    latex: '\\int e^{kx} \\, dx = \\frac{1}{k}e^{kx} + C',
    notes: 'Divide by inner linear slope k.',
  },
  {
    category: 'Exponentials',
    title: 'General Base a^x',
    latex: '\\int a^x \\, dx = \\frac{a^x}{\\ln(a)} + C',
    notes: 'Divide by ln(a). In CS base 2: 2^x / ln(2).',
  },

  // Techniques
  {
    category: 'Techniques',
    title: 'The Pattern Form [f(x)]^n f\'(x)',
    latex: '\\int [f(x)]^n f\'(x) \\, dx = \\frac{[f(x)]^{n+1}}{n+1} + C',
    notes: 'Instant reverse chain evaluation.',
  },
  {
    category: 'Techniques',
    title: 'The Logarithmic Quotient f\'(x) / f(x)',
    latex: '\\int \\frac{f\'(x)}{f(x)} \\, dx = \\ln|f(x)| + C',
    notes: 'Numerator is derivative of denominator.',
  },
  {
    category: 'Techniques',
    title: 'Integration by Parts Formula',
    latex: '\\int u \\, dv = u v - \\int v \\, du',
    notes: 'LIATE Priority: Log > InvTrig > Alg > Trig > Exp.',
  },
  {
    category: 'Techniques',
    title: 'Trig Sub Case 1: √(a² - x²)',
    latex: 'x = a\\sin\\theta, \\quad dx = a\\cos\\theta \\, d\\theta, \\quad \\sqrt{a^2-x^2} = a\\cos\\theta',
    notes: 'Using 1 - sin^2 = cos^2.',
  },
  {
    category: 'Techniques',
    title: 'Trig Sub Case 2: √(a² + x²)',
    latex: 'x = a\\tan\\theta, \\quad dx = a\\sec^2\\theta \\, d\\theta, \\quad \\sqrt{a^2+x^2} = a\\sec\\theta',
    notes: 'Using 1 + tan^2 = sec^2.',
  },
  {
    category: 'Techniques',
    title: 'Trig Sub Case 3: √(x² - a²)',
    latex: 'x = a\\sec\\theta, \\quad dx = a\\sec\\theta\\tan\\theta \\, d\\theta, \\quad \\sqrt{x^2-a^2} = a\\tan\\theta',
    notes: 'Using sec^2 - 1 = tan^2.',
  },
  {
    category: 'Techniques',
    title: 'Weierstrass Universal Substitution',
    latex: 't = \\tan(x/2), \\quad \\sin x = \\frac{2t}{1+t^2}, \\quad \\cos x = \\frac{1-t^2}{1+t^2}, \\quad dx = \\frac{2}{1+t^2}dt',
    notes: 'Converts trig into rational polynomials.',
  },
  {
    category: 'Techniques',
    title: 'Sine Power Reduction Formula',
    latex: '\\int \\sin^n x \\, dx = -\\frac{1}{n}\\sin^{n-1}x\\cos x + \\frac{n-1}{n}\\int \\sin^{n-2}x \\, dx',
    notes: 'Step decrease of 2.',
  },
];

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Basic', 'Trig', 'Inverse Trig', 'Exponentials', 'Techniques'];

  const filteredItems = CHEAT_ITEMS.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.latex.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (latex: string, idx: number) => {
    navigator.clipboard.writeText(latex);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <BookMarked className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Calculus 2 Master Integration Formula Sheet
              </h3>
              <p className="text-xs text-slate-400">
                All core identities, standard integrals, and computer algebra templates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search formula, trig, power..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60">
                    <span className="text-xs font-semibold text-slate-200">{item.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {item.category}
                    </span>
                  </div>

                  <div className="my-2.5 py-1 text-center bg-slate-900/60 rounded-lg border border-slate-800/60 overflow-x-auto">
                    <MathView math={item.latex} block className="text-indigo-300 text-sm" />
                  </div>

                  <p className="text-[11px] text-slate-400 leading-normal">{item.notes}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  {item.pythonCode ? (
                    <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                      <Code2 className="w-3 h-3" /> SymPy available
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-600">Standard rule</span>
                  )}

                  <button
                    onClick={() => handleCopy(item.latex, idx)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 bg-slate-800/80 px-2 py-1 rounded"
                    title="Copy LaTeX"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy LaTeX</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs">
              No formulas found matching "{searchTerm}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
