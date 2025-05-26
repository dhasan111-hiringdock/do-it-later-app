
import { useState } from 'react';
import AISearchBar from '../AISearchBar';

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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "That's a great goal! Let me help you create a step-by-step plan. This feature is available in DoLater Pro. Would you like to upgrade to unlock the full AI Assistant?",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleAISearch = (query: string) => {
    setIsAILoading(true);
    
    const aiMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, aiMessage]);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I found relevant content for "${query}". Here's what I can create for you:\n\n📋 **7-Day Action Plan**\n• Day 1-2: Research and planning\n• Day 3-4: Setup and preparation\n• Day 5-7: Implementation\n\n🎯 **Key Action Items**\n• Review your saved content\n• Create specific goals\n• Set daily reminders\n\nWould you like me to export this as a detailed plan? This feature is available with DoLater Pro.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsAILoading(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="text-center py-4 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-bold text-dolater-text-primary">AI Assistant</h1>
        <p className="text-xs text-dolater-text-secondary">Your personal productivity coach</p>
      </div>

      {/* AI Search Bar */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <AISearchBar 
          onAISearch={handleAISearch}
          isLoading={isAILoading}
          isPro={false}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-dolater-mint text-white'
                  : 'bg-white card-shadow text-dolater-text-primary'
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
            <div className="bg-white card-shadow text-dolater-text-primary max-w-[80%] p-3 rounded-lg">
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

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button className="bg-dolater-mint-light text-dolater-mint p-2 rounded-lg text-xs font-medium">
            Create Plan
          </button>
          <button className="bg-dolater-yellow text-dolater-text-primary p-2 rounded-lg text-xs font-medium">
            Set Habits
          </button>
        </div>

        {/* Input */}
        <div className="flex space-x-2">
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 p-3 border border-gray-200 rounded-lg text-sm focus:border-dolater-mint focus:ring-1 focus:ring-dolater-mint"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-dolater-mint text-white px-4 py-3 rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      {/* Pro Upgrade Banner */}
      <div className="bg-gradient-to-r from-dolater-yellow to-yellow-400 p-4 text-dolater-text-primary">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">Unlock Full AI Assistant</h3>
            <p className="text-xs opacity-90">Get unlimited plans, habits & coaching</p>
          </div>
          <button className="bg-white text-dolater-mint px-3 py-2 rounded-lg text-xs font-medium">
            Upgrade Pro
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantScreen;
