
import { useState } from 'react';
import { Sparkles, Send, Zap, FileText, Calendar, CheckSquare } from 'lucide-react';

const AssistantScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your DoLater AI Assistant. I can help you create action plans, build habits, and turn your saved content into achievable goals. What would you like to work on today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsAILoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "That's a great goal! Let me help you create a step-by-step plan. This feature is available in DoLater Pro. Would you like to upgrade to unlock the full AI Assistant?",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsAILoading(false);
    }, 1000);
  };

  const quickActions = [
    { icon: FileText, label: 'Create Plan', color: 'bg-dolater-mint' },
    { icon: CheckSquare, label: 'Build Habits', color: 'bg-dolater-yellow' },
    { icon: Calendar, label: 'Schedule', color: 'bg-purple-500' },
    { icon: Zap, label: 'Quick Action', color: 'bg-orange-500' }
  ];

  const suggestions = [
    "Create a workout plan from my fitness saves",
    "Summarize money tips into actionable steps", 
    "Build a content calendar from growth hacks",
    "Make a shopping list from recipe saves"
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-dolater-mint to-dolater-mint-dark rounded-full flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-dolater-text-primary">AI Assistant</h1>
            <p className="text-xs text-dolater-text-secondary">Your personal productivity coach</p>
          </div>
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
                onClick={() => setInputMessage(`Help me with ${action.label.toLowerCase()}`)}
                className={`${action.color} text-white p-3 rounded-lg flex flex-col items-center space-y-1 hover:opacity-90 transition-opacity`}
              >
                <Icon size={16} />
                <span className="text-xs font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="text-xs font-medium text-dolater-text-secondary mb-3">Try asking:</div>
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(suggestion)}
              className="w-full text-left p-2 text-sm text-dolater-text-secondary bg-dolater-gray rounded hover:bg-gray-200 transition-colors"
            >
              "{suggestion}"
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
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
        ))}
        {isAILoading && (
          <div className="flex justify-start">
            <div className="bg-white card-shadow text-dolater-text-primary max-w-[85%] p-3 rounded-lg rounded-bl-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-dolater-mint rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-dolater-mint rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-dolater-mint rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-sm text-dolater-text-secondary">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Single Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me to create plans, organize content, or build habits from your saves..."
            className="flex-1 p-3 border border-gray-200 rounded-lg text-sm focus:border-dolater-mint focus:ring-1 focus:ring-dolater-mint"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-dolater-mint text-white p-3 rounded-lg disabled:opacity-50 hover:bg-dolater-mint-dark transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Pro Upgrade Banner */}
      <div className="bg-gradient-to-r from-dolater-yellow to-yellow-400 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-dolater-text-primary">Unlock Full AI Assistant</h3>
            <p className="text-xs text-dolater-text-primary opacity-80">Get unlimited plans, habits & coaching</p>
          </div>
          <button className="bg-white text-dolater-mint px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
            Upgrade Pro
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantScreen;
