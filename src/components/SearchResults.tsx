
import ContentCard from './ContentCard';

interface SearchResultsProps {
  results: any[];
  searchQuery: string;
  highlightMatches: (text: string) => string;
  totalCount: number;
}

const SearchResults = ({ results, searchQuery, highlightMatches, totalCount }: SearchResultsProps) => {
  if (!searchQuery) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-dolater-text-secondary mb-2">
          No results found for "{searchQuery}"
        </div>
        <div className="text-sm text-dolater-text-secondary">
          Try adjusting your search terms or filters
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-dolater-text-secondary">
        Found {results.length} result{results.length !== 1 ? 's' : ''} for "{searchQuery}"
        {totalCount > results.length && ` (of ${totalCount} total items)`}
      </div>
      
      <div className="grid gap-4">
        {results.map((item) => (
          <div key={item.id} className="relative">
            <ContentCard 
              content={item}
            />
            {/* Search match indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-dolater-yellow rounded-full border-2 border-white"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
