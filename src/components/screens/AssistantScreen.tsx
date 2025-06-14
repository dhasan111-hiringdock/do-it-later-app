
import { useRef, useEffect, useState } from 'react';
import { Sparkle, User, Bot, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAIChat } from '@/hooks/useAIChat';
import { cn } from '@/lib/utils';

// Magical Genie avatar SVG
function GenieAvatar() {
  return (
    <div className="relative">
      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-dolater-mint via-emerald-400 to-blue-400 flex items-center justify-center shadow-xl border-4 border-white animate-genie-glow">
        <Sparkle size={34} className="text-white drop-shadow-lg animate-pulse" />
      </div>
      {/* Magical sparkles */}
      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-full blur-md opacity-50 animate-float" />
    </div>
  );
}

// User avatar
function UserAvatar() {
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-blue-700 flex items-center justify-center shadow">
      <User size={24} className="text-white" />
    </div>
  );
}

// Bubble for chat messages
function GenieMessage({ type, content, timestamp }: { type: 'assistant' | 'user', content: string, timestamp: string }) {
  return (
    <div className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'} items-end`}>
      {type === 'assistant' && <GenieAvatar />}
      <div className={cn(
        "px-5 py-4 max-w-[80vw] rounded-3xl shadow-md text-base whitespace-pre-line leading-relaxed font-medium",
        type === 'assistant'
          ? "ml-3 bg-gradient-to-br from-white via-green-50 to-blue-50 text-gray-900 border border-dolater-mint/25"
          : "mr-3 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-400 text-white border border-blue-600"
      )}>
        {content}
        <span className={cn(
          "block text-xs mt-2",
          type === 'assistant'
            ? 'text-gray-400'
            : 'text-blue-100'
        )}>
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      {type === 'user' && <UserAvatar />}
    </div>
  );
}

// Magic quick action pill
function MagicQuickAction({ label, onSelect }: { label: string, onSelect: (q: string) => void }) {
  return (
    <button
      onClick={() => onSelect(label)}
      className="flex items-center bg-gradient-to-r from-dolater-mint to-blue-400 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:scale-105 transition-transform duration-200 gap-2 border-2 border-white animate-hover-quick"
      aria-label={label}
    >
      <Sparkle size={18} className="text-yellow-100 drop-shadow" />
      {label}
    </button>
  );
}

// Typing dots animation for Genie
function TypingDots() {
  return (
    <div className="flex gap-1 items-center px-7 py-3">
      <div className="w-2 h-2 bg-dolater-mint rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 bg-dolater-mint rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-2 h-2 bg-dolater-mint rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      <span className="text-xs text-dolater-mint ml-2 font-semibold">Genie is thinking...</span>
    </div>
  );
}

const MAGIC_INTRO = [
  "✨ Welcome to Genie! ✨",
  "Turn your content into magic: Ask Genie to make plans, summarize, or help organize.",
  "Just say hi! Genie will grant your (organizational) wishes."
];

const MAGIC_ACTIONS = [
  "Create a plan from my saved content",
  "Summarize my content",
  "Help me get organized",
  "Show me what you can do"
];

