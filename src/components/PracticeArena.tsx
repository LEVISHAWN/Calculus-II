import React, { useState } from 'react';
import { PRACTICE_QUESTIONS } from '../data/quizData';
import { MathView } from './MathView';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Award,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Cpu,
} from 'lucide-react';

interface PracticeArenaProps {
  initialTopicId?: string;
  onNavigateTopic?: (topicId: string) => void;
}

export const PracticeArena: React.FC<PracticeArenaProps> = ({ initialTopicId, onNavigateTopic }) => {
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>(initialTopicId || 'all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [revealedHintIndex, setRevealedHintIndex] = useState<number>(-1);
  const [score, setScore] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);

  const filteredQuestions =
    selectedTopicFilter === 'all'
      ? PRACTICE_QUESTIONS
      : PRACTICE_QUESTIONS.filter((q) => q.topicId === selectedTopicFilter);

  const currentQ = filteredQuestions[currentIndex] || PRACTICE_QUESTIONS[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    setAnsweredCount((prev) => prev + 1);
    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setIsAnswerSubmitted(false);
    setSelectedOption(null);
    setRevealedHintIndex(-1);
    setCurrentIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  const handleResetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setRevealedHintIndex(-1);
    setScore(0);
    setAnsweredCount(0);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
              <Award className="w-5 h-5" />
            </span>
            <h3 className="font-semibold text-lg text-slate-100">
              Calculus 2 Interactive Practice Arena & Q&A
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test your pattern recognition, substitution mastery, and integral techniques with instant feedback
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Score:</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              {score} / {answeredCount}
            </span>
          </div>

          <button
            onClick={handleResetQuiz}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg"
            title="Reset Score"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Topic Filter Pills */}
      <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-mono text-[11px] mr-1">Filter:</span>
        <button
          onClick={() => {
            setSelectedTopicFilter('all');
            setCurrentIndex(0);
            setIsAnswerSubmitted(false);
          }}
          className={`px-3 py-1 rounded-lg font-medium transition-all ${
            selectedTopicFilter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          All Topics ({PRACTICE_QUESTIONS.length})
        </button>
        {Array.from(new Set(PRACTICE_QUESTIONS.map((q) => q.topicId))).map((tId) => {
          const qObj = PRACTICE_QUESTIONS.find((q) => q.topicId === tId);
          return (
            <button
              key={tId}
              onClick={() => {
                setSelectedTopicFilter(tId);
                setCurrentIndex(0);
                setIsAnswerSubmitted(false);
              }}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedTopicFilter === tId
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {qObj?.topicTitle || tId}
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      <div className="mt-5 bg-slate-950/80 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
              {currentQ.topicTitle}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Question {currentIndex + 1} of {filteredQuestions.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentQ.hints.length > 0 && (
              <button
                onClick={() =>
                  setRevealedHintIndex((prev) =>
                    prev < currentQ.hints.length - 1 ? prev + 1 : prev
                  )
                }
                disabled={revealedHintIndex >= currentQ.hints.length - 1}
                className="text-xs flex items-center gap-1 text-amber-400 hover:text-amber-300 disabled:opacity-40"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>
                  {revealedHintIndex === -1
                    ? 'Get Hint'
                    : `Next Hint (${revealedHintIndex + 1}/${currentQ.hints.length})`}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Revealed Hints */}
        {revealedHintIndex >= 0 && (
          <div className="mt-3 bg-amber-950/30 border border-amber-600/30 rounded-lg p-3 space-y-1.5 text-xs">
            {currentQ.hints.slice(0, revealedHintIndex + 1).map((hint, hIdx) => (
              <div key={hIdx} className="text-amber-200/90 flex items-start gap-2">
                <span className="font-mono text-amber-400 font-bold">💡 Hint {hIdx + 1}:</span>
                <span>{hint}</span>
              </div>
            ))}
          </div>
        )}

        {/* Question Prompt */}
        <div className="mt-4">
          <p className="text-sm text-slate-300">{currentQ.questionText}</p>
          <div className="my-4 py-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-center">
            <MathView math={currentQ.questionLatex} block className="text-lg text-slate-100" />
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const isCorrect = optIdx === currentQ.correctIndex;

            let borderClass = 'border-slate-800 hover:border-indigo-500/50 bg-slate-900/50';
            if (isAnswerSubmitted) {
              if (isCorrect) {
                borderClass = 'border-emerald-500/80 bg-emerald-950/30 text-emerald-200';
              } else if (isSelected) {
                borderClass = 'border-rose-500/80 bg-rose-950/30 text-rose-200';
              } else {
                borderClass = 'border-slate-800 opacity-40 bg-slate-900/30';
              }
            } else if (isSelected) {
              borderClass = 'border-indigo-500 bg-indigo-950/40 text-indigo-100 ring-1 ring-indigo-500';
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                disabled={isAnswerSubmitted}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${borderClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-300">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <MathView math={opt.latex} className="text-sm font-semibold" />
                </div>

                {isAnswerSubmitted && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action button */}
        <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            {selectedOption !== null && !isAnswerSubmitted && 'Click submit to verify your answer.'}
          </div>

          {!isAnswerSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              Next Question <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Detailed Worked Solution Box after submission */}
        {isAnswerSubmitted && (
          <div className="mt-5 bg-slate-900/90 border border-slate-800 rounded-xl p-4 animate-in fade-in space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold font-mono uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Complete Step-by-Step Solution:
            </div>

            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 leading-relaxed font-mono">
              {currentQ.stepByStepSolution.map((step, sIdx) => (
                <li key={sIdx} className="pl-1">
                  {step}
                </li>
              ))}
            </ol>

            {currentQ.csRelevance && (
              <div className="mt-3 bg-indigo-950/30 border border-indigo-800/30 rounded-lg p-2.5 flex items-start gap-2 text-xs text-indigo-200">
                <Cpu className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold font-mono">CS Connection:</span>{' '}
                  {currentQ.csRelevance}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
