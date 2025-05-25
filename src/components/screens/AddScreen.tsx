
import { useState } from 'react';
import { Bell } from 'lucide-react';

const AddScreen = () => {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddContent = async () => {
    if (!url.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      setUrl('');
      // Here you would typically save the content and show success
      alert('Content saved successfully! 🎉');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pt-2">
        <h1 className="text-2xl font-bold text-dolater-text-primary mb-2">Add Content</h1>
        <p className="text-sm text-dolater-text-secondary">
          Save content from any platform to review later
        </p>
      </div>

      {/* Main Input */}
      <div className="bg-white rounded-lg p-6 card-shadow">
        <label className="block text-sm font-medium text-dolater-text-primary mb-3">
          Paste Link or Share from App
        </label>
        
        <div className="space-y-4">
          <textarea
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://instagram.com/reel/abc123...&#10;&#10;Or paste from YouTube, Facebook, Reddit, any website!"
            className="w-full p-4 border border-gray-200 rounded-lg resize-none h-32 text-sm focus:border-dolater-mint focus:ring-1 focus:ring-dolater-mint"
          />
          
          <button
            onClick={handleAddContent}
            disabled={!url.trim() || isProcessing}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              !url.trim() || isProcessing
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-dolater-mint text-white hover:bg-dolater-mint-dark'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>AI Processing...</span>
              </div>
            ) : (
              'Save Content'
            )}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 card-shadow text-center">
          <div className="w-12 h-12 bg-dolater-mint-light rounded-full flex items-center justify-center mx-auto mb-3">
            <Bell className="text-dolater-mint" size={20} />
          </div>
          <h3 className="font-medium text-dolater-text-primary text-sm">Share from Apps</h3>
          <p className="text-xs text-dolater-text-secondary mt-1">
            Use the share button in Instagram, YouTube, etc.
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-4 card-shadow text-center">
          <div className="w-12 h-12 bg-dolater-yellow rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-lg">🔗</span>
          </div>
          <h3 className="font-medium text-dolater-text-primary text-sm">Paste URL</h3>
          <p className="text-xs text-dolater-text-secondary mt-1">
            Copy and paste any link from the web
          </p>
        </div>
      </div>

      {/* Recent Saves */}
      <div className="bg-white rounded-lg p-4 card-shadow">
        <h3 className="font-medium text-dolater-text-primary mb-3">Recent Saves</h3>
        <div className="space-y-3">
          {['Fitness routine video', 'Investment article', 'Recipe for healthy meals'].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-dolater-text-secondary">{item}</span>
              <span className="text-xs text-dolater-mint">Saved</span>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-gradient-to-r from-dolater-mint to-dolater-mint-dark rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Free Plan</h3>
            <p className="text-sm opacity-90">12 saves left this month</p>
          </div>
          <button className="bg-white text-dolater-mint px-4 py-2 rounded-lg text-sm font-medium">
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddScreen;
