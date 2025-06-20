
import { useRef, useEffect, useState } from "react";
import { Send, Sparkles, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAIChat } from "@/hooks/useAIChat";
import { cn } from "@/lib/utils";
import GenieHeroBar from "./GenieHeroBar";
import GenieBubble from "./GenieBubble";

function GenieTypingDots() {
  return (
    <div className="flex items-center mb-4">
      <div className="flex items-center gap-1 bg-dolater-mint-light dark:bg-dolater-mint-dark px-5 py-3 rounded-2xl shadow-sm border border-dolater-mint-light dark:border-dolater-mint-dark">
        <span className="block w-2 h-2 rounded-full bg-dolater-mint animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="block w-2 h-2 rounded-full bg-dolater-mint/70 animate-bounce" style={{ animationDelay: "100ms" }} />
        <span className="block w-2 h-2 rounded-full bg-dolater-mint/40 animate-bounce" style={{ animationDelay: "200ms" }} />
      </div>
    </div>
  );
}

function GenieQuickSuggestions({ suggestions, onSend }: { suggestions: string[], onSend: (msg: string) => void }) {
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 my-2 px-2 items-center animate-fade-in">
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSend(s)}
          className="bg-white border border-dolater-mint-light dark:bg-gray-900 dark:border-dolater-mint-dark text-dolater-mint-dark dark:text-white rounded-full px-4 py-2 font-medium shadow-sm transition hover:bg-dolater-mint-light/50 dark:hover:bg-dolater-mint-dark/50"
        >
          <Sparkles className="inline -mt-1 mr-1" size={16} />
          {s}
        </button>
      ))}
    </div>
  );
}

function ApiStatusIndicator({ status, onCheck }: { status: 'healthy' | 'error' | 'checking', onCheck: () => void }) {
  const statusConfig = {
    healthy: { icon: CheckCircle, color: "text-green-500", text: "AI Ready" },
    error: { icon: AlertCircle, color: "text-red-500", text: "AI Error" },
    checking: { icon: Loader2, color: "text-yellow-500", text: "Checking..." }
  };

  const { icon: Icon, color, text } = statusConfig[status];

  return (
    <button 
      onClick={onCheck}
      className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      title="Click to check API status"
    >
      <Icon size={12} className={cn(color, status === 'checking' && "animate-spin")} />
      <span className={color}>{text}</span>
    </button>
  );
}

const AssistantScreen = () => {
  const { user } = useAuth();
  const { messages, sendMessage, isLoading, apiStatus, checkHealth, clearChat } = useAIChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  useEffect(() => {
    // Check API health on mount
    checkHealth();
  }, [checkHealth]);

  // Find latest assistant message with suggestions
  const latestAssistantMsg = [...messages].reverse().find(m => m.type === "assistant" && m.suggestions?.length);

  const handleSend = async (msg?: string) => {
    const toSend = (msg === undefined ? input : msg);
    if (!toSend.trim() || !user || isLoading) return;
    setInput("");
    await sendMessage(toSend.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <GenieHeroBar />
      
      {/* API Status Bar */}
      <div className="px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Intelligent content analysis & summarization
        </div>
        <ApiStatusIndicator status={apiStatus} onCheck={checkHealth} />
      </div>

      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto flex flex-col gap-2 px-1 pt-4 pb-1"
        style={{ minHeight: 0 }}
      >
        {messages.map((msg) => (
          <GenieBubble
            key={msg.id}
            type={msg.type}
            content={msg.content}
            timestamp={msg.timestamp}
            animate
          />
        ))}
        {isLoading && <GenieTypingDots />}
        <GenieQuickSuggestions suggestions={latestAssistantMsg?.suggestions ?? []} onSend={handleSend} />
      </main>
      
      <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-3 py-4 flex items-end gap-2">
        <input
          className="flex-1 rounded-2xl border bg-white dark:bg-gray-950 border-dolater-mint-light dark:border-dolater-mint-dark px-5 py-3 font-medium text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-dolater-mint focus:border-dolater-mint transition dark:text-white placeholder-gray-400"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={apiStatus === 'error' ? "API not ready..." : "Ask me to analyze your content..."}
          disabled={isLoading || apiStatus === 'error'}
          aria-label="Message Genie"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim() || apiStatus === 'error'}
          className={cn(
            "flex items-center px-5 py-[13px] rounded-2xl font-bold bg-gradient-to-br from-dolater-mint to-dolater-mint-dark text-white shadow-xl transition hover:scale-[1.05] active:scale-100",
            (!input.trim() || isLoading || apiStatus === 'error') && "opacity-60 cursor-not-allowed"
          )}
          aria-label="Send"
        >
          <Send size={21} />
        </button>
        <button
          onClick={clearChat}
          className="ml-1 text-dolater-text-secondary hover:text-dolater-mint-dark dark:hover:text-dolater-mint text-xs px-2 py-2 rounded-xl transition border border-transparent hover:border-dolater-mint-light"
          title="Reset chat"
        >
          Reset
        </button>
      </footer>
    </div>
  );
};

export default AssistantScreen;
