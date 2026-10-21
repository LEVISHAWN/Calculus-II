import { Topic } from '../types';

export const TOPICS: Topic[] = [
  {
    id: 'basic-integration',
    order: 1,
    title: 'Basic Integration & The Accumulator Model',
    shortTitle: 'Basic Integration',
    category: 'Foundations',
    icon: 'Sigma',
    tagline: 'Integration is just a continuous for-loop accumulating infinitesimal delta chunks',
    intuitiveExplanation:
      'In basic programming, if you have a variable rate of change (like network speed or packet arrival rate) and want to find the total data transferred, you write a loop summing rate[i] * dt. Integration is the exact same loop, where the time step dt becomes infinitesimally small (dx -> 0) and the sum symbol Σ stretches into the integral symbol ∫. The fundamental theorem says: differentiation takes a total metric and tells you its instant rate; integration takes an instant rate and recovers the net accumulator.',
    csAnalogy:
      'Think of finding total server bandwidth: totalBytes = sum(rate(t) * dt). An antiderivative F(x) is essentially a closed-form formula for a Prefix Sum array. Instead of iterating O(N) additions, F(b) - F(a) gives you range sum queries in O(1) time!',
    keyFormulas: [
      {
        label: 'Power Rule (n ≠ -1)',
        latex: '\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C',
        notes: 'Increment the exponent by 1, then divide by the new exponent.',
      },
      {
        label: 'Constant Rule',
        latex: '\\int k \\, dx = kx + C',
        notes: 'Accumulating a constant rate k over an interval dx.',
      },
      {
        label: 'Linearity (Distribution)',
        latex: '\\int (a f(x) + b g(x)) \\, dx = a \\int f(x)\\,dx + b \\int g(x)\\,dx',
        notes: 'Integrals respect linear combinations, identical to linear mappings in vector spaces.',
      },
      {
        label: 'Definite Range Query (FTC)',
        latex: '\\int_a^b f(x) \\, dx = F(b) - F(a)',
        notes: 'Equivalent to prefixSum[b] - prefixSum[a] in competitive programming.',
      },
    ],
    interactiveTool: 'riemann',
    workedExamples: [
      {
        id: 'ex-basic-1',
        title: 'Integrating a Polynomial Profile',
        problemLatex: '\\int (6x^3 - 4x^2 + 7x - 5) \\, dx',
        difficulty: 'Beginner',
        csContext: 'Computing total CPU cycles when clock frequency ramps up following a cubic curve.',
        steps: [
          {
            title: 'Step 1: Distribute by linearity',
            mathExplanation: '6 \\int x^3 \\, dx - 4 \\int x^2 \\, dx + 7 \\int x \\, dx - 5 \\int 1 \\, dx',
            csAnalogy: 'Splitting independent loop tasks.',
          },
          {
            title: 'Step 2: Apply the Power Rule to each term',
            mathExplanation: '6\\left(\\frac{x^4}{4}\\right) - 4\\left(\\frac{x^3}{3}\\right) + 7\\left(\\frac{x^2}{2}\\right) - 5x + C',
            csAnalogy: 'Increase exponent power by 1, divide by that number.',
          },
          {
            title: 'Step 3: Simplify the coefficients',
            mathExplanation: '\\frac{3}{2}x^4 - \\frac{4}{3}x^3 + \\frac{7}{2}x^2 - 5x + C',
          },
        ],
        finalAnswer: '\\frac{3}{2}x^4 - \\frac{4}{3}x^3 + \\frac{7}{2}x^2 - 5x + C',
        verificationTip: 'Differentiate each term: d/dx(3/2 x^4) = 6x^3. It perfectly matches!',
      },
      {
        id: 'ex-basic-2',
        title: 'Handling Negative and Fractional Exponents',
        problemLatex: '\\int \\left(\\frac{3}{\\sqrt{x}} + \\frac{2}{x^3}\\right) \\, dx',
        difficulty: 'Beginner',
        steps: [
          {
            title: 'Step 1: Rewrite into index form x^n',
            mathExplanation: '\\int (3x^{-1/2} + 2x^{-3}) \\, dx',
            details: 'Always convert square roots and denominators into negative or fractional powers before integrating.',
          },
          {
            title: 'Step 2: Apply power rule to -1/2 and -3',
            mathExplanation: '3\\left(\\frac{x^{1/2}}{1/2}\\right) + 2\\left(\\frac{x^{-2}}{-2}\\right) + C = 6\\sqrt{x} - \\frac{1}{x^2} + C',
          },
        ],
        finalAnswer: '6\\sqrt{x} - \\frac{1}{x^2} + C',
      },
    ],
    pitfalls: [
      {
        badLatex: '\\int x^{-1} \\, dx = \\frac{x^0}{0} + C',
        goodLatex: '\\int \\frac{1}{x} \\, dx = \\ln|x| + C',
        mistake: 'Using the power rule when n = -1',
        whyItHappens: 'Dividing by zero is undefined! The power rule explicitly has an exception at n = -1.',
        howToPrevent: 'Whenever you see 1/x, flag it immediately as natural logarithm ln|x|.',
      },
      {
        badLatex: '\\int f(x)g(x) \\, dx = \\int f(x)dx \\cdot \\int g(x)dx',
        goodLatex: '\\text{Use Integration by Parts or Substitution}',
        mistake: 'Multiplying integrals together',
        whyItHappens: 'Integrals do NOT distribute over multiplication, just like derivatives do not distribute over multiplication.',
        howToPrevent: 'Check for products! Use substitution, parts, or algebraic expansion.',
      },
    ],
    csApplication: {
      domain: 'Performance Profiling',
      title: 'Prefix Sums & Numerical Accumulator Loop',
      description:
        'A Riemann sum in numerical analysis is literally a reduction loop with step delta. In algorithms, prefix sums allow range sum queries in O(1) time, mirroring the Fundamental Theorem of Calculus.',
      formulaLatex: '\\int_a^b f(t) dt \\approx \\sum_{i=0}^{N-1} f(a + i \\Delta t) \\Delta t',
      codeLanguage: 'typescript',
      codeSnippet: `// Numerical integration: Left Riemann Sum
function integrateRiemann(f: (x: number) => number, a: number, b: number, steps: number = 1000): number {
  const dx = (b - a) / steps;
  let accumulator = 0;
  for (let i = 0; i < steps; i++) {
    const x = a + i * dx;
    accumulator += f(x) * dx;
  }
  return accumulator;
}

// Example: Integrate 3x^2 from 0 to 2 (Exact = 2^3 = 8)
console.log(integrateRiemann(x => 3 * x * x, 0, 2, 10000)); // ≈ 7.9988`,
    },
    quickCheckQuestion: {
      question: 'What is the indefinite integral of 4x^3 - 3x^2 + 1?',
      options: ['x^4 - x^3 + x + C', '12x^2 - 6x + C', 'x^4 - x^3 + C', '4x^4 - 3x^3 + x + C'],
      correctIndex: 0,
      explanationLatex: '\\int (4x^3 - 3x^2 + 1)dx = 4(x^4/4) - 3(x^3/3) + x + C = x^4 - x^3 + x + C',
    },
  },

  {
    id: 'trig-and-inverse-trig',
    order: 2,
    title: 'Trigonometric & Inverse Trigonometric Functions',
    shortTitle: 'Trig & Inverse Trig',
    category: 'Algebraic & Trig Forms',
    icon: 'Compass',
    tagline: 'Mastering periodic oscillations, angles, and arc-tangent kernel transformations',
    intuitiveExplanation:
      'In computer graphics and game physics, game entities rotate, oscillate, and compute angles between vectors. Trigonometric derivatives and integrals are cyclical pairs. When integrating trig functions, remember the signs flip carefully: derivative of cos is -sin, so integral of sin is -cos! Inverse trig integrals are special because their derivatives are algebraic fractions without any trig in them — making them the gateway to integrating rational fractions.',
    csAnalogy:
      'In 3D graphics and camera controllers, arctan2(y, x) is used to find angles. The integral that creates arctan, namely ∫ 1/(1+x²) dx, appears everywhere in shader blur kernels, Cauchy distributions, and neural activation normalizations.',
    keyFormulas: [
      {
        label: 'Basic Sine & Cosine',
        latex: '\\int \\sin x \\, dx = -\\cos x + C, \\quad \\int \\cos x \\, dx = \\sin x + C',
        notes: 'Notice the minus sign on the cosine result!',
      },
      {
        label: 'Secant Squared',
        latex: '\\int \\sec^2 x \\, dx = \\tan x + C',
        notes: 'Since d/dx(tan x) = sec^2(x).',
      },
      {
        label: 'Secant & Tangent Product',
        latex: '\\int \\sec x \\tan x \\, dx = \\sec x + C',
        notes: 'Common building block for trig substitutions.',
      },
      {
        label: 'Standard Arc-tangent Form',
        latex: '\\int \\frac{1}{a^2 + x^2} \\, dx = \\frac{1}{a} \\arctan\\left(\\frac{x}{a}\\right) + C',
        notes: 'CRUCIAL: Do not forget the 1/a factor outside!',
      },
      {
        label: 'Standard Arc-sine Form',
        latex: '\\int \\frac{1}{\\sqrt{a^2 - x^2}} \\, dx = \\arcsin\\left(\\frac{x}{a}\\right) + C',
        notes: 'Note: There is NO 1/a factor in front of arcsin!',
      },
    ],
    workedExamples: [
      {
        id: 'ex-trig-1',
        title: 'Integral Leading to Arctan with Scaling Factor',
        problemLatex: '\\int \\frac{1}{9 + 4x^2} \\, dx',
        difficulty: 'Intermediate',
        csContext: 'Used in normalization constants for Lorentzian window filters in audio processing.',
        steps: [
          {
            title: 'Step 1: Identify standard form 1/(a^2 + u^2)',
            mathExplanation: '9 = 3^2, \\quad 4x^2 = (2x)^2. \\quad \\text{So } a = 3, u = 2x.',
          },
          {
            title: 'Step 2: Differentiate u to find dx',
            mathExplanation: 'u = 2x \\implies du = 2 \\, dx \\implies dx = \\frac{du}{2}',
          },
          {
            title: 'Step 3: Substitute and evaluate',
            mathExplanation: '\\frac{1}{2} \\int \\frac{1}{3^2 + u^2} \\, du = \\frac{1}{2} \\cdot \\frac{1}{3} \\arctan\\left(\\frac{u}{3}\\right) + C = \\frac{1}{6} \\arctan\\left(\\frac{2x}{3}\\right) + C',
          },
        ],
        finalAnswer: '\\frac{1}{6} \\arctan\\left(\\frac{2x}{3}\\right) + C',
        verificationTip: 'd/dx(1/6 arctan(2x/3)) = (1/6) * (1 / (1 + 4x^2/9)) * (2/3) = 1/(9 + 4x^2). Matches!',
      },
      {
        id: 'ex-trig-2',
        title: 'Integral Leading to Arcsin',
        problemLatex: '\\int \\frac{1}{\\sqrt{25 - x^2}} \\, dx',
        difficulty: 'Beginner',
        steps: [
          {
            title: 'Step 1: Match with a^2 - x^2',
            mathExplanation: 'a^2 = 25 \\implies a = 5',
          },
          {
            title: 'Step 2: Direct formula evaluation',
            mathExplanation: '\\int \\frac{1}{\\sqrt{5^2 - x^2}} \\, dx = \\arcsin\\left(\\frac{x}{5}\\right) + C',
          },
        ],
        finalAnswer: '\\arcsin\\left(\\frac{x}{5}\\right) + C',
      },
    ],
    pitfalls: [
      {
        badLatex: '\\int \\frac{1}{\\sqrt{a^2 - x^2}} \\, dx = \\frac{1}{a} \\arcsin(x/a) + C',
        goodLatex: '\\int \\frac{1}{\\sqrt{a^2 - x^2}} \\, dx = \\arcsin(x/a) + C',
        mistake: 'Adding an unnecessary 1/a in front of arcsin',
        whyItHappens: 'Students confuse the arctan formula (which has 1/a) with the arcsin formula (which does not).',
        howToPrevent: 'Remember: Arctan has 1/a outside. Arcsin does NOT have 1/a outside!',
      },
      {
        badLatex: '\\int \\sin(3x) \\, dx = -\\cos(3x) + C',
        goodLatex: '\\int \\sin(3x) \\, dx = -\\frac{1}{3}\\cos(3x) + C',
        mistake: 'Forgetting the chain rule coefficient 1/k',
        whyItHappens: 'Forgetting that when inner function is kx, dx requires dividing by k.',
        howToPrevent: 'Always divide by the derivative of the linear interior term: ∫ sin(kx)dx = -1/k cos(kx).',
      },
    ],
    csApplication: {
      domain: 'Computer Graphics & Shaders',
      title: 'Smooth Tone Mapping & Arc-tangent Color Curves',
      description:
        'In GLSL shaders, arctan is widely used for High Dynamic Range (HDR) tonemapping because it smoothly compresses infinite brightness [0, ∞) down to [0, π/2), preventing harsh color clipping.',
      formulaLatex: '\\text{Color}_{\\text{LDR}} = \\frac{2}{\\pi} \\arctan(\\text{Color}_{\\text{HDR}})',
      codeLanguage: 'typescript',
      codeSnippet: `// GLSL shader tonemapping logic in TypeScript
function tonemapArctan(hdrLuminance: number): number {
  // Compresses any arbitrary high light value into [0, 1]
  return (2 / Math.PI) * Math.atan(hdrLuminance);
}

console.log(tonemapArctan(0.5));  // 0.29
console.log(tonemapArctan(10.0)); // 0.93
console.log(tonemapArctan(1000)); // 0.9993 (never overflows!)`,
    },
    quickCheckQuestion: {
      question: 'What is the integral of 1 / (16 + x^2)?',
      options: ['1/4 arctan(x/4) + C', 'arctan(x/4) + C', '1/16 arctan(x/16) + C', 'arcsin(x/4) + C'],
      correctIndex: 0,
      explanationLatex: '\\int \\frac{1}{4^2 + x^2}dx = \\frac{1}{4} \\arctan\\left(\\frac{x}{4}\\right) + C',
    },
  },

  {
    id: 'exponents-and-logarithms',
    order: 3,
    title: 'Exponentials & Logarithmic Forms',
    shortTitle: 'Exponentials & Logs',
    category: 'Foundations',
    icon: 'Activity',
    tagline: 'Modeling growth, memory decay, amortized algorithms, and Poisson queue wait times',
    intuitiveExplanation:
      'The exponential e^x is the only mathematical function whose instantaneous rate of change is strictly identical to its current value. When integrating e^(kx), you simply divide by k. For arbitrary bases a^x (like 2^x in binary systems), you divide by ln(a). The logarithm integral ∫ 1/x dx = ln|x| bridges the singular gap in the power rule when n = -1.',
    csAnalogy:
      'In distributed systems, exponential backoff (retry delay = 2^k) and radioactive cache expiration follow exponential decay. In algorithms, the harmonic series sum(1/i) is bounded by ∫ (1/x) dx = ln(n), which proves why Quicksort average comparisons is O(n log n)!',
    keyFormulas: [
      {
        label: 'Natural Exponential',
        latex: '\\int e^{kx} \\, dx = \\frac{1}{k} e^{kx} + C',
        notes: 'Invariant under calculus up to constant scaling factor k.',
      },
      {
        label: 'General Base a > 0',
        latex: '\\int a^x \\, dx = \\frac{a^x}{\\ln a} + C',
        notes: 'In CS with base 2: ∫ 2^x dx = 2^x / ln(2).',
      },
      {
        label: 'Natural Log Reciprocal',
        latex: '\\int \\frac{1}{x} \\, dx = \\ln|x| + C',
        notes: 'Crucial: Absolute value bars are strictly required for x < 0.',
      },
    ],
    workedExamples: [
      {
        id: 'ex-exp-1',
        title: 'Integral of Base 2 Exponential in Algorithm Sizing',
        problemLatex: '\\int 2^{3x} \\, dx',
        difficulty: 'Beginner',
        csContext: 'Used when estimating continuous state-space explosion in branching trees.',
        steps: [
          {
            title: 'Step 1: Rewrite using chain rule or u-substitution',
            mathExplanation: 'u = 3x \\implies du = 3 \\, dx \\implies dx = \\frac{du}{3}',
          },
          {
            title: 'Step 2: Apply the general exponential rule',
            mathExplanation: '\\frac{1}{3} \\int 2^u \\, du = \\frac{1}{3} \\frac{2^u}{\\ln 2} + C = \\frac{2^{3x}}{3 \\ln 2} + C',
          },
        ],
        finalAnswer: '\\frac{2^{3x}}{3 \\ln 2} + C',
      },
      {
        id: 'ex-exp-2',
        title: 'Definite Integral of Server Cooling Exponential Decay',
        problemLatex: '\\int_0^4 5 e^{-0.5t} \\, dt',
        difficulty: 'Intermediate',
        csContext: 'Measuring total heat dissipation over 4 milliseconds in an overclocked chip.',
        steps: [
          {
            title: 'Step 1: Find antiderivative',
            mathExplanation: '\\int 5 e^{-0.5t} \\, dt = 5 \\left(\\frac{e^{-0.5t}}{-0.5}\\right) = -10 e^{-0.5t}',
          },
          {
            title: 'Step 2: Evaluate definite limits from 0 to 4',
            mathExplanation: '[-10 e^{-0.5(4)}] - [-10 e^{0}] = -10 e^{-2} - (-10) = 10(1 - e^{-2}) \\approx 8.647',
          },
        ],
        finalAnswer: '10(1 - e^{-2}) \\approx 8.647',
      },
    ],
    pitfalls: [
      {
        badLatex: '\\int \\frac{1}{3x + 5} \\, dx = \\ln|3x + 5| + C',
        goodLatex: '\\int \\frac{1}{3x + 5} \\, dx = \\frac{1}{3} \\ln|3x + 5| + C',
        mistake: 'Forgetting 1/3 when the denominator has a linear coefficient',
        whyItHappens: 'People immediately jump to ln without accounting for du = 3 dx.',
        howToPrevent: 'Notice the derivative of the denominator is 3, so multiply and divide by 3 first.',
      },
      {
        badLatex: '\\int 2^x \\, dx = 2^x \\ln 2 + C',
        goodLatex: '\\int 2^x \\, dx = \\frac{2^x}{\\ln 2} + C',
        mistake: 'Multiplying by ln(a) instead of dividing',
        whyItHappens: 'Derivative has multiplication d/dx(a^x) = a^x ln(a); integration is inverse, so it DIVIDES.',
        howToPrevent: 'Integration undoes differentiation: multiply in derivative -> divide in integral.',
      },
    ],
    csApplication: {
      domain: 'Cloud Infrastructure & SRE',
      title: 'Poisson Distribution & Continuous Server Queue Wait Time',
      description:
        'The cumulative probability of a server request arriving before time T with arrival rate λ follows an exponential distribution: P(t ≤ T) = ∫_0^T λ e^(-λ t) dt = 1 - e^(-λ T).',
      formulaLatex: 'P(t \\le T) = \\int_0^T \\lambda e^{-\\lambda t} \\, dt = 1 - e^{-\\lambda T}',
      codeLanguage: 'typescript',
      codeSnippet: `// SRE: Compute probability that incoming request arrives within timeout
function requestArrivalProb(lambdaRate: number, timeoutSec: number): number {
  // Derived via integral of lambda * exp(-lambda * t)
  return 1 - Math.exp(-lambdaRate * timeoutSec);
}

// 5 requests per second; probability of receiving a request in 0.5s:
console.log(requestArrivalProb(5, 0.5)); // 0.9179 (91.8% chance)`,
    },
    quickCheckQuestion: {
      question: 'What is the indefinite integral of 7 e^(4x)?',
      options: ['(7/4) e^(4x) + C', '28 e^(4x) + C', '7 e^(4x) + C', '(4/7) e^(4x) + C'],
      correctIndex: 0,
      explanationLatex: '\\int 7 e^{4x} dx = 7 \\cdot \\frac{e^{4x}}{4} + C = \\frac{7}{4}e^{4x} + C',
    },
  },

  {
    id: 'reverse-chain-pattern',
    order: 4,
    title: 'The Reverse Chain Rule: f(x)^n f\'(x) & f\'(x)/f(x)',
    shortTitle: 'Pattern Recognition Form',
    category: 'Algebraic & Trig Forms',
    icon: 'Zap',
    tagline: 'Instant O(1) pattern matching: recognize when a derivative is already waiting for you',
    intuitiveExplanation:
      'In compilers, pattern-matching transforms code in a single AST pass without allocating overhead. In integration, many expressions that look intimidating already contain their own inner derivative! If you see [f(x)]^n multiplied by f\'(x), you can integrate immediately into [f(x)]^(n+1)/(n+1). Similarly, whenever the numerator is the derivative of the denominator, the answer is immediately ln|denominator|.',
    csAnalogy:
      'Like a regex matching a captured token: pattern f\'(x)/f(x) instantly compiles to ln|f(x)| without the multi-line boilerplate of full u-substitution.',
    keyFormulas: [
      {
        label: 'Power Form Pattern',
        latex: '\\int [f(x)]^n f\'(x) \\, dx = \\frac{[f(x)]^{n+1}}{n+1} + C \\quad (n \\ne -1)',
        notes: 'The f\'(x) factor is absorbed completely by dx.',
      },
      {
        label: 'Logarithmic Quotient Pattern',
        latex: '\\int \\frac{f\'(x)}{f(x)} \\, dx = \\ln|f(x)| + C',
        notes: 'Any fraction where numerator is derivative of denominator gives natural log.',
      },
      {
        label: 'Exponential Factor Pattern',
        latex: '\\int e^{f(x)} f\'(x) \\, dx = e^{f(x)} + C',
        notes: 'Immediate evaluation when exponent derivative is adjacent.',
      },
    ],
    workedExamples: [
      {
        id: 'ex-rc-1',
        title: 'Integral of Tangent as a Quotient Pattern',
        problemLatex: '\\int \\tan x \\, dx = \\int \\frac{\\sin x}{\\cos x} \\, dx',
        difficulty: 'Beginner',
        steps: [
          {
            title: 'Step 1: Check derivative of denominator',
            mathExplanation: 'f(x) = \\cos x \\implies f\'(x) = -\\sin x',
            details: 'The numerator has sin(x). We just need a minus sign!',
          },
          {
            title: 'Step 2: Balance the constant factor',
            mathExplanation: '-\\int \\frac{-\\sin x}{\\cos x} \\, dx = -\\ln|\\cos x| + C',
          },
          {
            title: 'Step 3: Simplify using log identity',
            mathExplanation: '-\\ln|\\cos x| = \\ln|(\\cos x)^{-1}| = \\ln|\\sec x| + C',
          },
        ],
        finalAnswer: '\\ln|\\sec x| + C',
      },
      {
        id: 'ex-rc-2',
        title: 'Power Pattern with Polynomial Base',
        problemLatex: '\\int (x^3 + 2)^5 \\cdot 3x^2 \\, dx',
        difficulty: 'Beginner',
        steps: [
          {
            title: 'Step 1: Inspect the two pieces',
            mathExplanation: 'f(x) = x^3 + 2, \\quad f\'(x) = 3x^2',
          },
          {
            title: 'Step 2: Apply the pattern rule directly',
            mathExplanation: '\\int [f(x)]^5 f\'(x) \\, dx = \\frac{[f(x)]^6}{6} + C = \\frac{(x^3 + 2)^6}{6} + C',
          },
        ],
        finalAnswer: '\\frac{(x^3 + 2)^6}{6} + C',
      },
    ],
    pitfalls: [
      {
        badLatex: '\\int \\frac{x}{x^2 + 1} \\, dx = \\ln|x^2 + 1| + C',
        goodLatex: '\\int \\frac{x}{x^2 + 1} \\, dx = \\frac{1}{2}\\ln(x^2 + 1) + C',
        mistake: 'Forgetting the 1/2 balancing factor',
        whyItHappens: 'The derivative of x^2 + 1 is 2x, not x. You must supply a 1/2 outside the integral.',
        howToPrevent: 'Always write out f\'(x) and see what missing constant scalar you must compensate for.',
      },
    ],
    csApplication: {
      domain: 'Compiler AST Optimization',
      title: 'Pattern Matching Rules in Symbolic Math Engines',
      description:
        'Compilers and CAS engines (like SymPy or Mathematica) execute rewrite rules by detecting f\'(x)/f(x) in the Abstract Syntax Tree (AST) before falling back to heavy algorithmic Risch integration.',
      formulaLatex: '\\text{PatternMatch}(\\text{Div}(u\', u)) \\to \\text{Log}(u)',
      codeLanguage: 'typescript',
      codeSnippet: `// Minimal AST pattern matcher for f'(x) / f(x)
interface ASTNode { type: 'div' | 'power' | 'var'; left?: any; right?: any; }

function tryInstantIntegral(numerator: string, denominator: string): string | null {
  // If numerator is the exact derivative of denominator:
  if (numerator === "2x" && denominator === "x^2 + 1") {
    return "ln(x^2 + 1) + C"; // Instant O(1) simplification!
  }
  return null; // Fall back to general substitution
}

console.log(tryInstantIntegral("2x", "x^2 + 1")); // ln(x^2 + 1) + C`,
    },
    quickCheckQuestion: {
      question: 'Evaluate ∫ 2x / (x^2 + 9) dx:',
      options: ['ln(x^2 + 9) + C', '(1/2) ln(x^2 + 9) + C', 'arctan(x/3) + C', '2 ln(x^2 + 9) + C'],
      correctIndex: 0,
      explanationLatex: '\\text{Since } d/dx(x^2+9) = 2x, \\int \\frac{2x}{x^2+9}dx = \\ln(x^2+9) + C',
    },
  },

  {
    id: 'u-substitution',
    order: 5,
    title: 'The Substitution Method (u-Substitution)',
    shortTitle: 'u-Substitution',
    category: 'Core Techniques',
    icon: 'Shuffle',
    tagline: 'Transforming complex coordinate spaces into clean, trivial linear forms',
    intuitiveExplanation:
      'Substitution is the Chain Rule running in reverse. In software engineering, when a function takes complex convoluted arguments, you create an intermediate helper variable `const u = ...` to simplify the logic. In calculus, when an integral looks messy, picking a smart substitution `u = g(x)` collapses the expression into a standard elementary integral. The only rule is: every single trace of x must be converted into u, including the differential dx!',
    csAnalogy:
      'Coordinate Space Transforms in 3D Graphics: Transforming vertices from World Space to View/Camera Space so lighting computations become trivial, then transforming the final result back.',
    keyFormulas: [
      {
        label: 'u-Substitution Theorem',
        latex: '\\int f(g(x)) g\'(x) \\, dx = \\int f(u) \\, du \\quad \\text{where } u = g(x), \\, du = g\'(x)dx',
        notes: 'Replace both the expression and the differential element.',
      },
      {
        label: 'Definite Integral Limits Transformation',
        latex: '\\int_a^b f(g(x)) g\'(x) \\, dx = \\int_{g(a)}^{g(b)} f(u) \\, du',
        notes: 'Change limits to u-values and you NEVER need to switch back to x!',
      },
      {
        label: 'Linear Shift Shortcut',
        latex: '\\int f(ax + b) \\, dx = \\frac{1}{a} F(ax + b) + C',
        notes: 'For linear inner terms, always divide by the slope a.',
      },
    ],
    workedExamples: [
      {
        id: 'ex-usub-1',
        title: 'Integral with Radical Inner Term',
        problemLatex: '\\int x \\sqrt{2x^2 + 5} \\, dx',
        difficulty: 'Beginner',
        csContext: 'Computing particle velocity under a quadratic potential field.',
        steps: [
          {
            title: 'Step 1: Pick u as the messy expression inside the radical',
            mathExplanation: 'u = 2x^2 + 5',
          },
          {
            title: 'Step 2: Differentiate to find du and solve for x dx',
            mathExplanation: 'du = 4x \\, dx \\implies x \\, dx = \\frac{du}{4}',
          },
          {
            title: 'Step 3: Substitute everything into u',
            mathExplanation: '\\int \\sqrt{u} \\cdot \\frac{du}{4} = \\frac{1}{4} \\int u^{1/2} \\, du',
          },
          {
            title: 'Step 4: Integrate using power rule',
            mathExplanation: '\\frac{1}{4} \\left( \\frac{u^{3/2}}{3/2} \\right) = \\frac{1}{4} \\cdot \\frac{2}{3} u^{3/2} = \\frac{1}{6} u^{3/2} + C',
          },
          {
            title: 'Step 5: Back-substitute u = 2x^2 + 5',
            mathExplanation: '\\frac{1}{6} (2x^2 + 5)^{3/2} + C',
          },
        ],
        finalAnswer: '\\frac{1}{6} (2x^2 + 5)^{3/2} + C',
      },
      {
        id: 'ex-usub-2',
        title: 'The "Back-Substitution" Trick when x remains',
        problemLatex: '\\int x(x - 3)^7 \\, dx',
        difficulty: 'Intermediate',
        steps: [
          {
            title: 'Step 1: Set u equal to the high-power term',
            mathExplanation: 'u = x - 3 \\implies x = u + 3 \\quad \\text{and} \\quad dx = du',
            details: 'Notice that we solved for x in terms of u!',
          },
          {
            title: 'Step 2: Substitute x and (x - 3)',
            mathExplanation: '\\int (u + 3) u^7 \\, du = \\int (u^8 + 3u^7) \\, du',
            details: 'Now expanding is trivial! We avoided having to expand (x-3)^7 via binomial theorem.',
          },
          {
            title: 'Step 3: Integrate and substitute back',
            mathExplanation: '\\frac{u^9}{9} + \\frac{3u^8}{8} + C = \\frac{(x - 3)^9}{9} + \\frac{3(x - 3)^8}{8} + C',
          },
        ],
        finalAnswer: '\\frac{(x - 3)^9}{9} + \\frac{3(x - 3)^8}{8} + C',
      },
    ],
    pitfalls: [
      {
        badLatex: '\\int_0^1 2x(x^2+1)^3 dx = \\left[ \\frac{u^4}{4} \\right]_0^1',
        goodLatex: '\\int_1^2 u^3 du = \\left[ \\frac{u^4}{4} \\right]_1^2',
        mistake: 'Using old x-limits on the new u-variable in definite integrals',
        whyItHappens: 'Forgetting that when x changes from 0 to 1, u changes from 0^2+1=1 to 1^2+1=2.',
        howToPrevent: 'Always convert limits immediately: u_lower = g(a), u_upper = g(b).',
      },
      {
        badLatex: 'du = 4x \\, dx \\implies dx = du',
        goodLatex: 'dx = \\frac{du}{4x}',
        mistake: 'Leaving x terms dangling after substituting du',
        whyItHappens: 'Rushing through differentials without isolating dx properly.',
        howToPrevent: 'Never leave mixed variables like ∫ x u du. Every variable must become u.',
      },
    ],
    csApplication: {
      domain: 'Computer Vision & Image Processing',
      title: 'Coordinate Warping & Kernel Rescaling',
      description:
        'When resizing an image texture or applying Gaussian blur with scale factor σ, a change of variables (substitution u = x/σ) normalizes the integral over the filter footprint.',
      formulaLatex: '\\int_{-\\infty}^\\infty e^{-(x/\\sigma)^2} dx \\xrightarrow{u = x/\\sigma} \\sigma \\int_{-\\infty}^\\infty e^{-u^2} du = \\sigma \\sqrt{\\pi}',
      codeLanguage: 'typescript',
      codeSnippet: `// Rescaling Gaussian filter weights using substitution principle
function gaussianWeight(x: number, sigma: number): number {
  const u = x / sigma; // u-substitution normalize
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * u * u);
}`,
    },
    quickCheckQuestion: {
      question: 'For ∫ x e^(x^2) dx, what is the best choice for u?',
      options: ['u = x^2', 'u = e^(x^2)', 'u = x', 'u = 2x'],
      correctIndex: 0,
      explanationLatex: '\\text{Choosing } u = x^2 \\implies du = 2x dx \\implies x dx = du/2, \\text{ yielding } \\frac{1}{2}\\int e^u du.',
    },
  },

  {
    id: 'powers-of-trig',
    order: 6,
    title: 'Powers of Trig Functions (Odd/Even Rules)',
    shortTitle: 'Powers of Trig',
    category: 'Algebraic & Trig Forms',
    icon: 'Layers',
    tagline: 'Deterministic algorithms to dismantle any product sin^m(x) cos^n(x) and sec^m(x) tan^n(x)',
    intuitiveExplanation:
      'Integrating powers of trigonometric functions is purely algorithmic! You inspect whether the powers are odd or even, then branch down a deterministic decision tree. If one power is odd, you save one factor for du and convert the rest using the Pythagorean identity sin²(x) + cos²(x) = 1. If both are even, you use double-angle half-angle formulas to halve the exponents.',
    csAnalogy:
      'Like an if-else decision tree in a parser: if (odd(power)) { peel_one_and_substitute(); } else { reduce_half_angle(); }',
    keyFormulas: [
      {
        label: 'Pythagorean Fundamental Identity',
        latex: '\\sin^2 x + \\cos^2 x = 1 \\implies \\sin^2 x = 1 - \\cos^2 x, \\, \\cos^2 x = 1 - \\sin^2 x',
        notes: 'Converts even powers back and forth between sine and cosine.',
      },
      {
        label: 'Half-Angle Double-Angle Identities (Both Even)',
        latex: '\\sin^2 x = \\frac{1 - \\cos(2x)}{2}, \\quad \\cos^2 x = \\frac{1 + \\cos(2x)}{2}',
        notes: 'Decreases powers of 2 into linear first-power cosines at double frequency.',
      },
      {
        label: 'Secant-Tangent Pythagorean Identity',
        latex: '1 + \\tan^2 x = \\sec^2 x \\implies \\tan^2 x = \\sec^2 x - 1',
        notes: 'Used for sec^m(x) tan^n(x) powers.',
      },
    ],
    workedExamples: [
      {
        id: 'ex-pow-1',
        title: 'Odd Power of Cosine: sin^2(x) cos^3(x)',
        problemLatex: '\\int \\sin^2 x \\cos^3 x \\, dx',
        difficulty: 'Intermediate',
        csContext: 'Used in wave interference computations in digital signal processing.',
        steps: [
          {
            title: 'Step 1: Save one cos(x) for du',
            mathExplanation: '\\int \\sin^2 x \\cos^2 x (\\cos x \\, dx)',
            details: 'Because the power of cosine (3) is odd, reserve cos(x) dx.',
          },
          {
            title: 'Step 2: Convert remaining cos^2(x) to sine',
            mathExplanation: '\\int \\sin^2 x (1 - \\sin^2 x) (\\cos x \\, dx)',
          },
          {
            title: 'Step 3: Substitute u = sin(x), du = cos(x) dx',
            mathExplanation: '\\int u^2 (1 - u^2) \\, du = \\int (u^2 - u^4) \\, du',
          },
          {
            title: 'Step 4: Integrate and back-substitute',
            mathExplanation: '\\frac{u^3}{3} - \\frac{u^5}{5} + C = \\frac{\\sin^3 x}{3} - \\frac{\\sin^5 x}{5} + C',
          },
        ],
        finalAnswer: '\\frac{\\sin^3 x}{3} - \\frac{\\sin^5 x}{5} + C',
      },
      {
        id: 'ex-pow-2',
        title: 'Both Powers Even: Integrating sin^2(x)',
        problemLatex: '\\int \\sin^2 x \\, dx',
        difficulty: 'Intermediate',
        steps: [
          {
            title: 'Step 1: Apply the half-angle identity',
            mathExplanation: '\\int \\frac{1 - \\cos(2x)}{2} \\, dx = \\frac{1}{2} \\int 1 \\, dx - \\frac{1}{2} \\int \\cos(2x) \\, dx',
          },
          {
            title: 'Step 2: Evaluate both components',
            mathExplanation: '\\frac{1}{2}x - \\frac{1}{2}\\left(\\frac{\\sin(2x)}{2}\\right) + C = \\frac{x}{2} - \\frac{\\sin(2x)}{4} + C',
          },
        ],
        finalAnswer: '\\frac{x}{2} - \\frac{\\sin(2x)}{4} + C',
      },
    ],
    pitfalls: [
      {
        badLatex: '\\int \\sin^2 x \\, dx = \\frac{\\sin^3 x}{3} + C',
        goodLatex: '\\int \\sin^2 x \\, dx = \\frac{x}{2} - \\frac{\\sin(2x)}{4} + C',
        mistake: 'Applying power rule directly to trig function without inner derivative',
        whyItHappens: 'Treating sin(x) as if it were a plain variable x when there is no cos(x) dx factor.',
        howToPrevent: 'Power rule only works if the derivative of the base function is present!',
      },
    ],
    csApplication: {
      domain: 'Audio Signal Processing & DSP',
      title: 'Power Spectral Density & Root-Mean-Square (RMS) Audio Energy',
      description:
        'To compute the RMS signal energy of an audio waveform over a period T, we integrate the square of the harmonic: RMS = sqrt( (1/T) ∫_0^T sin²(ω t) dt ) = 1/√2 ≈ 0.707 of peak amplitude.',
      formulaLatex: '\\frac{1}{2\\pi} \\int_0^{2\\pi} \\sin^2(\\omega t) \\, dt = \\frac{1}{2}',
      codeLanguage: 'typescript',
      codeSnippet: `// Compute true RMS energy of sine tone sampled discrete buffer
function computeRmsEnergy(samples: Float32Array): number {
  let sumSquares = 0;
  for (let i = 0; i < samples.length; i++) {
    sumSquares += samples[i] * samples[i];
  }
  // Discrete analogue to sqrt( (1/T) * integral sin^2(t) dt )
  return Math.sqrt(sumSquares / samples.length);
}`,
    },
    quickCheckQuestion: {
      question: 'When integrating sin^3(x) cos^4(x) dx, what is the best strategy?',
      options: [
        'Save one sin(x) for du, convert sin^2(x) to 1 - cos^2(x), let u = cos(x)',
        'Save one cos(x) for du, let u = sin(x)',
        'Use half-angle formulas on everything',
        'Integration by parts with u = sin^3(x)',
      ],
      correctIndex: 0,
      explanationLatex: '\\text{Because sine has the odd power (3), save } \\sin x dx \\text{ for } du = -\\sin x dx \\text{ and let } u = \\cos x.',
    },
  },

  {
    id: 'products-of-trig',
    order: 7,
    title: 'Products of Trig Functions (Product-to-Sum Formulas)',
    shortTitle: 'Products of Trig',
    category: 'Algebraic & Trig Forms',
    icon: 'Radio',
    tagline: 'The mathematical foundation of Fourier Transforms, audio synthesis, and JPEG compression',
    intuitiveExplanation:
      'What happens when you integrate products of sinusoids with different frequencies, like sin(5x) cos(3x)? You cannot use u-substitution because their frequencies do not match! The solution is the Product-to-Sum trigonometric identities. They convert a difficult multiplication into a simple sum of two individual sine or cosine waves with sum and difference frequencies (m + n) and (m - n).',
    csAnalogy:
      'This is literally Frequency Modulation (FM) and Heterodyning in software-defined radio and telecommunications! It is also why Fourier Series work: when m ≠ n, the integral of sin(mx)sin(nx) over [-π, π] is EXACTLY ZERO. This orthogonality is how JPEG and MP3 compress data into independent frequency bins.',
    keyFormulas: [
      {
        label: 'Sine × Cosine Product-to-Sum',
        latex: '\\sin(mx) \\cos(nx) = \\frac{1}{2}\\Big[ \\sin((m+n)x) + \\sin((m-n)x) \\Big]',
        notes: 'Split into sum and difference frequencies.',
      },
      {
        label: 'Cosine × Cosine Product-to-Sum',
        latex: '\\cos(mx) \\cos(nx) = \\frac{1}{2}\\Big[ \\cos((m-n)x) + \\cos((m+n)x) \\Big]',
        notes: 'Sum of two cosines.',
      },
      {
        label: 'Sine × Sine Product-to-Sum',
        latex: '\\sin(mx) \\sin(nx) = \\frac{1}{2}\\Big[ \\cos((m-n)x) - \\cos((m+n)x) \\Big]',
        notes: 'Notice the minus sign between the cosine terms!',
      },
      {
        label: 'Orthogonality Theorem (Fourier Basis)',
        latex: '\\int_{-\\pi}^{\\pi} \\sin(mx) \\sin(nx) \\, dx = \\begin{cases} 0 & m \\ne n \\\\ \\pi & m = n \\end{cases}',
        notes: 'Core foundation of Discrete Cosine Transform (DCT).',
      },
    ],
    workedExamples: [
      {
        id: 'ex-prod-1',
        title: 'Integrating Mixed Frequencies: sin(5x) cos(3x)',
        problemLatex: '\\int \\sin(5x) \\cos(3x) \\, dx',
        difficulty: 'Intermediate',
        csContext: 'Demodulating an AM radio signal with carrier and modulation frequencies.',
        steps: [
          {
            title: 'Step 1: Apply the Product-to-Sum identity',
            mathExplanation: '\\sin(5x) \\cos(3x) = \\frac{1}{2} [\\sin((5+3)x) + \\sin((5-3)x)] = \\frac{1}{2} [\\sin(8x) + \\sin(2x)]',
          },
          {
            title: 'Step 2: Integrate term by term',
            mathExplanation: '\\frac{1}{2} \\int (\\sin(8x) + \\sin(2x)) \\, dx = \\frac{1}{2} \\left( -\\frac{\\cos(8x)}{8} - \\frac{\\cos(2x)}{2} \\right) + C',
          },
          {
            title: 'Step 3: Distribute the 1/2 factor',
            mathExplanation: '-\\frac{\\cos(8x)}{16} - \\frac{\\cos(2x)}{4} + C',
          },
        ],
        finalAnswer: '-\\frac{\\cos(8x)}{16} - \\frac{\\cos(2x)}{4} + C',
      },
    ],
    pitfalls: [
      {
        badLatex: '\\sin(A)\\cos(B) = \\sin(A+B)',
        goodLatex: '\\sin(A)\\cos(B) = \\frac{1}{2}[\\sin(A+B) + \\sin(A-B)]',
        mistake: 'Forgetting the 1/2 factor and the difference term',
        whyItHappens: 'Confusing product-to-sum with angle addition identities.',
        howToPrevent: 'Always keep the 1/2 outside: Product-to-sum cuts the amplitude in half.',
      },
    ],
    csApplication: {
      domain: 'Data Compression & Image Processing',
      title: 'Orthogonality in JPEG Discrete Cosine Transform (DCT)',
      description:
        'JPEG compression divides an image into 8x8 blocks of pixels and projects them onto cosine basis functions. The integral of basis_i * basis_j is 0 when i != j, allowing zero-loss decomposition into frequencies.',
      formulaLatex: '\\sum_{x=0}^{7} f(x) \\cos\\left(\\frac{\\pi u (2x+1)}{16}\\right) \\longleftrightarrow \\int \\cos(mx)\\cos(nx)dx = 0',
      codeLanguage: 'typescript',
      codeSnippet: `// 1D Discrete Cosine Transform basis inner product
function verifyOrthogonality(freqM: number, freqN: number, nPoints: number = 1000): number {
  const dx = Math.PI / nPoints;
  let integral = 0;
  for (let i = 0; i < nPoints; i++) {
    const x = i * dx;
    integral += Math.cos(freqM * x) * Math.cos(freqN * x) * dx;
  }
  return Math.abs(integral) < 1e-4 ? 0 : integral;
}

console.log(verifyOrthogonality(2, 3)); // 0 (Orthogonal! Cross-talk is zero)
console.log(verifyOrthogonality(3, 3)); // ~1.57 (pi / 2, energy preserved)`,
    },
    quickCheckQuestion: {
      question: 'What is the value of ∫_{-π}^{π} sin(2x) sin(5x) dx?',
      options: ['0', 'π', '2π', '1/10'],
      correctIndex: 0,
      explanationLatex: '\\text{By the Orthogonality Theorem, when } m \\ne n (2 \\ne 5), \\text{ the integral over } [-\\pi, \\pi] \\text{ is identically } 0.',
    },
  },

  {
    id: 'integration-by-parts',
    order: 8,
    title: 'Integration by Parts & The LIATE Priority Queue',
    shortTitle: 'Integration by Parts',
    category: 'Core Techniques',
    icon: 'Split',
    tagline: 'Inverting the Product Rule using an optimal priority heuristic: ∫ u dv = uv - ∫ v du',
    intuitiveExplanation:
      'Integration by parts is simply the Product Rule of differentiation written in reverse. If you have an integral where two incompatible types of functions are multiplied together (e.g. polynomial × exponential, or polynomial × log), substitution fails. You split the problem into two parts: u (which you differentiate to make simpler) and dv (which you integrate). To pick u with 100% accuracy, computer science students use the LIATE priority heuristic.',
    csAnalogy:
      'LIATE is a Priority Queue for selecting `u`. Logarithmic functions are the highest priority (impossible to integrate directly, trivial to differentiate into 1/x), while Exponential functions are lowest priority (trivially absorbed into dv).',
    keyFormulas: [
      {
        label: 'Integration by Parts Master Formula',
        latex: '\\int u \\, dv = u v - \\int v \\, du',
        notes: 'uv product minus the swapped integral.',
      },
      {
        label: 'The LIATE Priority Order',
        latex: '\\mathbf{L} \\text{og} > \\mathbf{I} \\text{nverse Trig} > \\mathbf{A} \\text{lgebraic} > \\mathbf{T} \\text{rig} > \\mathbf{E} \\text{xponential}',
        notes: 'First function type in this list becomes u; the remainder is dv.',
      },
      {
        label: 'Definite Limits Form',
        latex: '\\int_a^b u \\, dv = \\Big[ u v \\Big]_a^b - \\int_a^b v \\, du',
        notes: 'Evaluate the uv boundary term at the limits immediately.',
      },
    ],
    workedExamples: [
      {
        id: 'ex-ibp-1',
        title: 'Classic Polynomial × Trig: ∫ x cos(x) dx',
        problemLatex: '\\int x \\cos x \\, dx',
        difficulty: 'Beginner',
        csContext: 'Appears in phase-modulated signal path integrations.',
        steps: [
          {
            title: 'Step 1: Consult LIATE priority',
            mathExplanation: 'x \\text{ is Algebraic (A)}, \\quad \\cos x \\text{ is Trig (T)}.\\\\ \\text{Since A comes before T in LIATE, } u = x \\text{ and } dv = \\cos x \\, dx.',
          },
          {
            title: 'Step 2: Differentiate u and integrate dv',
            mathExplanation: 'u = x \\implies du = dx, \\quad dv = \\cos x \\, dx \\implies v = \\sin x',
          },
          {
            title: 'Step 3: Apply the master formula',
            mathExplanation: '\\int x \\cos x \\, dx = u v - \\int v \\, du = x \\sin x - \\int \\sin x \\, dx',
          },
          {
            title: 'Step 4: Evaluate the remaining integral',
            mathExplanation: 'x \\sin x - (-\\cos x) + C = x \\sin x + \\cos x + C',
          },
        ],
        finalAnswer: 'x \\sin x + \\cos x + C',
      },
      {
        id: 'ex-ibp-2',
        title: 'The Hidden dv Trick: ∫ ln(x) dx',
        problemLatex: '\\int \\ln x \\, dx',
        difficulty: 'Intermediate',
        steps: [
          {
            title: 'Step 1: Set dv = 1 dx',
            mathExplanation: 'u = \\ln x \\implies du = \\frac{1}{x} \\, dx, \\quad dv = 1 \\, dx \\implies v = x',
            details: 'When only one function is present, let dv = dx!',
          },
          {
            title: 'Step 2: Substitute into formula',
            mathExplanation: 'u v - \\int v \\, du = x \\ln x - \\int x \\cdot \\frac{1}{x} \\, dx = x \\ln x - \\int 1 \\, dx',
          },
          {
            title: 'Step 3: Final simplification',
            mathExplanation: 'x \\ln x - x + C = x(\\ln x - 1) + C',
          },
        ],
        finalAnswer: 'x \\ln x - x + C',
      },
      {
        id: 'ex-ibp-3',
        title: 'The Looping / Cyclic Integral: ∫ e^x cos(x) dx',
        problemLatex: '\\int e^x \\cos x \\, dx',
        difficulty: 'Advanced',
        steps: [
          {
            title: 'Step 1: First Parts Pass',
            mathExplanation: 'u = \\cos x \\implies du = -\\sin x dx, \\quad dv = e^x dx \\implies v = e^x\\\\ I = e^x \\cos x + \\int e^x \\sin x \\, dx',
          },
          {
            title: 'Step 2: Second Parts Pass on the remaining integral',
            mathExplanation: 'u = \\sin x \\implies du = \\cos x dx, \\quad dv = e^x dx \\implies v = e^x\\\\ \\int e^x \\sin x dx = e^x \\sin x - \\int e^x \\cos x dx = e^x \\sin x - I',
          },
          {
            title: 'Step 3: Solve algebraically for I (Loop closed!)',
            mathExplanation: 'I = e^x \\cos x + e^x \\sin x - I \\implies 2I = e^x(\\cos x + \\sin x) \\implies I = \\frac{e^x(\\sin x + \\cos x)}{2} + C',
          },
        ],
        finalAnswer: '\\frac{e^x(\\sin x + \\cos x)}{2} + C',
      },
    ],
    pitfalls: [
      {
        badLatex: 'u = \\cos x, \\quad dv = x dx \\implies \\int x \\cos x dx = \\frac{x^2}{2}\\cos x + \\int \\frac{x^2}{2}\\sin x dx',
        goodLatex: 'u = x, \\quad dv = \\cos x dx \\implies x\\sin x + \\cos x + C',
        mistake: 'Picking the wrong choice of u and making the integral harder',
        whyItHappens: 'If you integrate x instead of differentiating it, the power grows from x to x^2, digging you deeper into recursion.',
        howToPrevent: 'Follow LIATE strictly! The goal of u is to simplify when differentiated.',
      },
    ],
    csApplication: {
      domain: 'Analysis of Algorithms',
      title: 'Continuous Recurrence Relations & Stirling\'s Approximation',
      description:
        'In compiler design and Big-O analysis, factorials n! are approximated using Stirling\'s Formula: n! = ∫_0^∞ x^n e^(-x) dx. Solving this continuous integral requires repeated Integration by Parts, yielding the recurrence Γ(n+1) = n Γ(n).',
      formulaLatex: 'n! = \\int_0^\\infty x^n e^{-x} \\, dx = \\Big[ -x^n e^{-x} \\Big]_0^\\infty + n \\int_0^\\infty x^{n-1} e^{-x} \\, dx = n (n-1)!',
      codeLanguage: 'typescript',
      codeSnippet: `// Continuous factorial via Gamma function numerical integration
function gammaFactorial(n: number, upperLimit: number = 50, steps: number = 5000): number {
  const dx = upperLimit / steps;
  let integral = 0;
  for (let i = 1; i < steps; i++) {
    const x = i * dx;
    integral += Math.pow(x, n) * Math.exp(-x) * dx;
  }
  return Math.round(integral);
}

console.log(gammaFactorial(4)); // 24 (= 4!)
console.log(gammaFactorial(5)); // 120 (= 5!)`,
    },
    quickCheckQuestion: {
      question: 'According to the LIATE rule, which function should be chosen as u in ∫ x^3 ln(x) dx?',
      options: ['u = ln(x)', 'u = x^3', 'u = x', 'u = x^3 ln(x)'],
      correctIndex: 0,
      explanationLatex: '\\text{In LIATE, } \\mathbf{L} \\text{ogarithmic comes first before } \\mathbf{A} \\text{lgebraic, so } u = \\ln x.',
    },
  },

  {
    id: 'tabular-method',
    order: 9,
    title: 'The Tabular Method (DI Method / Tic-Tac-Toe)',
    shortTitle: 'Tabular Method',
    category: 'Core Techniques',
    icon: 'Table',
    tagline: 'Lightning-fast repeated Integration by Parts without algebraic headache',
    intuitiveExplanation:
      'When you need to integrate something like ∫ x⁴ e^(2x) dx, doing integration by parts by hand requires 4 recursive passes, leading to 15 lines of algebra where 90% of students make a sign error. The Tabular Method (popularized in the movie "Stand and Deliver") collapses this entire process into a simple 3-column table: Signs (+, -, +, -), D (repeatedly differentiate u to 0), and I (repeatedly integrate dv). Then, you multiply along diagonals!',
    csAnalogy:
      'Unrolling a loop in compiler optimization! Instead of 4 recursive function stack calls, the compiler unrolls the operations into flat parallel instructions.',
    keyFormulas: [
      {
        label: 'Three Column Layout',
        latex: '\\begin{array}{|c|c|c|} \\hline \\text{Sign} & \\mathbf{D} \\text{ (Differentiate)} & \\mathbf{I} \\text{ (Integrate)} \\\\ \\hline + & P(x) & g(x) \\\\ - & P\'(x) & \\int g(x) \\\\ + & P\'\'(x) & \\iint g(x) \\\\ \\hline \\end{array}',
        notes: 'Alternate signs starting with +. Differentiate until D becomes 0.',
      },
      {
        label: 'Diagonal Pairing Rule',
        latex: '\\text{Term}_k = (\\text{Sign}_k) \\times D_k \\times I_{k+1}',
        notes: 'Connect D_row to the NEXT row down in I. Add all diagonal products.',
      },
    ],
    interactiveTool: 'tabular',
    workedExamples: [
      {
        id: 'ex-tab-1',
        title: 'Polynomial × Exponential: ∫ x^3 e^(2x) dx',
        problemLatex: '\\int x^3 e^{2x} \\, dx',
        difficulty: 'Intermediate',
        csContext: 'Expected time calculation in queuing models with polynomial state degradation.',
        steps: [
          {
            title: 'Step 1: Set up the D column (differentiate to 0)',
            mathExplanation: 'x^3 \\longrightarrow 3x^2 \\longrightarrow 6x \\longrightarrow 6 \\longrightarrow 0',
          },
          {
            title: 'Step 2: Set up the I column (repeatedly integrate e^(2x))',
            mathExplanation: 'e^{2x} \\longrightarrow \\frac{1}{2}e^{2x} \\longrightarrow \\frac{1}{4}e^{2x} \\longrightarrow \\frac{1}{8}e^{2x} \\longrightarrow \\frac{1}{16}e^{2x}',
          },
          {
            title: 'Step 3: Pair along diagonals with alternating signs',
            mathExplanation: '+ (x^3)(\\frac{1}{2}e^{2x}) - (3x^2)(\\frac{1}{4}e^{2x}) + (6x)(\\frac{1}{8}e^{2x}) - (6)(\\frac{1}{16}e^{2x}) + C',
          },
          {
            title: 'Step 4: Factor out (1/8) e^(2x) or simplify coefficients',
            mathExplanation: 'e^{2x}\\left( \\frac{x^3}{2} - \\frac{3x^2}{4} + \\frac{3x}{4} - \\frac{3}{8} \\right) + C',
          },
        ],
        finalAnswer: 'e^{2x}\\left( \\frac{x^3}{2} - \\frac{3x^2}{4} + \\frac{3x}{4} - \\frac{3}{8} \\right) + C',
      },
    ],
    pitfalls: [
      {
        badLatex: '(+)(x^3)(e^{2x}) - (3x^2)(\\frac{1}{2}e^{2x})',
        goodLatex: '(+)(x^3)(\\frac{1}{2}e^{2x}) - (3x^2)(\\frac{1}{4}e^{2x})',
        mistake: 'Multiplying straight across horizontally instead of diagonally downward',
        whyItHappens: 'Remember the formula is u * v, where v is the INTEGRAL of dv (which is in the row below).',
        howToPrevent: 'Always draw diagonal arrows pointing from row k in D to row k+1 in I.',
      },
    ],
    csApplication: {
      domain: 'Systems Simulation & Queue Theory',
      title: 'Polynomial-Weighted Waiting Times in Erlang Queues',
      description:
        'In network queue modeling, computing the mean nth-order moment of wait times requires evaluating ∫_0^∞ t^n λ e^(-λ t) dt. Tabular integration evaluates this in linear O(n) code steps without recursion.',
      formulaLatex: '\\mathbb{E}[T^n] = \\int_0^\\infty t^n \\lambda e^{-\\lambda t} \\, dt = \\frac{n!}{\\lambda^n}',
      codeLanguage: 'typescript',
      codeSnippet: `// Evaluate polynomial-exponential integral analytically via Tabular logic
function integratePolyExp(coefficients: number[], lambda: number, x: number): number {
  // Directly computes sum of diagonals in O(degree) time
  let sum = 0;
  let fact = 1;
  for (let k = 0; k < coefficients.length; k++) {
    sum += (coefficients[k] * Math.pow(x, k)) / Math.pow(lambda, k + 1);
  }
  return sum * Math.exp(lambda * x);
}`,
    },
    quickCheckQuestion: {
      question: 'When is the Tabular (DI) method most effective?',
      options: [
        'When one factor is a polynomial that differentiates to zero and the other integrates repeatedly',
        'When both factors are trigonometric functions of the same frequency',
        'When the numerator is the derivative of the denominator',
        'When integrating fractions with irreducible quadratics',
      ],
      correctIndex: 0,
      explanationLatex: '\\text{Tabular method terminates cleanly when the polynomial term reaches } 0 \\text{ in the D column.}',
    },
  },

  {
    id: 'trig-substitution',
    order: 10,
    title: 'Trigonometric Substitution (Trig Sub)',
    shortTitle: 'Trig Substitution',
    category: 'Advanced Rational & Trig',
    icon: 'Triangle',
    tagline: 'Vanquish stubborn radicals sqrt(a^2 ± x^2) using right-triangle geometry',
    intuitiveExplanation:
      'When you see square roots containing quadratic expressions like √(a² - x²), √(a² + x²), or √(x² - a²), standard u-substitution hits a dead end because the x dx factor is missing. Trigonometric substitution turns algebra into geometry! By mapping x onto a side of a right triangle, the Pythagorean identity collapses the two terms under the radical into a single squared term, which cleanly escapes the square root: √(a² - a²sin²θ) = a cos θ.',
    csAnalogy:
      'Polar / Spherical coordinates in 3D collision detection: converting Cartesian (x, y) into angle θ so circular/spherical boundaries become simple constants.',
    keyFormulas: [
      {
        label: 'Case 1: Difference of Squares √(a² - x²)',
        latex: 'x = a \\sin\\theta, \\quad dx = a \\cos\\theta \\, d\\theta, \\quad \\sqrt{a^2 - x^2} = a \\cos\\theta',
        notes: 'Identity used: 1 - sin²θ = cos²θ.',
      },
      {
        label: 'Case 2: Sum of Squares √(a² + x²)',
        latex: 'x = a \\tan\\theta, \\quad dx = a \\sec^2\\theta \\, d\\theta, \\quad \\sqrt{a^2 + x^2} = a \\sec\\theta',
        notes: 'Identity used: 1 + tan²θ = sec²θ.',
      },
      {
        label: 'Case 3: Radical with Leading Variable √(x² - a²)',
        latex: 'x = a \\sec\\theta, \\quad dx = a \\sec\\theta \\tan\\theta \\, d\\theta, \\quad \\sqrt{x^2 - a^2} = a \\tan\\theta',
        notes: 'Identity used: sec²θ - 1 = tan²θ.',
      },
    ],
    interactiveTool: 'trig-sub',
    workedExamples: [
      {
        id: 'ex-ts-1',
        title: 'Integral with √(4 - x²)',
        problemLatex: '\\int \\frac{\\sqrt{4 - x^2}}{x^2} \\, dx',
        difficulty: 'Advanced',
        csContext: 'Used in bounding circular collider swept-volumes in game physics.',
        steps: [
          {
            title: 'Step 1: Identify Case 1 with a = 2',
            mathExplanation: 'x = 2\\sin\\theta \\implies dx = 2\\cos\\theta \\, d\\theta, \\quad \\sqrt{4 - x^2} = 2\\cos\\theta',
          },
          {
            title: 'Step 2: Substitute everything into theta',
            mathExplanation: '\\int \\frac{2\\cos\\theta}{(2\\sin\\theta)^2} (2\\cos\\theta \\, d\\theta) = \\int \\frac{4\\cos^2\\theta}{4\\sin^2\\theta} \\, d\\theta = \\int \\cot^2\\theta \\, d\\theta',
          },
          {
            title: 'Step 3: Integrate cot^2(theta)',
            mathExplanation: '\\int (\\csc^2\\theta - 1) \\, d\\theta = -\\cot\\theta - \\theta + C',
          },
          {
            title: 'Step 4: Construct the reference triangle to convert back to x',
            mathExplanation: '\\sin\\theta = \\frac{x}{2} \\implies \\text{Opposite} = x, \\, \\text{Hypotenuse} = 2, \\, \\text{Adjacent} = \\sqrt{4 - x^2}\\\\ \\cot\\theta = \\frac{\\text{Adj}}{\\text{Opp}} = \\frac{\\sqrt{4 - x^2}}{x}, \\quad \\theta = \\arcsin\\left(\\frac{x}{2}\\right)',
          },
        ],
        finalAnswer: '-\\frac{\\sqrt{4 - x^2}}{x} - \\arcsin\\left(\\frac{x}{2}\\right) + C',
      },
    ],
    pitfalls: [
      {
        badLatex: 'x = a \\sin\\theta \\implies dx = a \\sin\\theta',
        goodLatex: 'dx = a \\cos\\theta \\, d\\theta',
        mistake: 'Forgetting to substitute the differential dx',
        whyItHappens: 'Replacing the radical but forgetting dx has its own cosine factor.',
        howToPrevent: 'Always calculate and write down dx BEFORE substituting anything else.',
      },
    ],
    csApplication: {
      domain: 'Computational Geometry & Physics Engines',
      title: 'Circle Arc-Length and Swept-Sphere Volume',
      description:
        'In game physics engines, calculating the area of intersection between a circular hitbox and an obstacle involves integrating √(R² - x²) dx, which yields the exact circle sector plus triangle area formula.',
      formulaLatex: '\\int \\sqrt{R^2 - x^2} \\, dx = \\frac{x}{2}\\sqrt{R^2 - x^2} + \\frac{R^2}{2}\\arcsin\\left(\\frac{x}{R}\\right)',
      codeLanguage: 'typescript',
      codeSnippet: `// Compute exact circle-segment area for 2D rigid-body collision
function circleSegmentArea(radius: number, x: number): number {
  // Evaluated via trig substitution x = R * sin(theta)
  const radical = Math.sqrt(Math.max(0, radius * radius - x * x));
  return 0.5 * (x * radical + radius * radius * Math.asin(x / radius));
}`,
    },
    quickCheckQuestion: {
      question: 'Which substitution should be used for ∫ 1 / (9 + x^2)^(3/2) dx?',
      options: ['x = 3 tan(θ)', 'x = 3 sin(θ)', 'x = 3 sec(θ)', 'x = 9 tan(θ)'],
      correctIndex: 0,
      explanationLatex: '\\text{For } \\sqrt{a^2 + x^2} \\text{ with } a=3, \\text{ use } x = 3\\tan\\theta \\implies 9 + x^2 = 9(1 + \\tan^2\\theta) = 9\\sec^2\\theta.',
    },
  },

  {
    id: 'partial-fractions',
    order: 11,
    title: 'Partial Fractions & Integration of Rational Functions',
    shortTitle: 'Partial Fractions',
    category: 'Core Techniques',
    icon: 'Maximize2',
    tagline: 'Decomposing monster rational functions P(x)/Q(x) into trivial logarithms and arctangents',
    intuitiveExplanation:
      'Any rational function P(x)/Q(x) can be integrated completely! If the degree of the top is greater than or equal to the degree of the bottom, you first perform polynomial long division. Then, you factor the denominator Q(x) into linear and irreducible quadratic factors, and split the fraction into a sum of simple terms A/(x - r) using the Heaviside Cover-Up Method.',
    csAnalogy:
      'Partial fractions is identical to Inverting Z-Transforms and Laplace Transforms in Digital Signal Processing! It breaks down complex transfer functions H(s) into individual resonant filter poles.',
    keyFormulas: [
      {
        label: 'Distinct Linear Factors',
        latex: '\\frac{P(x)}{(x - r_1)(x - r_2)} = \\frac{A}{x - r_1} + \\frac{B}{x - r_2}',
        notes: 'Each linear term integrates into A ln|x - r_1|.',
      },
      {
        label: 'Heaviside Cover-Up Shortcut',
        latex: 'A = \\lim_{x \\to r_1} (x - r_1) \\frac{P(x)}{Q(x)} = \\text{Cover }(x - r_1) \\text{ and plug in } x = r_1',
        notes: 'Finds coefficients in O(1) mental math without solving a system of equations!',
      },
      {
        label: 'Repeated Linear Factors',
        latex: '\\frac{P(x)}{(x - r)^2} = \\frac{A}{x - r} + \\frac{B}{(x - r)^2}',
        notes: 'Integrates into ln|x - r| and -B/(x - r).',
      },
      {
        label: 'Irreducible Quadratic Factor (x² + a²)',
        latex: '\\frac{P(x)}{(x^2 + a^2)} = \\frac{Ax + B}{x^2 + a^2}',
        notes: 'Integrates into (A/2) ln(x² + a²) + (B/a) arctan(x/a).',
      },
    ],
    workedExamples: [
      {
        id: 'ex-pf-1',
        title: 'Distinct Linear Factors using Heaviside Cover-Up',
        problemLatex: '\\int \\frac{5x - 3}{x^2 - 2x - 3} \\, dx',
        difficulty: 'Intermediate',
        csContext: 'Decomposing a discrete filter transfer function into 1st-order IIR filters.',
        steps: [
          {
            title: 'Step 1: Factor the denominator',
            mathExplanation: 'x^2 - 2x - 3 = (x - 3)(x + 1)',
          },
          {
            title: 'Step 2: Set up partial fraction template',
            mathExplanation: '\\frac{5x - 3}{(x - 3)(x + 1)} = \\frac{A}{x - 3} + \\frac{B}{x + 1}',
          },
          {
            title: 'Step 3: Solve A using Heaviside Cover-Up',
            mathExplanation: 'A = \\left. \\frac{5x - 3}{x + 1} \\right|_{x = 3} = \\frac{5(3) - 3}{3 + 1} = \\frac{12}{4} = 3',
            details: 'Cover up (x - 3) and plug in root x = 3!',
          },
          {
            title: 'Step 4: Solve B using Heaviside Cover-Up',
            mathExplanation: 'B = \\left. \\frac{5x - 3}{x - 3} \\right|_{x = -1} = \\frac{5(-1) - 3}{-1 - 3} = \\frac{-8}{-4} = 2',
            details: 'Cover up (x + 1) and plug in root x = -1!',
          },
          {
            title: 'Step 5: Integrate the split fractions',
            mathExplanation: '\\int \\left( \\frac{3}{x - 3} + \\frac{2}{x + 1} \\right) \\, dx = 3\\ln|x - 3| + 2\\ln|x + 1| + C',
          },
        ],
        finalAnswer: '3\\ln|x - 3| + 2\\ln|x + 1| + C',
      },
    ],
    pitfalls: [
      {
        badLatex: '\\text{Do partial fractions directly on } \\frac{x^3 + 2}{x^2 - 1}',
        goodLatex: '\\text{Long division first: } x + \\frac{x + 2}{x^2 - 1}',
        mistake: 'Forgetting polynomial long division when numerator degree >= denominator degree',
        whyItHappens: 'Partial fractions only applies to PROPER rational fractions (deg P < deg Q).',
        howToPrevent: 'Check degrees first! If deg(top) >= deg(bottom), divide first.',
      },
    ],
    csApplication: {
      domain: 'Digital Signal Processing (DSP)',
      title: 'Inverse Z-Transform & IIR Filter Decomposition',
      description:
        'In audio DSP and control systems, infinite impulse response (IIR) digital filters H(z) are implemented as parallel 1st-order sections by expanding H(z) via partial fractions.',
      formulaLatex: 'H(z) = \\frac{Y(z)}{X(z)} = \\sum_{k=1}^N \\frac{A_k}{1 - p_k z^{-1}} \\xrightarrow{\\mathcal{Z}^{-1}} y[n] = \\sum_{k=1}^N A_k p_k^n u[n]',
      codeLanguage: 'typescript',
      codeSnippet: `// Direct Form 1 parallel filter stage from partial fraction poles
class FirstOrderPoleFilter {
  private prevY = 0;
  constructor(private pole: number, private gain: number) {}

  process(sample: number): number {
    const y = this.gain * sample + this.pole * this.prevY;
    this.prevY = y;
    return y;
  }
}`,
    },
    quickCheckQuestion: {
      question: 'What is the coefficient A in 1 / ((x - 2)(x + 3)) = A/(x - 2) + B/(x + 3)?',
      options: ['1/5', '-1/5', '1', '5'],
      correctIndex: 0,
      explanationLatex: '\\text{By Heaviside cover-up: } A = \\frac{1}{2 + 3} = \\frac{1}{5}.',
    },
  },

  {
    id: 'rational-trig-weierstrass',
    order: 12,
    title: 'Rational Functions of Trig Functions (Weierstrass Substitution)',
    shortTitle: 'Weierstrass Substitution',
    category: 'Advanced Rational & Trig',
    icon: 'Feather',
    tagline: 'The "Universal Substitution" t = tan(x/2) that converts any trig integral into pure algebra',
    intuitiveExplanation:
      'Sometimes you encounter rational functions where trig terms are trapped inside denominators with additions, like ∫ 1 / (1 + sin x + cos x) dx. No Pythagorean identity or simple u-sub can save you. In 1875, Karl Weierstrass discovered the "Universal Substitution" t = tan(x/2). This magic transform converts sin(x), cos(x), and dx into purely algebraic rational polynomials in t, allowing you to solve it with standard partial fractions!',
    csAnalogy:
      'Serialization & Deserialization: Converting a complex proprietary trigonometric object into a generic JSON string (algebraic fraction) so any standard parser can process it, then decoding it back.',
    keyFormulas: [
      {
        label: 'The Master Parameter',
        latex: 't = \\tan\\left(\\frac{x}{2}\\right), \\quad x = 2\\arctan(t), \\quad dx = \\frac{2}{1 + t^2} \\, dt',
        notes: 'Notice the factor of 2 in dx.',
      },
      {
        label: 'Sine in terms of t',
        latex: '\\sin x = \\frac{2t}{1 + t^2}',
        notes: 'Derived from double angle: 2 sin(x/2) cos(x/2).',
      },
      {
        label: 'Cosine in terms of t',
        latex: '\\cos x = \\frac{1 - t^2}{1 + t^2}',
        notes: 'Derived from cos²(x/2) - sin²(x/2).',
      },
    ],
    workedExamples: [
      {
        id: 'ex-weier-1',
        title: 'Integrating 1 / (1 + sin x)',
        problemLatex: '\\int \\frac{1}{1 + \\sin x} \\, dx',
        difficulty: 'Advanced',
        csContext: 'Used in ray-tracing atmospheric refraction profiles.',
        steps: [
          {
            title: 'Step 1: Substitute t = tan(x/2)',
            mathExplanation: '\\sin x = \\frac{2t}{1 + t^2}, \\quad dx = \\frac{2}{1 + t^2} \\, dt',
          },
          {
            title: 'Step 2: Plug in and simplify the fraction',
            mathExplanation: '\\int \\frac{1}{1 + \\frac{2t}{1 + t^2}} \\cdot \\frac{2}{1 + t^2} \\, dt = \\int \\frac{2}{(1 + t^2) + 2t} \\, dt = \\int \\frac{2}{(t + 1)^2} \\, dt',
          },
          {
            title: 'Step 3: Integrate using power rule',
            mathExplanation: '2 \\int (t + 1)^{-2} \\, dt = -\\frac{2}{t + 1} + C',
          },
          {
            title: 'Step 4: Back-substitute t = tan(x/2)',
            mathExplanation: '-\\frac{2}{\\tan(x/2) + 1} + C',
          },
        ],
        finalAnswer: '-\\frac{2}{\\tan(x/2) + 1} + C',
      },
    ],
    pitfalls: [
      {
        badLatex: 'dx = \\frac{1}{1 + t^2} dt',
        goodLatex: 'dx = \\frac{2}{1 + t^2} dt',
        mistake: 'Missing the factor of 2 in dx',
        whyItHappens: 'Because x = 2 arctan(t), derivative d/dt(2 arctan t) has a 2 in the numerator.',
        howToPrevent: 'Double check dx = 2 dt / (1 + t^2) on your cheat sheet.',
      },
    ],
    csApplication: {
      domain: 'Computer Vision & Robotics',
      title: 'Planar Kinematics & Polynomial Kinematic Solving',
      description:
        'Robotics inverse kinematics equations involve complex sums of sines and cosines of joint angles θ. Weierstrass substitution transforms non-linear trigonometric constraints into polynomial root-finding problems that can be solved via eigenvalue decomposition.',
      formulaLatex: '\\sin(\\theta) = \\frac{2t}{1+t^2}, \\, \\cos(\\theta) = \\frac{1-t^2}{1+t^2} \\implies \\text{Solve } P(t) = 0',
      codeLanguage: 'typescript',
      codeSnippet: `// Map joint angle to Weierstrass polynomial parameter
function weierstrassParams(theta: number) {
  const t = Math.tan(theta / 2);
  const denom = 1 + t * t;
  return {
    t,
    sin: (2 * t) / denom,
    cos: (1 - t * t) / denom,
  };
}`,
    },
    quickCheckQuestion: {
      question: 'Under the Weierstrass substitution t = tan(x/2), what does cos(x) equal?',
      options: ['(1 - t^2) / (1 + t^2)', '2t / (1 + t^2)', '2 / (1 + t^2)', '(1 + t^2) / (1 - t^2)'],
      correctIndex: 0,
      explanationLatex: '\\text{By double angle identities: } \\cos x = \\frac{1 - t^2}{1 + t^2}.',
    },
  },

  {
    id: 'reduction-formulas',
    order: 13,
    title: 'Reduction Formulas (Recursive Integration)',
    shortTitle: 'Reduction Formulas',
    category: 'Recursion & CS Applications',
    icon: 'Repeat',
    tagline: 'Formulating integrals as recursive Dynamic Programming recurrences: I(n) = f(n) + c · I(n - k)',
    intuitiveExplanation:
      'For high integer powers like ∫ sinⁿ(x) dx or ∫ (ln x)ⁿ dx, integrating directly is grueling. Instead, we use integration by parts to establish a Reduction Formula: an equation relating the integral of power n to the integral of a smaller power (n - 1) or (n - 2). For a Computer Science student, this is literally a Recurrence Relation with base cases I₀ and I₁!',
    csAnalogy:
      'Dynamic Programming & Memoization! I(n) is computed via memoized recursion or bottom-up tabulation: calculate base cases I_0 or I_1, then loop upwards to I_n in O(n) time.',
    keyFormulas: [
      {
        label: 'Sine Power Reduction Formula',
        latex: '\\int \\sin^n x \\, dx = -\\frac{1}{n} \\sin^{n-1} x \\cos x + \\frac{n-1}{n} \\int \\sin^{n-2} x \\, dx',
        notes: 'Reduces power n down by 2 steps at a time.',
      },
      {
        label: 'Cosine Power Reduction Formula',
        latex: '\\int \\cos^n x \\, dx = \\frac{1}{n} \\cos^{n-1} x \\sin x + \\frac{n-1}{n} \\int \\cos^{n-2} x \\, dx',
        notes: 'Identical structure to sine reduction.',
      },
      {
        label: 'Logarithm Power Reduction Formula',
        latex: '\\int (\\ln x)^n \\, dx = x (\\ln x)^n - n \\int (\\ln x)^{n-1} \\, dx',
        notes: 'Reduces power n down by 1 step at a time.',
      },
    ],
    workedExamples: [
      {
        id: 'ex-red-1',
        title: 'Evaluating ∫ (ln x)^3 dx using Reduction',
        problemLatex: '\\int (\\ln x)^3 \\, dx',
        difficulty: 'Intermediate',
        csContext: 'Used in average-case analysis of multidimensional range trees.',
        steps: [
          {
            title: 'Step 1: State the recurrence relation for I_n',
            mathExplanation: 'I_n = x(\\ln x)^n - n I_{n-1}, \\quad \\text{with base case } I_0 = \\int 1 \\, dx = x',
          },
          {
            title: 'Step 2: Compute I_1',
            mathExplanation: 'I_1 = x(\\ln x)^1 - 1(I_0) = x\\ln x - x',
          },
          {
            title: 'Step 3: Compute I_2',
            mathExplanation: 'I_2 = x(\\ln x)^2 - 2(I_1) = x(\\ln x)^2 - 2(x\\ln x - x) = x(\\ln x)^2 - 2x\\ln x + 2x',
          },
          {
            title: 'Step 4: Compute I_3',
            mathExplanation: 'I_3 = x(\\ln x)^3 - 3(I_2) = x(\\ln x)^3 - 3x(\\ln x)^2 + 6x\\ln x - 6x + C',
          },
        ],
        finalAnswer: 'x\\left( (\\ln x)^3 - 3(\\ln x)^2 + 6\\ln x - 6 \\right) + C',
      },
    ],
    pitfalls: [
      {
        badLatex: 'I_n = -\\frac{1}{n}\\sin^{n-1}x\\cos x + I_{n-2}',
        goodLatex: 'I_n = -\\frac{1}{n}\\sin^{n-1}x\\cos x + \\frac{n-1}{n}I_{n-2}',
        mistake: 'Forgetting the coefficient (n - 1)/n in front of the recursive integral',
        whyItHappens: 'Neglecting the constant generated when collecting like terms.',
        howToPrevent: 'Check dimensions/units or test with n = 2 against known formulas.',
      },
    ],
    csApplication: {
      domain: 'Competitive Programming & DP',
      title: 'Dynamic Programming Memoization for Reduction Recurrences',
      description:
        'Instead of doing algebra by hand, we write a simple bottom-up DP algorithm to evaluate definite integrals of reduction formulas in O(n) time.',
      formulaLatex: 'I_n = \\frac{n-1}{n} I_{n-2} \\quad \\text{over } [0, \\pi/2] \\quad \\text{(Wallis\' Integrals)}',
      codeLanguage: 'typescript',
      codeSnippet: `// DP algorithm for Wallis integral: ∫_0^(pi/2) sin^n(x) dx
function wallisIntegral(n: number): number {
  const dp: number[] = new Array(n + 1);
  dp[0] = Math.PI / 2; // Base case I_0
  dp[1] = 1.0;         // Base case I_1

  for (let i = 2; i <= n; i++) {
    dp[i] = ((i - 1) / i) * dp[i - 2];
  }
  return dp[n];
}

console.log(wallisIntegral(4)); // (3/4)*(1/2)*(pi/2) ≈ 0.5890`,
    },
    quickCheckQuestion: {
      question: 'In the reduction formula for ∫ sin^n(x) dx, what is the step decrease in power?',
      options: ['2 (n decreases to n - 2)', '1 (n decreases to n - 1)', '3', 'It doubles'],
      correctIndex: 0,
      explanationLatex: '\\text{Because integration by parts creates a } \\sin^{n-2}(x) \\text{ term via } \\cos^2 x = 1 - \\sin^2 x, \\text{ the step decrease is 2.}',
    },
  },

  {
    id: 'applications-in-cs',
    order: 14,
    title: 'Applications of Integration in Computer Science',
    shortTitle: 'CS Applications',
    category: 'Recursion & CS Applications',
    icon: 'Cpu',
    tagline: 'Rendering equations, Monte Carlo sampling, machine learning loss, and algorithm runtime bounds',
    intuitiveExplanation:
      'Computer Science is not just discrete math! When you build 3D game engines, machine learning models, physics simulators, or analyze algorithms, continuous integration is everywhere. Photorealistic CGI uses Kajiya\'s Rendering Equation (an integral over hemispherical light rays). Deep learning computes continuous expectations and variational lower bounds. Algorithm analysis uses the Integral Test to bound sum(1/k) and asymptotic runtimes.',
    csAnalogy:
      'Integration in CS is the bridge between real-world continuous physics/statistics and discrete digital simulation running on silicon.',
    keyFormulas: [
      {
        label: 'Continuous Expectation (Machine Learning)',
        latex: '\\mathbb{E}[X] = \\int_{-\\infty}^\\infty x \\cdot p(x) \\, dx, \\quad P(a \\le X \\le b) = \\int_a^b p(x) \\, dx',
        notes: 'Expected value and probabilities of continuous random variables.',
      },
      {
        label: 'Kajiya\'s 3D Rendering Equation (Graphics)',
        latex: 'L_o(x, \\omega_o) = L_e(x, \\omega_o) + \\int_{\\Omega} f_r(x, \\omega_i, \\omega_o) L_i(x, \\omega_i) (\\omega_i \\cdot n) \\, d\\omega_i',
        notes: 'The universal integral governing all ray tracing and path tracing in movies and games.',
      },
      {
        label: 'Monte Carlo Numerical Integration',
        latex: '\\int_a^b f(x) \\, dx \\approx \\frac{b - a}{N} \\sum_{i=1}^N f(X_i), \\quad X_i \\sim \\text{Uniform}(a, b)',
        notes: 'Evaluates impossible high-dimensional integrals by random sampling in O(1/√N) error.',
      },
      {
        label: 'Integral Test for Algorithm Bounds',
        latex: '\\int_1^n f(x) \\, dx \\le \\sum_{i=1}^n f(i) \\le f(1) + \\int_1^n f(x) \\, dx',
        notes: 'Used to prove the Harmonic series is Θ(log n).',
      },
    ],
    interactiveTool: 'monte-carlo',
    workedExamples: [
      {
        id: 'ex-app-1',
        title: 'Proving the Harmonic Series Sum is Θ(log n)',
        problemLatex: '\\sum_{k=1}^n \\frac{1}{k} = \\Theta(\\ln n)',
        difficulty: 'Intermediate',
        csContext: 'Crucial for proving average time complexity of Quicksort and random skip lists.',
        steps: [
          {
            title: 'Step 1: Set up the continuous integral lower bound',
            mathExplanation: '\\int_1^{n+1} \\frac{1}{x} \\, dx \\le \\sum_{k=1}^n \\frac{1}{k}',
            details: 'Because 1/x is a monotonically decreasing function.',
          },
          {
            title: 'Step 2: Evaluate the integral',
            mathExplanation: '\\int_1^{n+1} \\frac{1}{x} \\, dx = \\Big[ \\ln x \\Big]_1^{n+1} = \\ln(n+1) - \\ln(1) = \\ln(n+1)',
          },
          {
            title: 'Step 3: Establish the upper bound',
            mathExplanation: '\\sum_{k=1}^n \\frac{1}{k} \\le 1 + \\int_1^n \\frac{1}{x} \\, dx = 1 + \\ln n',
          },
          {
            title: 'Step 4: Conclude asymptotic bound',
            mathExplanation: '\\ln(n+1) \\le H_n \\le 1 + \\ln n \\implies H_n = \\Theta(\\ln n)',
          },
        ],
        finalAnswer: '\\sum_{k=1}^n \\frac{1}{k} = \\ln n + \\gamma + O\\left(\\frac{1}{n}\\right) = \\Theta(\\ln n)',
      },
    ],
    pitfalls: [
      {
        badLatex: 'P(X = c) = \\int_c^c p(x) dx > 0',
        goodLatex: 'P(X = c) = 0 \\quad \\text{for continuous distributions}',
        mistake: 'Thinking a single exact continuous point has non-zero probability',
        whyItHappens: 'In discrete probability P(X=k) > 0, but in continuous math, the probability of an exact real number is 0! Only interval integrals have non-zero probability.',
        howToPrevent: 'Always integrate over a range [a, b].',
      },
    ],
    csApplication: {
      domain: 'Path Tracing & GPU Shaders',
      title: 'Monte Carlo Path Tracing Ray Estimator',
      description:
        'When evaluating lighting at a point, real-time path tracers cannot solve the hemisphere integral analytically. Instead, they shoot N random ray bounces and average their radiance samples.',
      formulaLatex: 'I = \\int_a^b f(x) dx \\approx \\frac{b-a}{N} \\sum_{i=1}^N f(x_i)',
      codeLanguage: 'typescript',
      codeSnippet: `// Monte Carlo integration of arbitrary mathematical function
function monteCarloIntegrate(f: (x: number) => number, a: number, b: number, samples: number = 10000): number {
  let sum = 0;
  for (let i = 0; i < samples; i++) {
    const randomX = a + Math.random() * (b - a);
    sum += f(randomX);
  }
  return ((b - a) * sum) / samples;
}

// Estimate ∫_0^1 (4 / (1 + x^2)) dx = pi ≈ 3.14159
console.log(monteCarloIntegrate(x => 4 / (1 + x * x), 0, 1, 100000)); // ≈ 3.1416`,
    },
    quickCheckQuestion: {
      question: 'Why do computer graphics engines use Monte Carlo integration for the rendering equation?',
      options: [
        'Because the integral is high-dimensional (light rays, reflections, materials) and cannot be solved analytically',
        'Because Monte Carlo eliminates all noise with just 1 sample',
        'Because polynomials cannot be added on GPUs',
        'Because light rays do not follow calculus',
      ],
      correctIndex: 0,
      explanationLatex: '\\text{The rendering equation has infinite recursive dimensions (reflection, refraction, subsurface scattering), making Monte Carlo numerical sampling the standard solution.}',
    },
  },
];
