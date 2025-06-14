
import { Bot } from "lucide-react";

const GenieHeroBar = () => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-dolater-mint to-dolater-mint-dark flex items-center justify-center border-2 border-dolater-mint-light shadow-sm">
          <Bot size={26} className="text-white" />
        </div>
        <div>
          <span className="block text-xl font-bold text-dolater-text-primary dark:text-white leading-tight">
            Genie
          </span>
          <span className="block text-xs text-dolater-text-secondary dark:text-gray-300">
            Your premium AI assistant
          </span>
        </div>
      </div>
      <span className="bg-dolater-mint text-white text-xs font-medium px-3 py-1 rounded-full">PRO</span>
    </header>
  );
};

export default GenieHeroBar;
