
import { Clock, FileText, CheckSquare, Bell, MoreVertical, ExternalLink } from 'lucide-react';

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
    platform?: string;
    userNotes?: string;
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

  const getPlaceholderImage = (category: string) => {
    switch (category) {
      case 'fitness': return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop';
      case 'finance': return 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop';
      case 'knowledge': return 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop';
      default: return 'https://images.unsplash.com/photo-1611095790444-1dfa35be5ed4?w=400&h=200&fit=crop';
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

  const handleCardClick = () => {
    console.log('Card clicked:', content.title);
    // Open content in new tab
    if (content.url) {
      window.open(content.url, '_blank');
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Menu clicked for:', content.title);
    // TODO: Show options menu
  };

  return (
    <div 
      className="bg-white rounded-lg card-shadow hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative">
        <img 
          src={getPlaceholderImage(content.category)}
          alt={content.title}
          className="w-full h-32 object-cover rounded-t-lg"
        />
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <div className={`w-3 h-3 ${getPriorityColor(content.priority)} rounded-full`}></div>
          <span className={`px-2 py-1 ${getCategoryColor(content.category)} text-white text-xs font-medium rounded-full`}>
            {content.categoryLabel}
          </span>
        </div>
        <button 
          className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full text-dolater-text-secondary hover:text-dolater-text-primary backdrop-blur-sm"
          onClick={handleMenuClick}
        >
          <MoreVertical size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-dolater-text-primary mb-2 line-clamp-2 text-sm">
          {content.title}
        </h3>
        
        <p className="text-xs text-dolater-text-secondary mb-3 line-clamp-2">
          {content.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {content.tags.slice(0, 2).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-dolater-gray text-dolater-text-secondary text-xs rounded"
            >
              #{tag}
            </span>
          ))}
          {content.tags.length > 2 && (
            <span className="px-2 py-1 bg-dolater-gray text-dolater-text-secondary text-xs rounded">
              +{content.tags.length - 2}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-dolater-text-secondary">
          <div className="flex items-center space-x-1">
            <Clock size={12} />
            <span>{formatDate(content.dateAdded)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {content.hasNotes && (
              <div className="flex items-center space-x-1 text-dolater-mint">
                <FileText size={10} />
              </div>
            )}
            {content.hasChecklist && (
              <div className="flex items-center space-x-1 text-dolater-yellow">
                <CheckSquare size={10} />
              </div>
            )}
            {content.reminderSet && (
              <div className="flex items-center space-x-1 text-category-urgent">
                <Bell size={10} />
              </div>
            )}
            <ExternalLink size={10} className="text-dolater-text-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
