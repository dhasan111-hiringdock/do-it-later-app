
import { useState } from 'react';
import { Sparkles, Send, Zap, FileText, Calendar, CheckSquare, RotateCcw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAIChat } from '@/hooks/useAIChat';

const AssistantScreen = () => {
  const [inputMessage, setInputMessage] = useState('');
  const { user } = useAuth();
  const { messages, sendMessage, isLoading, clearChat } = useAIChat();

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return;
    
    const message = inputMessage;
    setInputMessage('');
    await sendMessage(message);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const quickActions = [
    { icon: FileText, label: 'Create Plan', query: 'Create a plan from my saved content', color: 'bg-dolater-mint' },
    { icon: CheckSquare, label: 'Organize', query: 'Help me organize my saves by category', color: 'bg-dolater-yellow' },
    { icon: Calendar, label: 'Schedule', query: 'Help me create a schedule from my content', color: 'bg-purple-500' },
    { icon: Zap, label: 'Quick Action', query: 'What should I do first with my saves?', color: 'bg-orange-500' }
  ];

  const getLatestSuggestions = () => {
    const lastAssistantMessage = messages
      .slice()
      .reverse()
      .find(msg => msg.type === 'assistant' && msg.suggestions);
    return lastAssistantMessage?.suggestions || [];
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-dolater-mint to-dolater-mint-dark rounded-full flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-dolater-text-primary">Smart Assistant</h1>
              <p className="text-xs text-dolater-text-secondary">Internal AI • Always Available</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-xs"
            title="Clear chat"
          >
            <RotateCcw size={14} />
            <span>Clear</span>
          </button>
        </div>
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
                onClick={() => handleSuggestionClick(action.query)}
                className={`${action.color} text-white p-3 rounded-lg flex flex-col items-center space-y-1 hover:opacity-90 transition-opacity`}
              >
                <Icon size={16} />
                <span className="text-xs font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-dolater-mint text-white rounded-br-sm'
                    : 'bg-white card-shadow text-dolater-text-primary rounded-bl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <span className={`text-xs mt-2 block ${
                  message.type === 'user' ? 'text-green-100' : 'text-dolater-text-secondary'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
            
            {/* Show suggestions for assistant messages */}
            {message.type === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
              <div className="flex justify-start">
                <div className="max-w-[85%] space-y-2">
                  <div className="text-xs text-dolater-text-secondary font-medium">Try asking:</div>
                  <div className="flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="bg-dolater-gray hover:bg-gray-200 text-dolater-text-secondary text-xs px-3 py-1 rounded-full transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white card-shadow text-dolater-text-primary max-w-[85%] p-3 rounded-lg rounded-bl-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-dolater-mint rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-dolater-mint rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-dolater-mint rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-sm text-dolater-text-secondary">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions from latest message */}
      {getLatestSuggestions().length > 0 && !isLoading && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="text-xs font-medium text-dolater-text-secondary mb-2">Quick suggestions:</div>
          <div className="flex flex-wrap gap-2">
            {getLatestSuggestions().slice(0, 4).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="bg-dolater-mint/10 hover:bg-dolater-mint/20 text-dolater-mint text-xs px-3 py-2 rounded-lg transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me to organize content, create plans, or build routines from your saves..."
            className="flex-1 p-3 border border-gray-200 rounded-lg text-sm focus:border-dolater-mint focus:ring-1 focus:ring-dolater-mint"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-dolater-mint text-white p-3 rounded-lg disabled:opacity-50 hover:bg-dolater-mint-dark transition-colors disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-white">Internal AI Assistant</h3>
            <p className="text-xs text-white opacity-90">Powered by smart content analysis • Always available</p>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-white text-green-600">
            ✓ Ready
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantScreen;
