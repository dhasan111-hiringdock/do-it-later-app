
import { Clock, FileText, CheckSquare, Bell, MoreVertical } from 'lucide-react';

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
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-category-urgent';
      case 'medium': return 'bg-category-finance';
      case 'low': return 'bg-category-fitness';
      default: return 'bg-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fitness': return 'bg-category-fitness';
      case 'finance': return 'bg-category-finance';
      case 'knowledge': return 'bg-category-knowledge';
      case 'personal': return 'bg-category-personal';
      case 'work': return 'bg-category-work';
      default: return 'bg-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg card-shadow p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 ${getPriorityColor(content.priority)} rounded-full`}></div>
          <span className={`px-2 py-1 ${getCategoryColor(content.category)} text-white text-xs font-medium rounded-full`}>
            {content.categoryLabel}
          </span>
        </div>
        <button className="text-dolater-text-secondary hover:text-dolater-text-primary">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Content */}
      <h3 className="font-semibold text-dolater-text-primary mb-2 line-clamp-2">
        {content.title}
      </h3>
      
      <p className="text-sm text-dolater-text-secondary mb-3 line-clamp-2">
        {content.summary}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {content.tags.slice(0, 3).map((tag, index) => (
          <span 
            key={index}
            className="px-2 py-1 bg-dolater-gray text-dolater-text-secondary text-xs rounded"
          >
            #{tag}
          </span>
        ))}
        {content.tags.length > 3 && (
          <span className="px-2 py-1 bg-dolater-gray text-dolater-text-secondary text-xs rounded">
            +{content.tags.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-dolater-text-secondary">
        <div className="flex items-center space-x-1">
          <Clock size={12} />
          <span>{formatDate(content.dateAdded)}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          {content.hasNotes && (
            <div className="flex items-center space-x-1 text-dolater-mint">
              <FileText size={12} />
              <span>Notes</span>
            </div>
          )}
          {content.hasChecklist && (
            <div className="flex items-center space-x-1 text-dolater-yellow">
              <CheckSquare size={12} />
              <span>Tasks</span>
            </div>
          )}
          {content.reminderSet && (
            <div className="flex items-center space-x-1 text-category-urgent">
              <Bell size={12} />
              <span>Reminder</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
