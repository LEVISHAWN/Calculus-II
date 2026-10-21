import { PracticeQuestion } from '../types';

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'q1',
    topicId: 'basic-integration',
    topicTitle: 'Basic Integration',
    questionText: 'Evaluate the indefinite integral of the polynomial function:',
    questionLatex: '\\int (9x^2 - 4x + 5) \\, dx',
    hints: [
      'Apply the power rule ∫ x^n dx = x^(n+1)/(n+1) to each term separately.',
      'Remember that the constant 5 integrates to 5x.',
    ],
    options: [
      {
        latex: '3x^3 - 2x^2 + 5x + C',
        explanation: 'Correct! 9(x^3/3) - 4(x^2/2) + 5x + C simplifies directly to 3x^3 - 2x^2 + 5x + C.',
      },
      {
        latex: '18x - 4 + C',
        explanation: 'This is differentiation, not integration! Integration increases power exponents.',
      },
      {
        latex: '3x^3 - 4x^2 + 5x + C',
        explanation: '4/2 was not simplified; 4(x^2/2) equals 2x^2.',
      },
      {
        latex: '\\frac{9}{3}x^3 - 2x^2 + C',
        explanation: 'You forgot to integrate the constant term 5.',
      },
    ],
    correctIndex: 0,
    stepByStepSolution: [
      'Split terms by linearity: 9∫ x^2 dx - 4∫ x dx + 5∫ 1 dx',
      'Integrate x^2: 9 · (x^3 / 3) = 3x^3',
      'Integrate x: -4 · (x^2 / 2) = -2x^2',
      'Integrate 5: 5 · x = 5x',
      'Add the constant of integration C: 3x^3 - 2x^2 + 5x + C',
    ],
    csRelevance: 'Accumulating clock cycles from a quadratic CPU throttle governor.',
  },
  {
    id: 'q2',
    topicId: 'trig-and-inverse-trig',
    topicTitle: 'Trig & Inverse Trig',
    questionText: 'Evaluate the following rational integral leading to an inverse trigonometric function:',
    questionLatex: '\\int \\frac{1}{25 + x^2} \\, dx',
    hints: [
      'Recall the standard template: ∫ 1/(a^2 + x^2) dx = (1/a) arctan(x/a) + C.',
      'Notice that 25 is 5^2, so a = 5.',
    ],
    options: [
      {
        latex: '\\frac{1}{5}\\arctan\\left(\\frac{x}{5}\\right) + C',
        explanation: 'Correct! Matching with 1/(a^2 + x^2) gives a = 5, with the 1/5 factor outside.',
      },
      {
        latex: '\\arctan\\left(\\frac{x}{5}\\right) + C',
        explanation: 'Missing the 1/a factor outside! Arctan always has 1/a out front.',
      },
      {
        latex: '\\frac{1}{25}\\arctan(x) + C',
        explanation: 'The denominator has x/5 inside the arctangent, not 1/25 outside.',
      },
      {
        latex: '\\arcsin\\left(\\frac{x}{5}\\right) + C',
        explanation: 'Arcsin requires a square root in the denominator: 1/√(a^2 - x^2).',
      },
    ],
    correctIndex: 0,
    stepByStepSolution: [
      'Identify the form 1/(a^2 + u^2) where a^2 = 25 → a = 5',
      'Apply formula: ∫ 1/(a^2 + x^2) dx = (1/a) arctan(x/a) + C',
      'Substitute a = 5: (1/5) arctan(x/5) + C',
    ],
    csRelevance: 'Inverse tangent transforms are standard in HDR tonemapping curves in graphics shaders.',
  },
  {
    id: 'q3',
    topicId: 'reverse-chain-pattern',
    topicTitle: 'Reverse Chain Pattern',
    questionText: 'Identify the pattern and evaluate directly:',
    questionLatex: '\\int \\frac{6x}{3x^2 + 7} \\, dx',
    hints: [
      'Take the derivative of the denominator (3x^2 + 7). What do you get?',
      'Since numerator is the exact derivative of denominator, what formula applies?',
    ],
    options: [
      {
        latex: '\\ln(3x^2 + 7) + C',
        explanation: 'Correct! d/dx(3x^2 + 7) = 6x. This is exactly the f\'(x)/f(x) pattern yielding ln|f(x)| + C.',
      },
      {
        latex: '\\frac{1}{6}\\ln(3x^2 + 7) + C',
        explanation: 'No fraction needed: 6x is already the exact derivative of 3x^2 + 7.',
      },
      {
        latex: '6\\arctan(x) + C',
        explanation: 'The numerator has x, so this is logarithmic, not arctangent.',
      },
      {
        latex: '\\frac{3x^2}{(3x^2+7)^2} + C',
        explanation: 'Incorrect algebraic operation.',
      },
    ],
    correctIndex: 0,
    stepByStepSolution: [
      'Check denominator: f(x) = 3x^2 + 7',
      'Calculate derivative: f\'(x) = 6x',
      'Observe the integrand matches ∫ f\'(x)/f(x) dx exactly',
      'Apply theorem: ln|3x^2 + 7| + C. Since 3x^2 + 7 > 0 for all real x, absolute bars are optional.',
    ],
    csRelevance: 'Rule-based compiler optimization in computer algebra systems.',
  },
  {
    id: 'q4',
    topicId: 'u-substitution',
    topicTitle: 'u-Substitution',
    questionText: 'Evaluate using substitution:',
    questionLatex: '\\int 2x e^{x^2 + 4} \\, dx',
    hints: [
      'What inner expression has its derivative floating right next to it?',
      'Let u = x^2 + 4. What is du?',
    ],
    options: [
      {
        latex: 'e^{x^2 + 4} + C',
        explanation: 'Correct! Let u = x^2 + 4 → du = 2x dx. The integral becomes ∫ e^u du = e^u + C = e^(x^2 + 4) + C.',
      },
      {
        latex: '2e^{x^2 + 4} + C',
        explanation: 'The factor 2 was already absorbed into du = 2x dx.',
      },
      {
        latex: '\\frac{1}{2} e^{x^2 + 4} + C',
        explanation: 'No need to divide by 2 because 2x is already present in the integrand.',
      },
      {
        latex: 'x^2 e^{x^2 + 4} + C',
        explanation: 'Incorrect substitution.',
      },
    ],
    correctIndex: 0,
    stepByStepSolution: [
      'Choose u = x^2 + 4',
      'Compute differential: du = 2x dx',
      'Rewrite integral: ∫ e^u du',
      'Evaluate: e^u + C',
      'Back-substitute u: e^(x^2 + 4) + C',
    ],
    csRelevance: 'Used in Gaussian normal distributions in machine learning and continuous Bayesian modeling.',
  },
  {
    id: 'q5',
    topicId: 'integration-by-parts',
    topicTitle: 'Integration by Parts',
    questionText: 'Using the LIATE rule, evaluate:',
    questionLatex: '\\int x e^{3x} \\, dx',
    hints: [
      'In LIATE, x is Algebraic (A) and e^(3x) is Exponential (E). What should be u?',
      'Use ∫ u dv = uv - ∫ v du.',
    ],
    options: [
      {
        latex: '\\frac{x e^{3x}}{3} - \\frac{e^{3x}}{9} + C',
        explanation: 'Correct! u = x, dv = e^(3x)dx → du = dx, v = (1/3)e^(3x). uv - ∫ v du = (x/3)e^(3x) - (1/9)e^(3x) + C.',
      },
      {
        latex: 'x e^{3x} - e^{3x} + C',
        explanation: 'Forgot the 1/3 factors from integrating e^(3x).',
      },
      {
        latex: '\\frac{x^2}{2} e^{3x} + C',
        explanation: 'You cannot integrate both terms independently; that violates product calculus.',
      },
      {
        latex: '\\frac{x e^{3x}}{3} + \\frac{e^{3x}}{9} + C',
        explanation: 'Sign error: Integration by parts has a MINUS sign: uv - ∫ v du.',
      },
    ],
    correctIndex: 0,
    stepByStepSolution: [
      'Assign by LIATE: u = x (Algebraic), dv = e^(3x) dx (Exponential)',
      'Differentiate u: du = dx',
      'Integrate dv: v = (1/3) e^(3x)',
      'Apply formula: u v - ∫ v du = x · (1/3) e^(3x) - ∫ (1/3) e^(3x) dx',
      'Integrate the remaining piece: (x/3) e^(3x) - (1/9) e^(3x) + C',
    ],
    csRelevance: 'Calculating expected values in continuous exponential survival distributions.',
  },
  {
    id: 'q6',
    topicId: 'tabular-method',
    topicTitle: 'Tabular Method',
    questionText: 'Using the Tabular (DI) method, what is the integral of x^2 sin(x) dx?',
    questionLatex: '\\int x^2 \\sin x \\, dx',
    hints: [
      'D column: x^2 → 2x → 2 → 0.',
      'I column: sin(x) → -cos(x) → -sin(x) → cos(x).',
      'Signs: +, -, +.',
    ],
    options: [
      {
        latex: '-x^2 \\cos x + 2x \\sin x + 2\\cos x + C',
        explanation: 'Correct! Diagonals: (+)(x^2)(-cos x) + (-)(2x)(-sin x) + (+)(2)(cos x) = -x^2 cos x + 2x sin x + 2 cos x + C.',
      },
      {
        latex: 'x^2 \\cos x - 2x \\sin x + C',
        explanation: 'Signs and remaining constant term missing.',
      },
      {
        latex: '-x^2 \\cos x - 2x \\sin x - 2\\cos x + C',
        explanation: 'Sign error: minus times minus equals plus on the middle term!',
      },
      {
        latex: '\\frac{x^3}{3}(-\\cos x) + C',
        explanation: 'Invalid integration of products.',
      },
    ],
    correctIndex: 0,
    stepByStepSolution: [
      'Row 1: Sign = +, D = x^2, I = sin(x)',
      'Row 2: Sign = -, D = 2x, I = -cos(x)',
      'Row 3: Sign = +, D = 2, I = -sin(x)',
      'Row 4: Sign = -, D = 0, I = cos(x)',
      'Diagonal 1: (+)(x^2)(-cos x) = -x^2 cos(x)',
      'Diagonal 2: (-)(2x)(-sin x) = +2x sin(x)',
      'Diagonal 3: (+)(2)(cos x) = +2 cos(x)',
      'Sum all diagonals: -x^2 cos(x) + 2x sin(x) + 2 cos(x) + C',
    ],
    csRelevance: 'Speedy computation of polynomial-modulated audio harmonics in game synthesizers.',
  },
  {
    id: 'q7',
    topicId: 'partial-fractions',
    topicTitle: 'Partial Fractions',
    questionText: 'Use the Heaviside Cover-Up method to split and integrate:',
    questionLatex: '\\int \\frac{7x - 1}{x^2 - x - 6} \\, dx',
    hints: [
      'Factor denominator into (x - 3)(x + 2).',
      'Find A by covering (x - 3) and evaluating at x = 3.',
      'Find B by covering (x + 2) and evaluating at x = -2.',
    ],
    options: [
      {
        latex: '4\\ln|x - 3| + 3\\ln|x + 2| + C',
        explanation: 'Correct! A = (7(3)-1)/(3+2) = 20/5 = 4. B = (7(-2)-1)/(-2-3) = -15/-5 = 3. ∫ (4/(x-3) + 3/(x+2)) dx = 4ln|x-3| + 3ln|x+2| + C.',
      },
      {
        latex: '3\\ln|x - 3| + 4\\ln|x + 2| + C',
        explanation: 'Coefficients A and B are swapped.',
      },
      {
        latex: '7\\ln|x^2 - x - 6| + C',
        explanation: 'Numerator 7x - 1 is not the derivative (2x - 1), so you cannot take direct log.',
      },
      {
        latex: '\\frac{4}{x - 3} + \\frac{3}{x + 2} + C',
        explanation: 'These are the decomposed rational terms, but they haven\'t been integrated yet!',
      },
    ],
    correctIndex: 0,
    stepByStepSolution: [
      'Factor denominator: x^2 - x - 6 = (x - 3)(x + 2)',
      'Set template: (7x - 1)/((x - 3)(x + 2)) = A/(x - 3) + B/(x + 2)',
      'Find A via Cover-Up: A = (7(3) - 1)/(3 + 2) = 20/5 = 4',
      'Find B via Cover-Up: B = (7(-2) - 1)/(-2 - 3) = -15/-5 = 3',
      'Integrate: ∫ (4/(x - 3) + 3/(x + 2)) dx = 4 ln|x - 3| + 3 ln|x + 2| + C',
    ],
    csRelevance: 'Decomposing recursive digital filter systems into parallel pole channels in DSP.',
  },
  {
    id: 'q8',
    topicId: 'trig-substitution',
    topicTitle: 'Trig Substitution',
    questionText: 'Which trigonometric substitution eliminates the radical in:',
    questionLatex: '\\int \\frac{1}{\\sqrt{16 - x^2}} \\, dx',
    hints: [
      'Recall: a^2 - x^2 suggests using the identity 1 - sin²θ = cos²θ.',
      'Here a^2 = 16, so a = 4.',
    ],
    options: [
      {
        latex: 'x = 4\\sin\\theta',
        explanation: 'Correct! 16 - (4sin θ)^2 = 16(1 - sin²θ) = 16 cos²θ, whose square root is 4 cos θ.',
      },
      {
        latex: 'x = 4\\tan\\theta',
        explanation: 'Tangent is used for sum of squares: a^2 + x^2.',
      },
      {
        latex: 'x = 4\\sec\\theta',
        explanation: 'Secant is used when variable leads: x^2 - a^2.',
      },
      {
        latex: 'x = 16\\sin\\theta',
        explanation: 'The coefficient should be a = √16 = 4, not 16.',
      },
    ],
    correctIndex: 0,
    stepByStepSolution: [
      'Inspect radical: √(a^2 - x^2) with a = 4',
      'Substitute x = 4 sin(θ) → dx = 4 cos(θ) dθ',
      'Simplify radical: √(16 - 16 sin²θ) = √(16 cos²θ) = 4 cos(θ)',
      'Integral simplifies to: ∫ (4 cos θ dθ)/(4 cos θ) = ∫ 1 dθ = θ + C = arcsin(x/4) + C',
    ],
    csRelevance: 'Calculating collision volumes of circular and spherical colliders in physics engines.',
  },
];
