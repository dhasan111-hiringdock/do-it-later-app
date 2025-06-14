
import { cn } from "@/lib/utils";

interface GenieBubbleProps {
  type: "user" | "assistant";
  content: string;
  timestamp: string;
  animate?: boolean;
}
export default function GenieBubble({ type, content, timestamp, animate }: GenieBubbleProps) {
  const isUser = type === "user";
  return (
    <div className={cn(
      "flex w-full mb-3",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={
        cn(
          "max-w-[75vw] md:max-w-[32vw] px-5 py-3 rounded-2xl text-base whitespace-pre-line font-medium shadow-sm transition-all duration-300 border",
          isUser
            ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-dolater-text-primary"
            : "bg-dolater-mint-light dark:bg-dolater-mint-dark border-dolater-mint-light dark:border-dolater-mint-dark text-dolater-mint-dark dark:text-white",
          animate && "animate-fade-in"
        )
      }>
        <span>{content}</span>
        <span className="block text-[11px] text-right text-gray-400 mt-2 select-none font-normal">
          {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
