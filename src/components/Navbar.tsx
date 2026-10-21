import React from 'react';
import {
  Sigma,
  BookOpen,
  GitBranch,
  Award,
  BookMarked,
  Sliders,
  Search,
  Code2,
  Terminal,
  Mic,
  MessageSquare,
  PenTool,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'curriculum' | 'diagnoser' | 'practice' | 'simulators' | 'whiteboard';
  onViewChange: (view: 'curriculum' | 'diagnoser' | 'practice' | 'simulators' | 'whiteboard') => void;
  onOpenCheatSheet: () => void;
  onOpenLiveVoice: () => void;
  onOpenChat: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenCheatSheet,
  onOpenLiveVoice,
  onOpenChat,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Sigma className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-slate-100 tracking-tight">
                  Calc 2 Integration
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  <Terminal className="w-3 h-3 mr-1" /> BSc Computer Science
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Intuitive Masterclass • CS Code Connections • Visual Simulators
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onViewChange('curriculum')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'curriculum'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> 14 Modules
            </button>
            <button
              onClick={() => onViewChange('diagnoser')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'diagnoser'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" /> Strategy Wizard
            </button>
            <button
              onClick={() => onViewChange('practice')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'practice'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" /> Practice & Q&A
            </button>
            <button
              onClick={() => onViewChange('simulators')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'simulators'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" /> Interactive Lab
            </button>
            <button
              onClick={() => onViewChange('whiteboard')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'whiteboard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-cyan-400" /> Whiteboard & AI Grade
            </button>
          </nav>

          {/* Right actions: Live Voice, AI Chat & Formula Sheet */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLiveVoice}
              className="bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Start real-time voice conversation via Gemini 3.8 Live API"
            >
              <Mic className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">Live Voice</span>
            </button>

            <button
              onClick={onOpenChat}
              className="bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Open Gemini Multi-Turn Chatbot"
            >
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">AI Tutor</span>
            </button>

            <button
              onClick={onOpenCheatSheet}
              className="bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <BookMarked className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Cheat Sheet</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav strip */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800/80 gap-1 overflow-x-auto text-[11px]">
          <button
            onClick={() => onViewChange('curriculum')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap ${
              currentView === 'curriculum' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Modules
          </button>
          <button
            onClick={() => onViewChange('whiteboard')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap ${
              currentView === 'whiteboard' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Whiteboard
          </button>
          <button
            onClick={() => onViewChange('diagnoser')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap ${
              currentView === 'diagnoser' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Wizard
          </button>
          <button
            onClick={() => onViewChange('practice')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap ${
              currentView === 'practice' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Q&A Arena
          </button>
          <button
            onClick={() => onViewChange('simulators')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap ${
              currentView === 'simulators' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Lab Tools
          </button>
        </div>
      </div>
    </header>
  );
};
