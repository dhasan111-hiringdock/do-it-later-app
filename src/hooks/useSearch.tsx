
import { useState, useMemo } from 'react';

interface SearchFilters {
  platform: string;
  category: string;
  dateRange: string;
  actionType: string;
}

interface ContentItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  category: string;
  categoryLabel: string;
  tags: string[];
  dateAdded: string;
  priority: 'low' | 'medium' | 'high';
  hasNotes: boolean;
  hasChecklist: boolean;
  reminderSet: boolean;
  platform?: string;
  actionType?: string;
  userNotes?: string;
  transcript?: string;
}

export const useSearch = (content: ContentItem[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    platform: 'all',
    category: 'all',
    dateRange: 'all',
    actionType: 'all'
  });
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('dolater-recent-searches');
    return saved ? JSON.parse(saved) : [];
  });

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('dolater-recent-searches', JSON.stringify(updated));
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return content;

    const query = searchQuery.toLowerCase();
    
    return content.filter(item => {
      // Text search across multiple fields
      const searchableText = [
        item.title,
        item.summary,
        item.categoryLabel,
        item.userNotes || '',
        item.transcript || '',
        ...item.tags
      ].join(' ').toLowerCase();

      const matchesText = searchableText.includes(query);

      // Apply filters
      const matchesPlatform = filters.platform === 'all' || item.platform === filters.platform;
      const matchesCategory = filters.category === 'all' || item.category === filters.category;
      const matchesActionType = filters.actionType === 'all' || item.actionType === filters.actionType;

      // Date filter logic
      let matchesDate = true;
      if (filters.dateRange !== 'all') {
        const itemDate = new Date(item.dateAdded);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));

        switch (filters.dateRange) {
          case 'today':
            matchesDate = daysDiff === 0;
            break;
          case 'week':
            matchesDate = daysDiff <= 7;
            break;
          case 'month':
            matchesDate = daysDiff <= 30;
            break;
        }
      }

      return matchesText && matchesPlatform && matchesCategory && matchesActionType && matchesDate;
    });
  }, [content, searchQuery, filters]);

  const highlightMatches = (text: string) => {
    if (!searchQuery.trim()) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.replace(regex, '<mark class="bg-dolater-yellow text-dolater-text-primary">$1</mark>');
  };

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    searchResults,
    recentSearches,
    addRecentSearch,
    highlightMatches
  };
};
