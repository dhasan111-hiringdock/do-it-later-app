
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
    <div className={cn("flex w-full mb-4", isUser ? "justify-end" : "justify-start")}>
      <div className={cn(
        "relative",
        isUser ? "items-end" : "items-start"
      )}>
        <div
          className={cn(
            "max-w-[75vw] md:max-w-[30vw] px-6 py-3 shadow-xl rounded-2xl text-base whitespace-pre-line font-medium transition-all duration-300",
            isUser 
              ? "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900 rounded-br-lg border border-gray-300 dark:from-gray-700 dark:to-gray-900 dark:text-white dark:border-gray-700"
              : "bg-gradient-to-br from-emerald-100 via-white to-amber-100 text-emerald-900 rounded-bl-lg border border-emerald-100 dark:bg-gradient-to-br dark:from-emerald-700 dark:to-emerald-900 dark:text-amber-100 dark:border-emerald-900",
            animate && "animate-fade-in"
          )}
        >
          {content}
          <span className="block text-[11px] text-right text-gray-400 mt-1 select-none">
            {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </div>
  );
}
