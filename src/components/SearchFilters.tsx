
import { X } from 'lucide-react';

interface SearchFiltersProps {
  filters: {
    platform: string;
    category: string;
    dateRange: string;
    actionType: string;
  };
  onFiltersChange: (filters: any) => void;
  onClose: () => void;
  isOpen: boolean;
}

const SearchFilters = ({ filters, onFiltersChange, onClose, isOpen }: SearchFiltersProps) => {
  if (!isOpen) return null;

  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'reddit', label: 'Reddit' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'twitter', label: 'Twitter' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'finance', label: 'Finance' },
    { value: 'knowledge', label: 'Knowledge' },
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Work' }
  ];

  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const actionTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'learn', label: 'Learn' },
    { value: 'do', label: 'Do' },
    { value: 'buy', label: 'Buy' }
  ];

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      platform: 'all',
      category: 'all',
      dateRange: 'all',
      actionType: 'all'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-lg p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-dolater-text-primary">Filters</h3>
          <button onClick={onClose} className="text-dolater-text-secondary">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Platform Filter */}
          <div>
            <label className="block text-sm font-medium text-dolater-text-primary mb-2">Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.value}
                  onClick={() => handleFilterChange('platform', platform.value)}
                  className={`p-2 text-sm rounded-lg border ${
                    filters.platform === platform.value
                      ? 'bg-dolater-mint text-white border-dolater-mint'
                      : 'bg-white text-dolater-text-primary border-gray-200'
                  }`}
                >
                  {platform.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-dolater-text-primary mb-2">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleFilterChange('category', category.value)}
                  className={`p-2 text-sm rounded-lg border ${
                    filters.category === category.value
                      ? 'bg-dolater-mint text-white border-dolater-mint'
                      : 'bg-white text-dolater-text-primary border-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-dolater-text-primary mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              {dateRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => handleFilterChange('dateRange', range.value)}
                  className={`p-2 text-sm rounded-lg border ${
                    filters.dateRange === range.value
                      ? 'bg-dolater-mint text-white border-dolater-mint'
                      : 'bg-white text-dolater-text-primary border-gray-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Type Filter */}
          <div>
            <label className="block text-sm font-medium text-dolater-text-primary mb-2">Action Type</label>
            <div className="grid grid-cols-3 gap-2">
              {actionTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleFilterChange('actionType', type.value)}
                  className={`p-2 text-sm rounded-lg border ${
                    filters.actionType === type.value
                      ? 'bg-dolater-mint text-white border-dolater-mint'
                      : 'bg-white text-dolater-text-primary border-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={clearAllFilters}
            className="flex-1 py-3 text-dolater-mint border border-dolater-mint rounded-lg font-medium"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-dolater-mint text-white rounded-lg font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
