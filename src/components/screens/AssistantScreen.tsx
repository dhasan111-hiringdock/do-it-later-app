
import { useRef, useEffect, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAIChat } from "@/hooks/useAIChat";
import { cn } from "@/lib/utils";
import GenieHeroBar from "./GenieHeroBar";
import GenieBubble from "./GenieBubble";

function GenieTypingDots() {
  return (
    <div className="flex items-center mb-6 ml-1">
      <div className="min-h-[46px] flex items-center">
        <div className="flex items-center gap-1 bg-gradient-to-br from-emerald-100 to-white dark:from-emerald-900 dark:to-emerald-700 px-6 py-3 rounded-2xl shadow border border-emerald-100 dark:border-emerald-900 animate-fade-in">
          <span className="block w-2 h-2 rounded-full bg-emerald-400 dark:bg-amber-400 animate-bounce"
            style={{ animationDelay: "0ms" }} />
          <span className="block w-2 h-2 rounded-full bg-emerald-300 dark:bg-amber-300 animate-bounce"
            style={{ animationDelay: "120ms" }} />
          <span className="block w-2 h-2 rounded-full bg-emerald-200 dark:bg-amber-200 animate-bounce"
            style={{ animationDelay: "240ms" }} />
        </div>
      </div>
    </div>
  );
}

function GenieQuickSuggestions({ suggestions, onSend }: { suggestions: string[], onSend: (msg: string) => void }) {
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 my-3 px-1 items-center animate-fade-in">
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSend(s)}
          className="bg-white/80 hover:bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/80 dark:hover:bg-emerald-800 dark:border-emerald-800 text-emerald-900 dark:text-amber-100 rounded-full px-4 py-2 font-medium shadow-sm transition"
        >
          <Sparkles className="inline -mt-1 mr-1" size={17} />
          {s}
        </button>
      ))}
    </div>
  );
}

const AssistantScreen = () => {
  const { user } = useAuth();
  const { messages, sendMessage, isLoading, clearChat } = useAIChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-100 via-white to-amber-100 dark:from-gray-900 dark:via-black dark:to-emerald-950">
      <GenieHeroBar />

      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-2 py-8 flex flex-col gap-2"
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

      <footer className="sticky bottom-0 w-full flex items-end gap-2 bg-white/70 dark:bg-black/40 px-4 py-5 border-t border-gray-200 dark:border-gray-800 backdrop-blur-md z-10">
        <input
          className="flex-1 rounded-2xl border bg-white/80 dark:bg-gray-900 border-emerald-200 dark:border-emerald-900 px-5 py-3 font-medium text-base shadow focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition dark:text-white"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your wish…"
          disabled={isLoading}
          aria-label="Message Genie"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className={cn(
            "flex items-center px-5 py-[13px] rounded-2xl font-bold bg-gradient-to-br from-amber-300 via-emerald-400 to-teal-600 text-white shadow-xl transition hover:scale-[1.05] active:scale-100",
            (!input.trim() || isLoading) && "opacity-60 cursor-not-allowed"
          )}
          aria-label="Send"
        >
          <Send size={22} />
        </button>
        <button
          onClick={clearChat}
          className="ml-2 text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs px-2 py-2 rounded-xl transition border border-transparent hover:border-emerald-200"
          title="Reset chat"
        >
          Reset
        </button>
      </footer>
    </div>
  );
};

export default AssistantScreen;
