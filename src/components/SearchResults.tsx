
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
      </div>
      
      {results.map((item) => (
        <div key={item.id}>
          <ContentCard 
            content={{
              ...item,
              title: highlightMatches(item.title),
              summary: highlightMatches(item.summary)
            }} 
          />
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
