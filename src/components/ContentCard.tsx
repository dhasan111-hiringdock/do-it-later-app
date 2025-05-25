
import { Bell, CheckSquare, Calendar } from 'lucide-react';

interface ContentCardProps {
  content: {
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
  };
}

const ContentCard = ({ content }: ContentCardProps) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      urgent: 'bg-category-urgent',
      knowledge: 'bg-category-knowledge', 
      fitness: 'bg-category-fitness',
      finance: 'bg-category-finance',
      personal: 'bg-category-personal',
      work: 'bg-category-work',
      entertainment: 'bg-category-entertainment',
      food: 'bg-category-food'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-category-urgent';
      case 'medium': return 'border-l-category-personal';
      case 'low': return 'border-l-category-knowledge';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <div className={`bg-white rounded-lg p-4 card-shadow border-l-4 ${getPriorityColor(content.priority)} animate-fade-in`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-dolater-text-primary text-sm leading-relaxed">
            {content.title}
          </h3>
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs text-white mt-2 ${getCategoryColor(content.category)}`}>
            {content.categoryLabel}
          </div>
        </div>
      </div>

      {/* Summary */}
      <p className="text-dolater-text-secondary text-xs leading-relaxed mb-3">
        {content.summary}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {content.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-dolater-gray text-dolater-text-secondary px-2 py-1 rounded text-xs"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          {content.reminderSet && (
            <div className="flex items-center text-dolater-mint">
              <Bell size={12} />
            </div>
          )}
          {content.hasChecklist && (
            <div className="flex items-center text-dolater-yellow">
              <CheckSquare size={12} />
            </div>
          )}
          {content.hasNotes && (
            <div className="flex items-center text-dolater-text-secondary">
              <Calendar size={12} />
            </div>
          )}
        </div>
        
        <div className="text-xs text-dolater-text-secondary">
          {new Date(content.dateAdded).toLocaleDateString()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 mt-3">
        <button className="flex-1 bg-dolater-mint text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-dolater-mint-dark transition-colors">
          Take Action
        </button>
        <button className="bg-dolater-gray text-dolater-text-secondary py-2 px-3 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors">
          Later
        </button>
      </div>
    </div>
  );
};

export default ContentCard;
