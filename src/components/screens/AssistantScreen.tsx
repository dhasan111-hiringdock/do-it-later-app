
import { useState } from 'react';
import { Sparkles, Send, Zap, FileText, Calendar, CheckSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAIChat } from '@/hooks/useAIChat';
import { useToast } from '@/hooks/use-toast';

const AssistantScreen = () => {
  const [inputMessage, setInputMessage] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const { messages, sendMessage, isLoading, apiStatus, checkHealth, clearChat } = useAIChat();

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return;
    
    const message = inputMessage;
    setInputMessage('');
    await sendMessage(message);
  };

  const handleRetryConnection = async () => {
    toast({
      title: "Checking Connection",
      description: "Testing AI service connection...",
    });
    
    const isHealthy = await checkHealth();
    
    toast({
      title: isHealthy ? "Connection Restored" : "Connection Failed",
      description: isHealthy 
        ? "AI Assistant is back online!"
        : "Still having connection issues. Please try again in a moment.",
      variant: isHealthy ? "default" : "destructive",
    });
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

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'healthy': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'healthy': return 'AI Connected';
      case 'error': return 'Connection Issues';
      default: return 'Checking Status';
    }
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
              <h1 className="text-lg font-bold text-dolater-text-primary">AI Assistant</h1>
              <p className="text-xs text-dolater-text-secondary">Your personal productivity coach</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`text-xs ${getStatusColor()}`}>
              {getStatusText()}
            </div>
            {apiStatus === 'error' && (
              <button
                onClick={handleRetryConnection}
                className="text-blue-600 hover:text-blue-800 p-1"
                title="Retry connection"
              >
                <RefreshCw size={14} />
              </button>
            )}
            <button
              onClick={clearChat}
              className="text-gray-500 hover:text-gray-700 text-xs underline"
              title="Clear chat"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Connection Warning */}
      {apiStatus === 'error' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                AI Assistant is experiencing connection issues. Responses may be limited.
              </p>
            </div>
          </div>
        </div>
      )}

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
                  : message.isError
                  ? 'bg-red-50 border border-red-200 text-red-800 rounded-bl-sm'
                  : 'bg-white card-shadow text-dolater-text-primary rounded-bl-sm'
              }`}
            >
              {message.isRetrying && (
                <div className="text-xs text-orange-600 mb-2 flex items-center">
                  <RefreshCw size={12} className="animate-spin mr-1" />
                  Retrying...
                </div>
              )}
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              <span className={`text-xs mt-2 block ${
                message.type === 'user' ? 'text-green-100' : 
                message.isError ? 'text-red-600' : 'text-dolater-text-secondary'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
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
                <span className="text-sm text-dolater-text-secondary">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me to create plans, organize content, or build habits from your saves..."
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

      {/* Testing Mode Banner */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-white">AI Assistant Enhanced (Testing Mode)</h3>
            <p className="text-xs text-white opacity-90">Advanced error handling and retry logic active</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            apiStatus === 'healthy' ? 'bg-white text-green-600' :
            apiStatus === 'error' ? 'bg-red-100 text-red-600' :
            'bg-yellow-100 text-yellow-600'
          }`}>
            {apiStatus === 'healthy' ? '✓ Ready' :
             apiStatus === 'error' ? '⚠ Issues' : '⏳ Checking'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantScreen;
