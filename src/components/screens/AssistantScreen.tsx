
import { useState } from 'react';
import { Sparkles, Send, Zap, FileText, Calendar, CheckSquare, RotateCcw, Bot, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAIChat } from '@/hooks/useAIChat';
import { cn } from '@/lib/utils';

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
    { icon: FileText, label: 'Create Plan', query: 'Create a plan from my saved content', color: 'from-blue-500 to-blue-600' },
    { icon: CheckSquare, label: 'Organize', query: 'Help me organize my saves by category', color: 'from-green-500 to-green-600' },
    { icon: Calendar, label: 'Schedule', query: 'Help me create a schedule from my content', color: 'from-purple-500 to-purple-600' },
    { icon: Zap, label: 'Quick Action', query: 'What should I do first with my saves?', color: 'from-orange-500 to-orange-600' }
  ];

  const getLatestSuggestions = () => {
    const lastAssistantMessage = messages
      .slice()
      .reverse()
      .find(msg => msg.type === 'assistant' && msg.suggestions);
    return lastAssistantMessage?.suggestions || [];
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-dolater-mint to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles size={24} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Smart Assistant</h1>
              <p className="text-sm text-gray-500">Internal AI • Always Available</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
            title="Clear chat"
          >
            <RotateCcw size={16} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50 p-6">
        <div className="text-sm font-medium text-gray-600 mb-4">Quick Actions</div>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleSuggestionClick(action.query)}
                className={`bg-gradient-to-r ${action.color} text-white p-4 rounded-xl flex items-center space-x-3 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
              >
                <Icon size={20} className="group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, index) => (
          <div 
            key={message.id} 
            className={cn(
              "animate-fade-in",
              "opacity-0 animate-[fade-in_0.5s_ease-out_forwards]"
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
              <div className={`flex items-start space-x-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md",
                  message.type === 'user' 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600" 
                    : "bg-gradient-to-r from-dolater-mint to-emerald-600"
                )}>
                  {message.type === 'user' ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={cn(
                  "p-4 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md",
                  message.type === 'user'
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                    : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
                )}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  <span className={cn(
                    "text-xs mt-2 block opacity-70",
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  )}>
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Suggestions */}
            {message.type === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
              <div className="flex justify-start ml-11">
                <div className="space-y-3">
                  <div className="text-xs text-gray-500 font-medium">Try asking:</div>
                  <div className="flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, suggestionIndex) => (
                      <button
                        key={suggestionIndex}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="bg-gray-100 hover:bg-dolater-mint hover:text-white text-gray-600 text-xs px-3 py-2 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-md"
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
        
        {/* Loading Animation */}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-start space-x-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-dolater-mint to-emerald-600 flex items-center justify-center shadow-md">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-white text-gray-800 p-4 rounded-2xl rounded-bl-md shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-dolater-mint rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-dolater-mint rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-dolater-mint rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Suggestions */}
      {getLatestSuggestions().length > 0 && !isLoading && (
        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-4 animate-slide-up">
          <div className="text-xs font-medium text-gray-500 mb-3">Quick suggestions:</div>
          <div className="flex flex-wrap gap-2">
            {getLatestSuggestions().slice(0, 4).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="bg-dolater-mint/10 hover:bg-dolater-mint hover:text-white text-dolater-mint text-xs px-3 py-2 rounded-full transition-all duration-200 hover:scale-105 border border-dolater-mint/20"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200/50 p-6">
        <div className="flex space-x-4 items-end">
          <div className="flex-1 relative">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me to organize content, create plans, or build routines from your saves..."
              className="w-full p-4 pr-12 border border-gray-200 rounded-2xl text-sm focus:border-dolater-mint focus:ring-2 focus:ring-dolater-mint/20 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className={cn(
              "p-4 rounded-2xl transition-all duration-200 shadow-lg",
              !inputMessage.trim() || isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-dolater-mint to-emerald-600 hover:scale-105 hover:shadow-xl text-white"
            )}
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div>
              <h3 className="font-semibold text-sm text-white">Internal AI Assistant</h3>
              <p className="text-xs text-white/90">Powered by smart content analysis • Always available</p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
            ✓ Ready
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantScreen;
