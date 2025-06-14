
import { Bot } from "lucide-react";

const GenieHeroBar = () => {
  return (
    <header className="backdrop-blur-md bg-white/70 dark:bg-black/40 shadow-lg sticky top-0 z-20 flex items-center px-4 py-4 rounded-b-xl border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 via-emerald-400 to-teal-600 shadow-lg flex items-center justify-center border-2 border-amber-100 dark:border-emerald-900">
          <Bot size={28} className="text-emerald-800 dark:text-amber-400" />
        </div>
        <div>
          <span className="block text-2xl font-playfair font-bold tracking-tight text-gray-900 dark:text-white">Genie</span>
          <span className="block text-[13px] text-gray-500 dark:text-gray-300 italic">Your premium AI assistant</span>
        </div>
      </div>
    </header>
  );
};

export default GenieHeroBar;
