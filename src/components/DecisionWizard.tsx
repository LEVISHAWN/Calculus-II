import React, { useState } from 'react';
import { GitBranch, CheckCircle2, RotateCcw, ArrowRight, Lightbulb } from 'lucide-react';
import { MathView } from './MathView';

interface DecisionStep {
  id: string;
  question: string;
  options: {
    label: string;
    description: string;
    exampleLatex: string;
    nextStepId?: string;
    recommendation?: {
      technique: string;
      topicId: string;
      explanation: string;
      cheatFormula: string;
    };
  }[];
}

const DECISION_TREE: Record<string, DecisionStep> = {
  start: {
    id: 'start',
    question: 'What is the high-level anatomy of your integrand?',
    options: [
      {
        label: 'A simple polynomial or power of x',
        description: 'Single terms added or subtracted, like x³ - 4x + 7 or 1/√x',
        exampleLatex: '\\int (4x^3 - 5x + 2) \\, dx',
        recommendation: {
          technique: 'Power Rule & Direct Linearity',
          topicId: 'basic-integration',
          explanation:
            'No fancy substitutions needed! Distribute across terms and apply ∫ xⁿ dx = xⁿ⁺¹/(n+1) for each term.',
          cheatFormula: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C',
        },
      },
      {
        label: 'A product of two different function families',
        description: 'Multiplication like polynomial × trig, polynomial × exp, or isolated ln(x)',
        exampleLatex: '\\int x^2 e^{3x} \\, dx \\quad \\text{or} \\quad \\int x \\cos x \\, dx',
        nextStepId: 'step_products',
      },
      {
        label: 'A fraction or rational function P(x) / Q(x)',
        description: 'A polynomial divided by another polynomial',
        exampleLatex: '\\int \\frac{3x - 1}{x^2 - 4} \\, dx \\quad \\text{or} \\quad \\int \\frac{x^3 + 2}{x^2 + 1} \\, dx',
        nextStepId: 'step_fractions',
      },
      {
        label: 'Contains a square root with quadratic sum/difference',
        description: 'Radicals of the form √(a² - x²), √(a² + x²), or √(x² - a²)',
        exampleLatex: '\\int \\frac{\\sqrt{9 - x^2}}{x} \\, dx',
        recommendation: {
          technique: 'Trigonometric Substitution (Trig Sub)',
          topicId: 'trig-substitution',
          explanation:
            'Use the Pythagorean right-triangle substitution: x = a sin(θ) for (a² - x²), x = a tan(θ) for (a² + x²), or x = a sec(θ) for (x² - a²).',
          cheatFormula: 'x = a\\sin\\theta, \\, a\\tan\\theta, \\text{ or } a\\sec\\theta',
        },
      },
      {
        label: 'Contains trigonometric sines, cosines, tangents or powers',
        description: 'Trig powers like sin³(x) cos⁴(x), or mixed frequencies sin(5x)cos(3x)',
        exampleLatex: '\\int \\sin^3 x \\cos^2 x \\, dx',
        nextStepId: 'step_trig',
      },
    ],
  },

  step_products: {
    id: 'step_products',
    question: 'How does the product behave?',
    options: [
      {
        label: 'Polynomial × Exponential or Sine/Cosine',
        description: 'One factor is P(x) (which differentiates to 0) and the other integrates repeatedly',
        exampleLatex: '\\int x^3 e^{2x} \\, dx \\quad \\text{or} \\quad \\int x^2 \\sin x \\, dx',
        recommendation: {
          technique: 'The Tabular Method (DI Method)',
          topicId: 'tabular-method',
          explanation:
            'Skip the recursive nightmare of doing integration by parts 3 times! Use the 3-column table (Sign, D, I) and multiply diagonals.',
          cheatFormula: '\\text{Signs } (+, -, +, -) \\times \\text{Differentiations } \\times \\text{Integrations}',
        },
      },
      {
        label: 'Involves Logarithms or Inverse Trig',
        description: 'Contains ln(x), arctan(x), arcsin(x) where differentiating simplifies immensely',
        exampleLatex: '\\int x \\ln x \\, dx \\quad \\text{or} \\quad \\int \\arctan x \\, dx',
        recommendation: {
          technique: 'Integration by Parts (LIATE Rule)',
          topicId: 'integration-by-parts',
          explanation:
            'Follow LIATE: choose u = ln(x) or u = arctan(x) because their derivatives turn into simple algebraic fractions.',
          cheatFormula: '\\int u \\, dv = u v - \\int v \\, du',
        },
      },
      {
        label: 'One factor is the derivative of the inner function',
        description: 'For instance, 2x e^(x²) where 2x is the derivative of the exponent x²',
        exampleLatex: '\\int 2x e^{x^2} \\, dx',
        recommendation: {
          technique: 'Standard u-Substitution',
          topicId: 'u-substitution',
          explanation:
            'Set u = x² → du = 2x dx. The integral immediately collapses into ∫ e^u du.',
          cheatFormula: 'u = g(x) \\implies du = g\'(x)dx',
        },
      },
    ],
  },

  step_fractions: {
    id: 'step_fractions',
    question: 'Check the numerator and denominator of the fraction:',
    options: [
      {
        label: 'Numerator is the derivative of denominator',
        description: 'f\'(x) / f(x) pattern, e.g. 2x / (x² + 5)',
        exampleLatex: '\\int \\frac{2x}{x^2 + 5} \\, dx',
        recommendation: {
          technique: 'Reverse Chain Logarithm Pattern',
          topicId: 'reverse-chain-pattern',
          explanation:
            'Do not waste time doing long division or full u-sub. Any fraction of the form ∫ f\'(x)/f(x) dx is immediately ln|f(x)| + C!',
          cheatFormula: '\\int \\frac{f\'(x)}{f(x)} dx = \\ln|f(x)| + C',
        },
      },
      {
        label: 'Denominator is factorable into linear or quadratic terms',
        description: 'Denominator degree > Numerator degree, e.g. 1 / ((x-1)(x+2))',
        exampleLatex: '\\int \\frac{5x - 3}{(x - 3)(x + 1)} \\, dx',
        recommendation: {
          technique: 'Partial Fractions (Heaviside Cover-Up)',
          topicId: 'partial-fractions',
          explanation:
            'Factor the bottom and split into A/(x-3) + B/(x+1). Use the Heaviside cover-up trick to find A and B in 5 seconds!',
          cheatFormula: '\\frac{A}{x - r_1} + \\frac{B}{x - r_2}',
        },
      },
      {
        label: 'Numerator degree >= Denominator degree',
        description: 'Top power is greater than or equal to bottom power, e.g. (x³ + 1) / (x² - 4)',
        exampleLatex: '\\int \\frac{x^3 + 1}{x^2 - 4} \\, dx',
        recommendation: {
          technique: 'Polynomial Long Division FIRST, then Partial Fractions',
          topicId: 'partial-fractions',
          explanation:
            'Never attempt partial fractions on an improper rational fraction! Divide numerator by denominator first to extract a polynomial, then do partial fractions on the remainder.',
          cheatFormula: '\\frac{P(x)}{Q(x)} = \\text{Quotient}(x) + \\frac{\\text{Remainder}(x)}{Q(x)}',
        },
      },
      {
        label: 'Denominator is 1 / (a² + x²)',
        description: 'No x in numerator, pure sum of squares',
        exampleLatex: '\\int \\frac{1}{9 + x^2} \\, dx',
        recommendation: {
          technique: 'Direct Arc-Tangent Formula',
          topicId: 'trig-and-inverse-trig',
          explanation:
            'Direct standard form: ∫ 1/(a² + x²) dx = (1/a) arctan(x/a) + C. For 9 + x², a = 3, yielding (1/3) arctan(x/3) + C.',
          cheatFormula: '\\frac{1}{a} \\arctan\\left(\\frac{x}{a}\\right) + C',
        },
      },
    ],
  },

  step_trig: {
    id: 'step_trig',
    question: 'What type of trigonometric integral is it?',
    options: [
      {
        label: 'Powers of sine and cosine sinᵐ(x) cosⁿ(x)',
        description: 'At least one exponent is odd, or both are even',
        exampleLatex: '\\int \\sin^3 x \\cos^4 x \\, dx',
        recommendation: {
          technique: 'Powers of Trig (Odd/Even Rules)',
          topicId: 'powers-of-trig',
          explanation:
            'If sine power is odd, save sin(x)dx for du and let u = cos(x). If cosine power is odd, save cos(x)dx and let u = sin(x). If both are even, use half-angle formulas!',
          cheatFormula: '\\sin^2 x = 1 - \\cos^2 x \\quad \\text{or} \\quad \\frac{1 - \\cos(2x)}{2}',
        },
      },
      {
        label: 'Product of two different frequencies like sin(5x)cos(3x)',
        description: 'Different frequency constants m ≠ n inside the arguments',
        exampleLatex: '\\int \\sin(5x) \\cos(3x) \\, dx',
        recommendation: {
          technique: 'Product-to-Sum Identities',
          topicId: 'products-of-trig',
          explanation:
            'Use Product-to-Sum: sin(mx)cos(nx) = 1/2 [sin((m+n)x) + sin((m-n)x)]. Then integrate the two single sinusoids.',
          cheatFormula: '\\frac{1}{2}\\Big[ \\sin((m+n)x) + \\sin((m-n)x) \\Big]',
        },
      },
      {
        label: 'Rational fraction with trig functions in denominator',
        description: 'Integrals like 1 / (1 + sin x + cos x)',
        exampleLatex: '\\int \\frac{1}{1 + \\sin x + \\cos x} \\, dx',
        recommendation: {
          technique: 'Weierstrass Substitution (t = tan(x/2))',
          topicId: 'rational-trig-weierstrass',
          explanation:
            'The Universal Substitution! Convert sin(x) = 2t/(1+t²), cos(x) = (1-t²)/(1+t²), and dx = 2dt/(1+t²). It turns trig into standard algebra!',
          cheatFormula: 't = \\tan(x/2), \\, dx = \\frac{2}{1+t^2}dt',
        },
      },
      {
        label: 'Very high power or recursive form like sinⁿ(x) or (ln x)ⁿ',
        description: 'An integral parameterized by integer n',
        exampleLatex: '\\int \\sin^n x \\, dx \\quad \\text{or} \\quad \\int (\\ln x)^n \\, dx',
        recommendation: {
          technique: 'Reduction Formula (Recursive DP)',
          topicId: 'reduction-formulas',
          explanation:
            'Derive a recurrence relation expressing I(n) in terms of I(n - 1) or I(n - 2). Perfect for Dynamic Programming implementation in code!',
          cheatFormula: 'I_n = -\\frac{1}{n}\\sin^{n-1}x\\cos x + \\frac{n-1}{n}I_{n-2}',
        },
      },
    ],
  },
};

