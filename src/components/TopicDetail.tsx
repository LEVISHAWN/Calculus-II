import React, { useState } from 'react';
import { Topic } from '../types';
import { MathView } from './MathView';
import { RiemannVisualizer } from './RiemannVisualizer';
import { TabularMethodVisualizer } from './TabularMethodVisualizer';
import { TrigSubTriangle } from './TrigSubTriangle';
import { MonteCarloVisualizer } from './MonteCarloVisualizer';
import {
  Lightbulb,
  Cpu,
  BookOpen,
  AlertTriangle,
  Code2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  HelpCircle,
  PenTool,
} from 'lucide-react';

interface TopicDetailProps {
  topic: Topic;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  onOpenWhiteboard?: (problemLatex?: string) => void;
}

export const TopicDetail: React.FC<TopicDetailProps> = ({
  topic,
  onNavigateNext,
  onNavigatePrev,
  hasPrev,
  hasNext,
  onOpenWhiteboard,
}) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'examples' | 'cs-code' | 'pitfalls'>('learn');
  const [expandedExampleId, setExpandedExampleId] = useState<string | null>(
    topic.workedExamples[0]?.id || null
  );

  // Quick check state
  const [selectedQuickCheck, setSelectedQuickCheck] = useState<number | null>(null);
  const [quickCheckAnswered, setQuickCheckAnswered] = useState<boolean>(false);

  const handleToggleExample = (id: string) => {
    setExpandedExampleId((prev) => (prev === id ? null : id));
  };

  const handleQuickCheckSelect = (idx: number) => {
    if (quickCheckAnswered) return;
    setSelectedQuickCheck(idx);
    setQuickCheckAnswered(true);
  };

  return (
    <div className="space-y-6">
      {/* Topic Hero Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold uppercase tracking-wider">
                Module {topic.order} of 14 • {topic.category}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {topic.title}
            </h2>
            <p className="text-sm text-indigo-200/80 mt-1 italic font-serif">"{topic.tagline}"</p>
          </div>

          {/* Prev / Next buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigatePrev}
              disabled={!hasPrev}
              className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Previous Module"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-500 px-1">
              {topic.order} / 14
            </span>
            <button
              onClick={onNavigateNext}
              disabled={!hasNext}
              className="p-2 rounded-xl bg-indigo-600 border border-indigo-500 text-white hover:bg-indigo-500 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Next Module"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 border-b border-slate-800/80 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('learn')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'learn'
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Concept & Intuition
          </button>
          <button
            onClick={() => setActiveTab('examples')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'examples'
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Worked Examples ({topic.workedExamples.length})
          </button>
          <button
            onClick={() => setActiveTab('cs-code')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'cs-code'
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> CS Connection & Code
          </button>
          <button
            onClick={() => setActiveTab('pitfalls')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pitfalls'
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Exam Pitfalls & Gotchas ({topic.pitfalls.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Concept & Intuition */}
      {activeTab === 'learn' && (
        <div className="space-y-6">
          {/* Simple Explanation & CS Analogy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm mb-3">
                <Lightbulb className="w-4 h-4 text-amber-400" /> In Simple Terms (The Mental Model)
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{topic.intuitiveExplanation}</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm mb-3">
                <Cpu className="w-4 h-4 text-cyan-400" /> The Computer Science Analogy
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{topic.csAnalogy}</p>
            </div>
          </div>

          {/* Key Formulas Cheatbox */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" /> Core Mathematical Formulas & Rules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topic.keyFormulas.map((f, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between"
                >
                  <span className="text-xs font-semibold text-slate-300 font-mono">{f.label}</span>
                  <div className="my-3 py-2 bg-slate-900/70 rounded-lg text-center overflow-x-auto border border-slate-800/60">
                    <MathView math={f.latex} block className="text-indigo-300 text-base" />
                  </div>
                  {f.notes && <p className="text-[11px] text-slate-400">{f.notes}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Embed Interactive Tool if available */}
          {topic.interactiveTool === 'riemann' && <RiemannVisualizer />}
          {topic.interactiveTool === 'tabular' && <TabularMethodVisualizer />}
          {topic.interactiveTool === 'trig-sub' && <TrigSubTriangle />}
          {topic.interactiveTool === 'monte-carlo' && <MonteCarloVisualizer />}

          {/* Quick Check Mini Quiz */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm mb-2">
              <HelpCircle className="w-4 h-4" /> Quick Concept Check
            </div>
            <p className="text-sm text-slate-200 mb-4">{topic.quickCheckQuestion.question}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {topic.quickCheckQuestion.options.map((opt, oIdx) => {
                const isSelected = selectedQuickCheck === oIdx;
                const isCorrect = oIdx === topic.quickCheckQuestion.correctIndex;

                let btnClass = 'bg-slate-950/80 border-slate-800 hover:border-indigo-500/50 text-slate-300';
                if (quickCheckAnswered) {
                  if (isCorrect) btnClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                  else if (isSelected) btnClass = 'bg-rose-950/40 border-rose-500 text-rose-200';
                  else btnClass = 'bg-slate-950/40 border-slate-800/40 opacity-40 text-slate-400';
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleQuickCheckSelect(oIdx)}
                    disabled={quickCheckAnswered}
                    className={`p-3 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between ${btnClass}`}
                  >
                    <span>{opt}</span>
                    {quickCheckAnswered && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {quickCheckAnswered && (
              <div className="mt-3 p-3 bg-slate-950/90 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono">
                <span className="text-indigo-400 font-bold">Explanation: </span>
                <MathView math={topic.quickCheckQuestion.explanationLatex} className="align-middle" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Worked Examples */}
      {activeTab === 'examples' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 font-mono uppercase tracking-wider">
              Step-by-Step Worked Solutions
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Click any example to expand or collapse
            </span>
          </div>

          {topic.workedExamples.map((ex, idx) => {
            const isExpanded = expandedExampleId === ex.id;

            return (
              <div
                key={ex.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all"
              >
                {/* Header Toggle */}
                <button
                  onClick={() => handleToggleExample(ex.id)}
                  className="w-full p-4 flex items-center justify-between bg-slate-950/60 hover:bg-slate-950/90 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{ex.title}</h4>
                      <div className="mt-1">
                        <MathView math={ex.problemLatex} className="text-xs text-cyan-300 font-mono" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        ex.difficulty === 'Beginner'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : ex.difficulty === 'Intermediate'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {ex.difficulty}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Collapsible Steps Content */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-800/80 space-y-4 animate-in fade-in">
                    {ex.csContext && (
                      <div className="bg-indigo-950/30 border border-indigo-800/30 rounded-xl p-3 text-xs text-indigo-200 flex items-start gap-2">
                        <Cpu className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-mono">Real CS Context: </strong>
                          {ex.csContext}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {ex.steps.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 font-mono">
                            <span>{step.title}</span>
                            {step.csAnalogy && (
                              <span className="text-[10px] text-cyan-400 font-normal">
                                💡 {step.csAnalogy}
                              </span>
                            )}
                          </div>

                          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60 text-center overflow-x-auto">
                            <MathView math={step.mathExplanation} block className="text-slate-100 text-sm" />
                          </div>

                          {step.details && (
                            <p className="text-[11px] text-slate-400 leading-normal">{step.details}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Final Answer */}
                    <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold tracking-wider">
                          Final Closed-Form Antiderivative:
                        </span>
                        <div className="mt-1">
                          <MathView math={ex.finalAnswer} className="text-base font-bold text-slate-100" />
                        </div>
                      </div>

                      {ex.verificationTip && (
                        <div className="text-[11px] text-slate-400 max-w-xs font-mono bg-slate-950/60 p-2 rounded border border-slate-800">
                          🔍 <strong>Verification:</strong> {ex.verificationTip}
                        </div>
                      )}
                    </div>

                    {onOpenWhiteboard && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => onOpenWhiteboard(ex.problemLatex)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 flex items-center gap-1.5 transition-colors"
                        >
                          <PenTool className="w-3.5 h-3.5" />
                          <span>Practice & Grade on Whiteboard</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: CS Connection & Code */}
      {activeTab === 'cs-code' && (
        <div className="space-y-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-cyan-300 font-mono font-semibold text-sm">
              <Cpu className="w-5 h-5 text-cyan-400" /> {topic.csApplication.domain}:{' '}
              {topic.csApplication.title}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {topic.csApplication.description}
            </p>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center overflow-x-auto">
              <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">
                Governing Equation:
              </span>
              <MathView math={topic.csApplication.formulaLatex} block className="text-indigo-300 text-sm" />
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-800/60 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <Code2 className="w-3.5 h-3.5" /> Implementation Code
                </span>
                <span className="text-[10px] uppercase text-slate-500">
                  {topic.csApplication.codeLanguage}
                </span>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                {topic.csApplication.codeSnippet}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Exam Pitfalls & Gotchas */}
      {activeTab === 'pitfalls' && (
        <div className="space-y-4">
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 text-xs text-rose-200">
            ⚠️ <strong>Heads Up:</strong> Over 70% of points lost on Calculus 2 integration exams come
            from these exact common slip-ups. Study each one so you never fall into the trap!
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topic.pitfalls.map((pitfall, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" /> {pitfall.mistake}
                  </h4>

                  <div className="grid grid-cols-2 gap-2 my-3">
                    <div className="bg-rose-950/40 border border-rose-500/40 p-2.5 rounded-lg text-center overflow-x-auto">
                      <span className="text-[10px] font-mono text-rose-400 uppercase font-bold block mb-1">
                        ❌ COMMON MISTAKE
                      </span>
                      <MathView math={pitfall.badLatex} block className="text-xs text-rose-200" />
                    </div>

                    <div className="bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded-lg text-center overflow-x-auto">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block mb-1">
                        ✓ CORRECT APPROACH
                      </span>
                      <MathView math={pitfall.goodLatex} block className="text-xs text-emerald-200" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-normal">{pitfall.whyItHappens}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-300 font-mono bg-slate-950/60 p-2 rounded">
                  🛡️ <strong>Fix:</strong> {pitfall.howToPrevent}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
