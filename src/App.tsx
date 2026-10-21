import React, { useState, useMemo } from 'react';
import { TOPICS } from './data/topicsData';
import { Navbar } from './components/Navbar';
import { TopicDetail } from './components/TopicDetail';
import { DecisionWizard } from './components/DecisionWizard';
import { PracticeArena } from './components/PracticeArena';
import { SimulatorsHub } from './components/SimulatorsHub';
import { CheatSheetModal } from './components/CheatSheetModal';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import { GeminiChatDrawer } from './components/GeminiChatDrawer';
import { WhiteboardWorkbench } from './components/WhiteboardWorkbench';
import {
  Sigma,
  BookOpen,
  GitBranch,
  Award,
  Sliders,
  ChevronRight,
  Search,
  CheckCircle2,
  Terminal,
  Zap,
  Cpu,
  Layers,
  Mic,
  MessageSquare,
  PenTool,
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'curriculum' | 'diagnoser' | 'practice' | 'simulators' | 'whiteboard'>('curriculum');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('basic-integration');
  const [selectedWhiteboardProblem, setSelectedWhiteboardProblem] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState<boolean>(false);
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(new Set(['basic-integration']));

  // Categories list
  const categories = [
    'All',
    'Foundations',
    'Algebraic & Trig Forms',
    'Core Techniques',
    'Advanced Rational & Trig',
    'Recursion & CS Applications',
  ];

  // Filter topics
  const filteredTopics = useMemo(() => {
    return TOPICS.filter((topic) => {
      const matchesCat = selectedCategory === 'All' || topic.category === selectedCategory;
      const matchesSearch =
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.shortTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const currentTopic = useMemo(() => {
    return TOPICS.find((t) => t.id === selectedTopicId) || TOPICS[0];
  }, [selectedTopicId]);

  const currentIndex = TOPICS.findIndex((t) => t.id === currentTopic.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < TOPICS.length - 1;

  const handleNextTopic = () => {
    if (hasNext) {
      const nextTopic = TOPICS[currentIndex + 1];
      setSelectedTopicId(nextTopic.id);
      setCompletedTopicIds((prev) => new Set(prev).add(nextTopic.id));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevTopic = () => {
    if (hasPrev) {
      const prevTopic = TOPICS[currentIndex - 1];
      setSelectedTopicId(prevTopic.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectTopicFromDiagnoser = (topicId: string) => {
    setSelectedTopicId(topicId);
    setCompletedTopicIds((prev) => new Set(prev).add(topicId));
    setCurrentView('curriculum');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
        onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Container */}
      <main className={`flex-1 w-full mx-auto ${currentView === 'whiteboard' ? 'max-w-[99vw] px-2 sm:px-4 py-3' : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-6'}`}>
        {/* VIEW 1: CURRICULUM SYLLABUS */}
        {currentView === 'curriculum' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sidebar Syllabus Topic Navigation */}
            <aside className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm lg:sticky lg:top-24 max-h-[calc(100vh-7rem)] flex flex-col">
              <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                    Syllabus Roadmap (14 Topics)
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {completedTopicIds.size} of 14 topics reviewed
                  </div>
                </div>

                <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(completedTopicIds.size / 14) * 100}%` }}
                  />
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="py-2.5 flex gap-1 overflow-x-auto text-[11px] border-b border-slate-800/60 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Topic List */}
              <div className="overflow-y-auto space-y-1.5 mt-3 pr-1 flex-1">
                {filteredTopics.map((topic) => {
                  const isSelected = topic.id === selectedTopicId;
                  const isCompleted = completedTopicIds.has(topic.id);

                  return (
                    <button
                      key={topic.id}
                      onClick={() => {
                        setSelectedTopicId(topic.id);
                        setCompletedTopicIds((prev) => new Set(prev).add(topic.id));
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-indigo-600/25 border-indigo-500/80 shadow-md text-white'
                          : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                            isSelected
                              ? 'bg-indigo-500 text-white'
                              : isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {topic.order}
                        </span>
                        <div className="truncate">
                          <span className="text-xs font-semibold block truncate">
                            {topic.shortTitle}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {topic.category}
                          </span>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                          isSelected
                            ? 'text-indigo-400 translate-x-0.5'
                            : 'text-slate-600 group-hover:text-slate-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Main Lesson View */}
            <section className="lg:col-span-8">
              <TopicDetail
                topic={currentTopic}
                onNavigateNext={handleNextTopic}
                onNavigatePrev={handlePrevTopic}
                hasPrev={hasPrev}
                hasNext={hasNext}
                onOpenWhiteboard={(latex) => {
                  setSelectedWhiteboardProblem(latex);
                  setCurrentView('whiteboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </section>
          </div>
        )}

        {/* VIEW 2: INTERACTIVE WHITEBOARD & AI CHECKPOINT EVALUATOR */}
        {currentView === 'whiteboard' && (
          <div className="space-y-6">
            <WhiteboardWorkbench initialProblemLatex={selectedWhiteboardProblem} />
          </div>
        )}

        {/* VIEW 3: STRATEGY DIAGNOSER WIZARD */}
        {currentView === 'diagnoser' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <DecisionWizard onSelectTopic={handleSelectTopicFromDiagnoser} />
          </div>
        )}

        {/* VIEW 4: PRACTICE ARENA & Q&A */}
        {currentView === 'practice' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <PracticeArena initialTopicId={selectedTopicId} onNavigateTopic={handleSelectTopicFromDiagnoser} />
          </div>
        )}

        {/* VIEW 5: SIMULATORS & INTERACTIVE LAB */}
        {currentView === 'simulators' && (
          <div className="space-y-6">
            <SimulatorsHub />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sigma className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-300 font-semibold">
              Calculus 2 Integration Masterclass
            </span>
            <span>• Crafted for BSc Computer Science Undergraduates</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>14 Core Modules</span>
            <span>•</span>
            <span>Interactive Visualizers</span>
            <span>•</span>
            <span>CS Code Mappings</span>
          </div>
        </div>
      </footer>

      {/* Floating AI & Voice Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        {/* Voice Conversation Floating Button */}
        <button
          onClick={() => setIsLiveVoiceOpen(true)}
          className="pointer-events-auto bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-full shadow-xl shadow-cyan-500/25 border border-cyan-400/40 flex items-center gap-2.5 text-xs font-bold transition-all hover:scale-105 group"
          title="Start real-time voice conversation with Gemini 3.8 Live"
        >
          <span className="p-1 bg-white/20 rounded-full animate-pulse">
            <Mic className="w-3.5 h-3.5" />
          </span>
          <span>Voice Live API</span>
          <span className="text-[10px] font-mono opacity-80 bg-black/20 px-1.5 py-0.5 rounded">3.8-live</span>
        </button>

        {/* AI Tutor Chat Floating Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="pointer-events-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-full shadow-xl shadow-purple-500/25 border border-purple-400/40 flex items-center gap-2.5 text-xs font-bold transition-all hover:scale-105 group"
          title="Open Gemini Multi-Turn Tutor Chat"
        >
          <span className="p-1 bg-white/20 rounded-full">
            <MessageSquare className="w-3.5 h-3.5" />
          </span>
          <span>Ask AI Mentor</span>
          <span className="text-[10px] font-mono opacity-80 bg-black/20 px-1.5 py-0.5 rounded">Gemini Chat</span>
        </button>
      </div>

      {/* Cheat Sheet Modal */}
      <CheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
      />

      {/* Live Voice Modal (gemini-3.8-live) */}
      <LiveVoiceModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
        currentTopicTitle={currentTopic.title}
      />

      {/* Gemini Multi-turn Chat Drawer (gemini-3.5-flash / gemini-3.1-pro-preview / gemini-3.1-flash-lite) */}
      <GeminiChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentTopicTitle={currentTopic.title}
      />
    </div>
  );
}
