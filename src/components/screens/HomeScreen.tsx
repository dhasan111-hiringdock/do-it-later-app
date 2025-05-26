
import { useState } from 'react';
import ContentCard from '../ContentCard';
import CategoryFilter from '../CategoryFilter';
import SearchBar from '../SearchBar';
import SearchFilters from '../SearchFilters';
import SearchResults from '../SearchResults';
import { useSearch } from '../../hooks/useSearch';
import { useContentItems } from '../../hooks/useContentItems';
import { useAuth } from '../../hooks/useAuth';

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  const { contentItems, loading } = useContentItems();

  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    searchResults,
    recentSearches,
    addRecentSearch,
    highlightMatches
  } = useSearch(contentItems);

  const filteredContent = searchQuery 
    ? searchResults 
    : selectedCategory === 'all' 
      ? contentItems 
      : contentItems.filter(item => item.category === selectedCategory);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      addRecentSearch(query);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-dolater-mint border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-dolater-text-primary">DoLater</h1>
            <p className="text-sm text-dolater-text-secondary">Don't Just Save It. Do It.</p>
          </div>
          <div className="bg-dolater-mint text-white px-3 py-1 rounded-full text-xs font-medium">
            Free Plan
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex space-x-4 mb-4">
          <div className="bg-white rounded-lg p-3 flex-1 card-shadow">
            <div className="text-lg font-bold text-dolater-text-primary">{contentItems.length}</div>
            <div className="text-xs text-dolater-text-secondary">Saved Items</div>
          </div>
          <div className="bg-white rounded-lg p-3 flex-1 card-shadow">
            <div className="text-lg font-bold text-dolater-text-primary">
              {new Set(contentItems.map(item => item.category)).size}
            </div>
            <div className="text-xs text-dolater-text-secondary">Categories</div>
          </div>
          <div className="bg-white rounded-lg p-3 flex-1 card-shadow">
            <div className="text-lg font-bold text-dolater-yellow">
              {contentItems.filter(item => item.reminderSet).length}
            </div>
            <div className="text-xs text-dolater-text-secondary">With Reminders</div>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          recentSearches={recentSearches}
          onRecentSearchClick={handleRecentSearchClick}
          onFiltersClick={() => setShowFilters(true)}
        />
      </div>

      {/* Category Filter - only show when not searching */}
      {!searchQuery && (
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      )}

      {/* Search Results or Content Cards */}
      {searchQuery ? (
        <SearchResults
          results={filteredContent}
          searchQuery={searchQuery}
          highlightMatches={highlightMatches}
          totalCount={contentItems.length}
        />
      ) : (
        <div className="grid gap-4">
          {filteredContent.length > 0 ? (
            filteredContent.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-dolater-text-secondary text-sm">
                {contentItems.length === 0 
                  ? "No content saved yet. Start by adding some content!"
                  : "No content in this category yet."
                }
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions - only show when not searching and has content */}
      {!searchQuery && contentItems.length > 0 && (
        <div className="bg-gradient-to-r from-dolater-mint to-dolater-mint-dark rounded-lg p-4 text-white">
          <h3 className="font-semibold mb-2">Ready to take action?</h3>
          <p className="text-sm opacity-90 mb-3">
            You have {contentItems.filter(item => item.reminderSet).length} items with reminders set.
          </p>
          <button className="bg-white text-dolater-mint px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Review Now
          </button>
        </div>
      )}

      {/* Search Filters Modal */}
      <SearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClose={() => setShowFilters(false)}
        isOpen={showFilters}
      />
    </div>
  );
};

export default HomeScreen;
