import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Trash2,
  Sparkles,
  Zap,
  BrainCircuit,
  Bot,
  User,
  Copy,
  Check,
  ChevronDown,
  Terminal,
  RotateCcw,
} from 'lucide-react';
import { MathView } from './MathView';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
}

interface GeminiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopicTitle?: string;
}

export const GeminiChatDrawer: React.FC<GeminiChatDrawerProps> = ({
  isOpen,
  onClose,
  currentTopicTitle,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I'm **Ada**, your Calculus 2 Professor & CS Mentor. 

Ask me anything about integration techniques, step-by-step homework problems, proof derivations, or how these integrals map into 3D rendering engines, compiler AST optimizations, and machine learning gradients!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [taskComplexity, setTaskComplexity] = useState<'general' | 'complex' | 'fast'>('general');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputText).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Send conversation history to backend /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
          taskComplexity,
          topicContext: currentTopicTitle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error communicating with Gemini');
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat request error:', err);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: `⚠️ **Error:** ${err.message || 'Failed to get a response from Gemini.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'Error',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        text: `Conversation history reset. What integration topic would you like to explore next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.5-flash',
      },
    ]);
  };

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper: Simple Markdown & Math Renderer
  const renderMessageContent = (content: string) => {
    // Split by block math $$...$$
    const blockParts = content.split(/\$\$([\s\S]*?)\$\$/g);

    return (
      <div className="space-y-2 text-xs leading-relaxed text-slate-200">
        {blockParts.map((blockPart, bIdx) => {
          if (bIdx % 2 === 1) {
            // Block LaTeX
            return (
              <div key={bIdx} className="my-2 p-2 bg-slate-950/60 rounded-lg overflow-x-auto text-center border border-slate-800">
                <MathView math={blockPart.trim()} block className="text-sm text-indigo-300" />
              </div>
            );
          }

          // Process inline math $...$
          const inlineParts = blockPart.split(/\$([^\$\n]+?)\$/g);

          return (
            <div key={bIdx}>
              {inlineParts.map((inlinePart, iIdx) => {
                if (iIdx % 2 === 1) {
                  return <MathView key={iIdx} math={inlinePart.trim()} className="text-cyan-300 mx-0.5" />;
                }

                // Format simple bold **...** and newlines
                const lines = inlinePart.split('\n');
                return (
                  <span key={iIdx}>
                    {lines.map((line, lIdx) => (
                      <React.Fragment key={lIdx}>
                        {lIdx > 0 && <br />}
                        {line.split(/(\*\*.*?\*\*)/g).map((seg, sIdx) => {
                          if (seg.startsWith('**') && seg.endsWith('**')) {
                            return <strong key={sIdx} className="text-white font-semibold">{seg.slice(2, -2)}</strong>;
                          }
                          return seg;
                        })}
                      </React.Fragment>
                    ))}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm">Ada • Calc 2 CS Tutor</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Powered by Google Gemini Models
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClearHistory}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Model & Task Complexity Selector Bar */}
      <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-2 text-[11px]">
        <span className="text-slate-400 font-mono text-[10px] uppercase">Task Model:</span>
        <div className="flex gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setTaskComplexity('general')}
            className={`px-2 py-0.5 rounded font-mono font-medium transition-all ${
              taskComplexity === 'general'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="gemini-3.5-flash for general tasks"
          >
            General (3.5-flash)
          </button>
          <button
            onClick={() => setTaskComplexity('complex')}
            className={`px-2 py-0.5 rounded font-mono font-medium transition-all ${
              taskComplexity === 'complex'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="gemini-3.1-pro-preview for particularly complex tasks"
          >
            Deep (3.1-pro)
          </button>
          <button
            onClick={() => setTaskComplexity('fast')}
            className={`px-2 py-0.5 rounded font-mono font-medium transition-all ${
              taskComplexity === 'fast'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="gemini-3.1-flash-lite for tasks that should happen fast"
          >
            Speed (3.1-lite)
          </button>
        </div>
      </div>

      {/* Scrollable Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-500/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-md group relative ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : 'bg-slate-950/80 border border-slate-800/90 rounded-bl-xs'
                }`}
              >
                {renderMessageContent(msg.text)}

                <div className="mt-2 pt-1 border-t border-slate-800/40 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{msg.timestamp}</span>
                  {!isUser && msg.modelUsed && (
                    <span className="text-[9px] text-indigo-400">{msg.modelUsed}</span>
                  )}
                  <button
                    onClick={() => handleCopyMessage(msg.text, msg.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-white"
                    title="Copy Text"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5 border border-slate-700">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center text-xs text-slate-400 font-mono">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              <span>Ada is reasoning and generating step-by-step math...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40 flex gap-1.5 overflow-x-auto no-scrollbar">
        {[
          'Walk me through tabular integration for x³ e^(2x)',
          'How is integration used in 3D graphics rendering?',
          'Explain the Heaviside cover-up method',
          'Solve ∫ x / (x² + 9) dx step by step',
        ].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            disabled={isLoading}
            className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-800 bg-slate-950/90 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask about ${currentTopicTitle || 'any integration problem'}...`}
          disabled={isLoading}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white p-2 rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
