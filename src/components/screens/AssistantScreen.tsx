
import { useRef, useEffect, useState } from 'react';
import { User, Bot, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAIChat } from '@/hooks/useAIChat';
import { cn } from '@/lib/utils';

function AssistantAvatar() {
  // Simple WhatsApp-style (circle, no special effects)
  return (
    <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
      <Bot size={20} className="text-white" />
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
      <User size={20} className="text-white" />
    </div>
  );
}

function ChatBubble({ type, content, timestamp }: { type: 'assistant' | 'user', content: string, timestamp: string }) {
  const isUser = type === 'user';

  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && <AssistantAvatar />}
      <div className={cn(
        "mx-2 my-1 max-w-[80vw] relative",
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}>
        <div
          className={cn(
            "px-4 py-2 rounded-2xl whitespace-pre-line shadow-sm text-[15px] leading-relaxed",
            isUser
              ? "bg-[#DCF8C6] text-gray-900 rounded-br-md"
              : "bg-white text-gray-900 rounded-bl-md border border-gray-200"
          )}
        >
          {content}
          <span className={cn(
            "absolute right-3 bottom-1 text-[11px] text-gray-400 select-none",
            isUser ? 'left-auto' : 'left-full ml-2'
          )}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
      {isUser && <UserAvatar />}
    </div>
  );
}

function TypingDots() {
  // Simple variant, WhatsApp-style three gray dots
  return (
    <div className="flex items-end gap-1 px-3 py-2">
      <AssistantAvatar />
      <div className="flex gap-1 bg-white px-3 py-2 rounded-2xl border border-gray-200 shadow-sm">
        <span className="block w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="block w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '120ms' }}></span>
        <span className="block w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '240ms' }}></span>
      </div>
    </div>
  );
}

const AssistantScreen = () => {
  const { user } = useAuth();
  const { messages, sendMessage, isLoading, clearChat } = useAIChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F0F0]">
      {/* Header: Like WhatsApp */}
      <header className="sticky top-0 z-10 w-full flex items-center gap-3 py-3 px-4 bg-[#075E54] shadow text-white">
        <AssistantAvatar />
        <div>
          <span className="font-semibold text-lg">Genie</span>
          <span className="block text-xs text-green-100">AI Assistant</span>
        </div>
        <div className="ml-auto">
          <button
            onClick={clearChat}
            className="bg-[#25d366] text-white text-xs rounded px-3 py-1 font-medium shadow hover:bg-[#1ebc59] transition"
          >Reset</button>
        </div>
      </header>

      {/* Chat area */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-2" 
        style={{ minHeight: 0, maxHeight: "calc(100vh - 120px)" }}
      >
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            type={msg.type}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}
        {isLoading && <TypingDots />}
      </main>

      {/* Input area */}
      <footer className="sticky bottom-0 w-full flex items-end gap-2 bg-white px-3 py-3 border-t border-gray-200">
        <input
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-base bg-gray-50 shadow focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-[#25D366] transition"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          disabled={isLoading}
          aria-label="Message Genie"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className={cn(
            "flex gap-1 items-center px-4 py-2 rounded-full font-bold bg-[#25d366] text-white shadow transition hover:bg-[#1ebc59]",
            (!input.trim() || isLoading) && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Send"
        >
          <Send size={20} /> 
        </button>
      </footer>
    </div>
  );
};

export default AssistantScreen;

