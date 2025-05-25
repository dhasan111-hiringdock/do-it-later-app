import { useState } from 'react';
import ContentCard from '../ContentCard';
import CategoryFilter from '../CategoryFilter';

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data for demonstration
  const mockContent = [
    {
      id: '1',
      title: '10 Morning Habits That Will Transform Your Life',
      summary: 'Discover science-backed morning routines that successful people use to start their day with purpose and energy.',
      url: 'https://example.com/morning-habits',
      category: 'fitness',
      categoryLabel: 'Fitness',
      tags: ['habits', 'productivity', 'wellness'],
      dateAdded: '2025-01-20',
      priority: 'medium' as const,
      hasNotes: true,
      hasChecklist: false,
      reminderSet: true
    },
    {
      id: '2',
      title: 'How to Build a $10k/Month Side Business',
      summary: 'Step-by-step guide to creating a profitable online business while working full-time.',
      url: 'https://example.com/side-business',
      category: 'finance',
      categoryLabel: 'Finance',
      tags: ['business', 'money', 'entrepreneurship'],
      dateAdded: '2025-01-19',
      priority: 'high' as const,
      hasNotes: false,
      hasChecklist: true,
      reminderSet: false
    },
    {
      id: '3',
      title: 'The Psychology of Habit Formation',
      summary: 'Understanding the science behind how habits are formed and how to make positive changes stick.',
      url: 'https://example.com/habit-psychology',
      category: 'knowledge',
      categoryLabel: 'Knowledge',
      tags: ['psychology', 'habits', 'self-improvement'],
      dateAdded: '2025-01-18',
      priority: 'low' as const,
      hasNotes: true,
      hasChecklist: true,
      reminderSet: true
    }
  ];

  const filteredContent = selectedCategory === 'all' 
    ? mockContent 
    : mockContent.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-dolater-text-primary">DoLater</h1>
            <p className="text-sm text-dolater-text-secondary">Don't Just Save It. Do It.</p>
          </div>
          <div className="bg-dolater-mint text-white px-3 py-1 rounded-full text-xs font-medium">
            Free Plan
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex space-x-4 mt-4">
          <div className="bg-white rounded-lg p-3 flex-1 card-shadow">
            <div className="text-lg font-bold text-dolater-text-primary">{mockContent.length}</div>
            <div className="text-xs text-dolater-text-secondary">Saved Items</div>
          </div>
          <div className="bg-white rounded-lg p-3 flex-1 card-shadow">
            <div className="text-lg font-bold text-dolater-text-primary">3</div>
            <div className="text-xs text-dolater-text-secondary">Categories</div>
          </div>
          <div className="bg-white rounded-lg p-3 flex-1 card-shadow">
            <div className="text-lg font-bold text-dolater-yellow">12</div>
            <div className="text-xs text-dolater-text-secondary">Left This Month</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Content Cards */}
      <div className="space-y-4">
        {filteredContent.length > 0 ? (
          filteredContent.map((item) => (
            <ContentCard key={item.id} content={item} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-dolater-text-secondary text-sm">
              No content in this category yet.
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-dolater-mint to-dolater-mint-dark rounded-lg p-4 text-white">
        <h3 className="font-semibold mb-2">Ready to take action?</h3>
        <p className="text-sm opacity-90 mb-3">
          You have {mockContent.filter(item => item.reminderSet).length} items with reminders set.
        </p>
        <button className="bg-white text-dolater-mint px-4 py-2 rounded-lg text-sm font-medium">
          Review Now
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