const AssistantScreen = () => {
  const { user } = useAuth();
  const { messages, sendMessage, isLoading, clearChat } = useAIChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Magically auto-scroll on message update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || !user || isLoading) return;
    const toSend = input;
    setInput('');
    await sendMessage(toSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Find latest assistant suggestions
  const latestAssistantMessage = [...messages].reverse().find(m => m.type === 'assistant' && m.suggestions?.length);
  const mainSuggestion = latestAssistantMessage?.suggestions?.[0];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-white transition-all">
      {/* Genie header */}
      <header className="sticky top-0 z-20 w-full bg-gradient-to-b from-white/90 to-transparent backdrop-blur flex items-center gap-4 py-4 px-6 shadow-md">
        <GenieAvatar />
        <div>
          <h1 className="text-2xl font-genie font-extrabold text-dolater-mint tracking-tight flex items-center gap-2">
            Genie
            <span className="ml-2 p-1 bg-yellow-100 text-emerald-600 rounded-full text-xs font-bold animate-pulse">Magic</span>
          </h1>
          <p className="text-xs text-gray-500 font-medium">Your organizational genie</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={clearChat}
            className="border border-dolater-mint/40 bg-dolater-mint-light text-dolater-mint px-3 py-1 text-xs rounded-lg font-semibold shadow-sm hover:bg-dolater-mint hover:text-white transition"
            aria-label="Clear conversation"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Magic intro, only if near-empty chat */}
      {messages.length < 2 && (
        <section className="px-6 pt-6 md:pt-12 pb-2 flex flex-col gap-4 text-center items-center animate-fade-in">
          {MAGIC_INTRO.map((line, idx) => (
            <p key={idx} className="text-lg md:text-xl font-semibold text-blue-500">{line}</p>
          ))}
          <div className="flex flex-wrap gap-3 justify-center mt-1">
            {MAGIC_ACTIONS.map((action, idx) => (
              <MagicQuickAction key={idx} label={action} onSelect={setInput} />
            ))}
          </div>
        </section>
      )}

      {/* Chat area */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-1 py-3 md:py-6 flex flex-col gap-6 scrollbar-thin"
        style={{ minHeight: 0, maxHeight: "calc(100vh - 180px)" }}
      >
        {messages.map((msg, idx) => (
          <GenieMessage
            key={msg.id}
            type={msg.type}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}
        {/* Genie typing... */}
        {isLoading && <TypingDots />}
      </main>

      {/* Magic quick suggestion below chat */}
      {mainSuggestion && !isLoading && (
        <div className="w-full py-3 px-6">
          <button
            className="w-full flex items-center justify-center bg-gradient-to-r from-dolater-mint to-blue-400 text-white px-4 py-2 rounded-2xl font-bold shadow-lg gap-2 hover:scale-105 transition-transform duration-150 border-2 border-white ring-2 ring-dolater-mint/10 animate-scale-in"
            onClick={() => setInput(mainSuggestion)}
            aria-label={mainSuggestion}
          >
            <Sparkle size={20} className="text-yellow-100" />
            {mainSuggestion}
          </button>
        </div>
      )}

      {/* Input box area */}
      <footer className="sticky bottom-0 z-30 w-full bg-white/80 backdrop-blur px-4 py-5 flex items-end gap-3 border-t border-dolater-mint/20 shadow-md">
        <input
          className="flex-1 rounded-2xl border border-dolater-mint-light focus:ring-2 focus:ring-dolater-mint/30 px-5 py-3 min-h-[48px] text-base bg-white/80 shadow focus:outline-none transition-all duration-150"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Genie to grant your organizational wishes…"
          disabled={isLoading}
          aria-label="Message Genie"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className={cn(
            "ml-2 rounded-2xl px-5 py-3 font-bold uppercase bg-gradient-to-br from-dolater-mint to-blue-400 text-white shadow-lg hover:scale-105 transition-all flex items-center gap-2",
            (!input.trim() || isLoading) && "opacity-40 cursor-not-allowed"
          )}
          aria-label="Send message"
        >
          <Send size={22} className="mr-1" />
          Send
        </button>
      </footer>

      {/* Add magical Genie glow keyframes */}
      <style>{`
        @keyframes genie-glow {
          0% { box-shadow: 0 0 0 0 #10B98155, 0 0 0 4px #FCD34D22; }
          50% { box-shadow: 0 0 32px 8px #10B98177, 0 0 8px 8px #FCD34D11; }
          100% { box-shadow: 0 0 0 0 #10B98155, 0 0 0 4px #FCD34D22; }
        }
        .animate-genie-glow { animation: genie-glow 2.5s infinite alternate; }
        @keyframes float { 0% { transform: translateY(0); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0); } }
        .animate-float { animation: float 3s infinite; }
        @keyframes hoverQuickAction { 0% { filter: brightness(1); } 60% { filter: brightness(1.07); } 100% { filter: brightness(1.1); } }
        .animate-hover-quick:active { animation: hoverQuickAction 0.15s; }
      `}</style>
    </div>
  );
};

export default AssistantScreen;
