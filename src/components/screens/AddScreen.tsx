
import { useState } from 'react';
import { Plus, Link, Sparkles, Camera, Mic, FileText } from 'lucide-react';
import { useContentItems } from '@/hooks/useContentItems';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AddScreen = () => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('knowledge');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  
  const { addContentItem } = useContentItems();
  const { toast } = useToast();

  const categories = [
    { value: 'fitness', label: 'Fitness', color: 'bg-green-500' },
    { value: 'finance', label: 'Finance', color: 'bg-blue-500' },
    { value: 'knowledge', label: 'Knowledge', color: 'bg-purple-500' },
    { value: 'personal', label: 'Personal', color: 'bg-orange-500' },
    { value: 'work', label: 'Work', color: 'bg-gray-500' },
  ];

  const analyzeContent = async () => {
    if (!url.trim() && !title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL or title to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-content', {
        body: {
          url: url.trim(),
          title: title.trim(),
          content: notes.trim()
        }
      });

      if (error) throw error;

      setAiSuggestions(data);
      
      // Auto-fill form with AI suggestions
      if (data.summary && !notes.trim()) {
        setNotes(data.summary);
      }
      if (data.category) {
        setCategory(data.category);
      }
      if (data.priority) {
        setPriority(data.priority);
      }

      toast({
        title: "Content Analyzed!",
        description: "AI suggestions have been applied to your content",
      });
    } catch (error) {
      console.error('Error analyzing content:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze content. You can still save it manually.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!url.trim() && !title.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least a URL or title",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await addContentItem({
        title: title.trim() || url.trim(),
        summary: notes.trim(),
        url: url.trim() || '#',
        category,
        categoryLabel: categories.find(c => c.value === category)?.label || 'Knowledge',
        tags: aiSuggestions?.tags || [],
        priority,
        hasNotes: !!notes.trim(),
        hasChecklist: false,
        reminderSet: false,
        platform: url.includes('instagram') ? 'Instagram' : 
                 url.includes('tiktok') ? 'TikTok' : 
                 url.includes('youtube') ? 'YouTube' : 'Web',
        actionType: aiSuggestions?.actionType || 'read',
        userNotes: notes.trim(),
      });

      // Reset form
      setUrl('');
      setTitle('');
      setNotes('');
      setCategory('knowledge');
      setPriority('medium');
      setAiSuggestions(null);

      toast({
        title: "Success",
        description: "Content saved successfully!",
      });
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { icon: Link, label: 'Paste Link', action: () => navigator.clipboard?.readText().then(setUrl) },
    { icon: Camera, label: 'Photo', action: () => toast({ title: "Coming Soon", description: "Photo capture will be available soon!" }) },
    { icon: Mic, label: 'Voice Note', action: () => toast({ title: "Coming Soon", description: "Voice notes will be available soon!" }) },
    { icon: FileText, label: 'Quick Note', action: () => setTitle('Quick Note - ' + new Date().toLocaleDateString()) }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-lg font-bold text-dolater-text-primary">Add Content</h1>
        <p className="text-xs text-dolater-text-secondary">Save content to review later</p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="text-xs font-medium text-dolater-text-secondary mb-3">Quick Actions</div>
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="bg-dolater-mint text-white p-3 rounded-lg flex flex-col items-center space-y-1 hover:bg-dolater-mint-dark transition-colors"
              >
                <Icon size={16} />
                <span className="text-xs font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-white rounded-lg p-4 card-shadow space-y-4">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-dolater-text-primary mb-2">
              URL or Link
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-dolater-mint focus:ring-1 focus:ring-dolater-mint"
            />
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-dolater-text-primary mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this content"
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-dolater-mint focus:ring-1 focus:ring-dolater-mint"
            />
          </div>

          {/* AI Analysis Button */}
          <button
            onClick={analyzeContent}
            disabled={isAnalyzing || (!url.trim() && !title.trim())}
            className="w-full bg-gradient-to-r from-dolater-mint to-dolater-mint-dark text-white p-3 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            <Sparkles size={16} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}</span>
          </button>

          {/* AI Suggestions Display */}
          {aiSuggestions && (
            <div className="bg-dolater-mint-light border border-dolater-mint/20 rounded-lg p-3">
              <div className="text-sm font-medium text-dolater-mint mb-2">✨ AI Suggestions Applied</div>
              <div className="text-xs text-dolater-text-secondary space-y-1">
                <div>Category: {aiSuggestions.category}</div>
                <div>Priority: {aiSuggestions.priority}</div>
                <div>Tags: {aiSuggestions.tags?.join(', ')}</div>
                <div>Action: {aiSuggestions.actionType}</div>
              </div>
            </div>
          )}

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-dolater-text-primary mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    category === cat.value
                      ? `${cat.color} text-white`
                      : 'border-gray-200 text-dolater-text-secondary hover:bg-gray-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-medium text-dolater-text-primary mb-2">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                    priority === p
                      ? 'bg-dolater-mint text-white'
                      : 'border-gray-200 text-dolater-text-secondary hover:bg-gray-50'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-dolater-text-primary mb-2">
              Notes & Summary
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes or let AI analyze the content..."
              rows={4}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-dolater-mint focus:ring-1 focus:ring-dolater-mint resize-none"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-white border-t border-gray-200 p-4">
        <button
          onClick={handleSave}
          disabled={isLoading || (!url.trim() && !title.trim())}
          className="w-full bg-dolater-mint text-white p-4 rounded-lg font-semibold disabled:opacity-50 hover:bg-dolater-mint-dark transition-colors flex items-center justify-center space-x-2"
        >
          <Plus size={20} />
          <span>{isLoading ? 'Saving...' : 'Save Content'}</span>
        </button>
      </div>
    </div>
  );
};

export default AddScreen;
