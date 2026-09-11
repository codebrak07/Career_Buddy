import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { askGroqAssistant } from '../../services/groqService';
import { 
  Bot, 
  X, 
  Send, 
  Loader2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const DEFAULT_QUESTIONS = [
  'How do I explore this website?',
  'How does the 6-factor readiness score work?',
  'How do I validate a skill with Groq AI?',
  'What are blockers and the topological DAG?'
];

export const GroqAssistantBot: React.FC = () => {
  const { 
    userProfile, 
    selectedRoleMatch, 
    setActiveScreen, 
    setAppMode 
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `👋 Hi! I am **Career Buddy Assistant** powered by Groq LPU (~150ms). Ask me how to explore the platform, understand mathematical scoring, or elevate your career readiness.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [measuredLatency, setMeasuredLatency] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    const startTime = performance.now();

    try {
      const topSkills = Object.values(userProfile.skills || {})
        .filter(s => s.state === 'validated' || s.confidence >= 70)
        .map(s => s.name)
        .slice(0, 4);

      const assistantResponse = await askGroqAssistant(
        query,
        messages.map(m => ({ role: m.sender, content: m.text })),
        {
          candidateName: userProfile.name,
          targetRole: selectedRoleMatch.role.title,
          fitScore: selectedRoleMatch.overallScore,
          blockersCount: selectedRoleMatch.missingCompetencies.filter(m => m.isBlocker).length,
          topSkills
        }
      );

      const elapsed = Math.round(performance.now() - startTime);
      setMeasuredLatency(elapsed);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: assistantResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `I can help you explore the platform:
- **[Candidate Portal]**: Switch to Candidate mode in the top navbar to submit credentials & take dynamic Groq AI tests.
- **[Evaluator Mode]**: Inspect the 6-factor deterministic linear model and mathematical trace.
- **[Topological DAG]**: Check prerequisite roadmaps under Section 05.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      
      {/* ── Floating Launcher Pill ──────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2.5 bg-[#18181B] hover:bg-[#27272A] text-white rounded-xl shadow-xl border border-white/20 flex items-center gap-3 transition-all duration-200 hover:scale-[1.02] group"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-4 h-4 text-[#FF4F00]" />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-left font-mono">
            <div className="text-xs font-bold flex items-center gap-1.5">
              <span>⚡ GROQ / ASSIST</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FF4F00] text-white font-bold">
                {measuredLatency ? `${measuredLatency}ms` : 'LIVE'}
              </span>
            </div>
            <div className="text-[9px] text-[#A1A1AA]">Ask anything / Platform Guide</div>
          </div>
        </button>
      )}

      {/* ── Expanded Chat Drawer ────────────────────────── */}
      {isOpen && (
        <div 
          className="w-[360px] sm:w-[410px] h-[540px] max-h-[85vh] bg-white rounded-2xl border border-[#E7E2D6] shadow-2xl flex flex-col overflow-hidden animate-fade-in-up"
        >
          {/* Header */}
          <div className="p-3.5 bg-[#18181B] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FF4F00] flex items-center justify-center text-white shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold font-mono flex items-center gap-1.5">
                  <span>Career Buddy Assistant</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-[#FF4F00] font-mono font-bold">
                    {measuredLatency ? `GROQ / LIVE · ${measuredLatency}ms` : 'GROQ / LIVE'}
                  </span>
                </div>
                <div className="text-[10px] text-[#A1A1AA] truncate max-w-[220px]">
                  {userProfile.name} · {selectedRoleMatch.role.title} ({selectedRoleMatch.overallScore}%)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#A1A1AA]">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-white rounded transition"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Questions Chips */}
          <div className="p-2.5 bg-[#FAF9F5] border-b border-[#E7E2D6] overflow-x-auto flex gap-1.5 scrollbar-none text-[10px] font-mono">
            {DEFAULT_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-[#FFF9F6] text-[#52525B] hover:text-[#FF4F00] border border-[#E7E2D6] hover:border-[#FF4F00]/30 whitespace-nowrap transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs bg-[#FAF9F5]/40">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#18181B] text-white rounded-br-none'
                      : 'bg-white border border-[#E7E2D6] text-[#18181B] rounded-bl-none shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
                <span className="text-[9px] text-[#A1A1AA] mt-0.5 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white border border-[#E7E2D6] rounded-xl text-xs text-[#71717A] max-w-[70%]">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF4F00]" />
                <span>Groq LPU reasoning...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="px-3 py-1.5 bg-white border-t border-[#E7E2D6] flex items-center justify-between text-[10px] font-mono text-[#71717A]">
            <div className="flex items-center gap-2">
              <span>Shortcuts:</span>
              <button
                onClick={() => {
                  setAppMode('candidate');
                  setActiveScreen('candidate_portal');
                  setIsOpen(false);
                }}
                className="text-[#FF4F00] hover:underline font-bold"
              >
                [Candidate Portal]
              </button>
              <button
                onClick={() => {
                  setActiveScreen('gap_dag');
                  setIsOpen(false);
                }}
                className="hover:underline"
              >
                [Gap DAG]
              </button>
              <button
                onClick={() => {
                  setActiveScreen('careers');
                  setIsOpen(false);
                }}
                className="hover:underline"
              >
                [Careers]
              </button>
            </div>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-[#E7E2D6] flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Ask how to explore, score formula, or validate..."
              className="flex-1 p-2.5 bg-[#FAF9F5] border border-[#E7E2D6] rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#FF4F00] focus:outline-none placeholder-[#A1A1AA]"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputValue.trim()}
              className="p-2.5 bg-[#FF4F00] hover:bg-[#E04500] disabled:opacity-50 text-white rounded-xl transition shadow-xs"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
