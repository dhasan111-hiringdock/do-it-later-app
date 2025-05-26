
import { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';

interface AISearchBarProps {
  onAISearch: (query: string) => void;
  isLoading?: boolean;
  isPro?: boolean;
}

const AISearchBar = ({ onAISearch, isLoading = false, isPro = false }: AISearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onAISearch(query.trim());
      setQuery('');
    }
  };

  const suggestions = [
    "Create a workout plan from my fitness saves",
    "Summarize money tips into actionable steps",
    "Build a content calendar from growth hacks",
    "Make a shopping list from recipe saves"
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-3">
        <Sparkles size={20} className="text-dolater-mint" />
        <h3 className="font-semibold text-dolater-text-primary">AI Assistant</h3>
        {!isPro && (
          <span className="bg-dolater-yellow text-dolater-text-primary px-2 py-1 rounded-full text-xs font-medium">
            Pro
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me to create plans, summaries, or organize your saved content..."
            className="w-full p-3 pr-12 border border-gray-200 rounded-lg text-sm focus:border-dolater-mint focus:ring-1 focus:ring-dolater-mint resize-none"
            rows={3}
            disabled={!isPro || isLoading}
          />
          <button
            type="submit"
            disabled={!query.trim() || !isPro || isLoading}
            className="absolute bottom-2 right-2 p-2 bg-dolater-mint text-white rounded-lg disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>

        {!isPro && (
          <div className="bg-dolater-mint-light p-3 rounded-lg">
            <p className="text-sm text-dolater-mint mb-2">
              Unlock AI-powered content organization with DoLater Pro
            </p>
            <button className="bg-dolater-mint text-white px-4 py-2 rounded-lg text-sm font-medium">
              Upgrade to Pro
            </button>
          </div>
        )}
      </form>

      {isPro && (
        <div className="space-y-2">
          <div className="text-xs text-dolater-text-secondary font-medium">Try asking:</div>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setQuery(suggestion)}
              className="w-full text-left p-2 text-sm text-dolater-text-secondary bg-dolater-gray rounded hover:bg-gray-200"
            >
              "{suggestion}"
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AISearchBar;
