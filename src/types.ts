export interface WorkedExampleStep {
  title: string;
  mathExplanation: string;
  csAnalogy?: string;
  details?: string;
}

export interface WorkedExample {
  id: string;
  problemLatex: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  csContext?: string;
  steps: WorkedExampleStep[];
  finalAnswer: string;
  verificationTip?: string;
}

export interface Pitfall {
  badLatex: string;
  goodLatex: string;
  mistake: string;
  whyItHappens: string;
  howToPrevent: string;
}

export interface CsApplication {
  domain: string; // e.g., 'Game Physics', 'Computer Graphics', 'Machine Learning', 'Algorithm Analysis'
  title: string;
  description: string;
  codeSnippet: string;
  codeLanguage: string;
  formulaLatex: string;
}

export interface Topic {
  id: string;
  order: number;
  title: string;
  shortTitle: string;
  category: 'Foundations' | 'Algebraic & Trig Forms' | 'Core Techniques' | 'Advanced Rational & Trig' | 'Recursion & CS Applications';
  icon: string;
  tagline: string;
  intuitiveExplanation: string;
  csAnalogy: string;
  keyFormulas: {
    label: string;
    latex: string;
    notes?: string;
  }[];
  interactiveTool?: 'riemann' | 'tabular' | 'trig-sub' | 'monte-carlo' | 'rational-fractions';
  workedExamples: WorkedExample[];
  pitfalls: Pitfall[];
  csApplication: CsApplication;
  quickCheckQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanationLatex: string;
  };
}

export interface PracticeQuestion {
  id: string;
  topicId: string;
  topicTitle: string;
  questionLatex: string;
  questionText: string;
  hints: string[];
  options: {
    latex: string;
    explanation: string;
  }[];
  correctIndex: number;
  stepByStepSolution: string[];
  csRelevance: string;
}