interface DecisionWizardProps {
  onSelectTopic: (topicId: string) => void;
}

export const DecisionWizard: React.FC<DecisionWizardProps> = ({ onSelectTopic }) => {
  const [currentStepId, setCurrentStepId] = useState<string>('start');
  const [history, setHistory] = useState<string[]>([]);
  const [result, setResult] = useState<any | null>(null);

  const currentStep = DECISION_TREE[currentStepId] || DECISION_TREE['start'];

  const handleOptionClick = (option: any) => {
    if (option.recommendation) {
      setResult(option.recommendation);
    } else if (option.nextStepId) {
      setHistory((prev) => [...prev, currentStepId]);
      setCurrentStepId(option.nextStepId);
    }
  };

  const handleReset = () => {
    setCurrentStepId('start');
    setHistory([]);
    setResult(null);
  };

  const handleBack = () => {
    if (result) {
      setResult(null);
      return;
    }
    if (history.length > 0) {
      const prevStep = history[history.length - 1];
      setHistory((prev) => prev.slice(0, prev.length - 1));
      setCurrentStepId(prevStep);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <GitBranch className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-semibold text-lg text-slate-100">
              Integral Strategy Diagnoser (Decision Wizard)
            </h3>
            <p className="text-xs text-slate-400">
              Answer 1-2 questions about what your integrand looks like to find the exact optimal method
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Start Over
        </button>
      </div>

      {!result ? (
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-indigo-300 font-mono">
              QUESTION: {currentStep.question}
            </h4>
            {history.length > 0 && (
              <button
                onClick={handleBack}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                ← Back
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentStep.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(opt)}
                className="text-left bg-slate-950/70 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-500/60 p-4 rounded-xl transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-semibold text-sm text-slate-200 group-hover:text-indigo-200">
                      {opt.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{opt.description}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono uppercase">e.g.</span>
                  <MathView math={opt.exampleLatex} className="text-xs text-cyan-300 font-mono" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-5 bg-indigo-950/20 border border-indigo-500/40 rounded-xl p-6 animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4" /> Recommended Technique Found
          </div>

          <h3 className="text-xl font-bold text-slate-100">{result.technique}</h3>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">{result.explanation}</p>

          <div className="mt-4 bg-slate-950/90 border border-slate-800 rounded-lg p-3">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Primary Formula / Mental Model:
            </span>
            <MathView math={result.cheatFormula} block className="text-indigo-300 text-base" />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => onSelectTopic(result.topicId)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
            >
              Open Topic Lesson & Worked Examples <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium px-3.5 py-2 rounded-lg"
            >
              Diagnose Another Integral
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
