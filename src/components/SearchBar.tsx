
import { useState } from 'react';
import { Search, Filter, Clock } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  recentSearches: string[];
  onRecentSearchClick: (search: string) => void;
  onFiltersClick: () => void;
}

const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  recentSearches, 
  onRecentSearchClick,
  onFiltersClick 
}: SearchBarProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = [
    'fitness workouts',
    'money tips',
    'productivity hacks',
    'cooking recipes',
    'travel guides'
  ];

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dolater-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search your saved content..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:border-dolater-mint focus:ring-1 focus:ring-dolater-mint"
            />
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && (searchQuery.length > 0 || recentSearches.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {recentSearches.length > 0 && (
                <div className="p-2 border-b border-gray-100">
                  <div className="text-xs font-medium text-dolater-text-secondary mb-2 flex items-center">
                    <Clock size={12} className="mr-1" />
                    Recent Searches
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => onRecentSearchClick(search)}
                      className="w-full text-left px-2 py-1 text-sm text-dolater-text-primary hover:bg-dolater-gray rounded"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              )}
              
              {searchQuery.length === 0 && (
                <div className="p-2">
                  <div className="text-xs font-medium text-dolater-text-secondary mb-2">Suggestions</div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => onRecentSearchClick(suggestion)}
                      className="w-full text-left px-2 py-1 text-sm text-dolater-text-primary hover:bg-dolater-gray rounded"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={onFiltersClick}
          className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-dolater-gray"
        >
          <Filter size={16} className="text-dolater-text-secondary" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
