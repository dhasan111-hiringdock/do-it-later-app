
import { useState, useEffect } from 'react';
import { Sparkles, Send, Zap, FileText, Calendar, CheckSquare, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import APIStatusIndicator from '../APIStatusIndicator';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const AssistantScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your DoLater AI Assistant. I can help you create action plans, build habits, and turn your saved content into achievable goals. What would you like to work on today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState(false);
  const { user } = useAuth();
  const { subscribed } = useSubscription();
  const { toast } = useToast();

  // Force premium access for testing
  const hasAccess = true;

  useEffect(() => {
    if (user && !conversationId) {
      createConversation();
    }
  }, [user]);

  const createConversation = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          title: 'AI Assistant Chat'
        })
        .select()
        .single();

      if (error) throw error;
      setConversationId(data.id);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsAILoading(true);
    setApiKeyError(false);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [{ role: 'user', content: inputMessage }],
          conversationId
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (data.error) {
        if (data.error.includes('API key') || data.error.includes('Invalid OpenAI')) {
          setApiKeyError(true);
          throw new Error('AI service configuration error. Please check your OpenAI API key.');
        }
        throw new Error(data.error);
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.message.content,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorMessage = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = "There's an issue with the AI service configuration. Please check your API key settings.";
          setApiKeyError(true);
        } else if (error.message.includes('credits') || error.message.includes('quota')) {
          errorMessage = "The AI service has reached its usage limit. Please try again later.";
        }
      }

      toast({
        title: "AI Assistant Error",
        description: errorMessage,
        variant: "destructive",
      });

      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: errorMessage + " In the meantime, you can explore your saved content and organize it into boards!",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsAILoading(false);
    }
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
          <APIStatusIndicator />
        </div>
      </div>

      {/* API Key Error Banner */}
      {apiKeyError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">
                AI service configuration issue. Please check your OpenAI API key settings.
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

      {/* Input Area */}
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
            disabled={!inputMessage.trim() || isAILoading}
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
            <h3 className="font-semibold text-sm text-white">AI Assistant Active (Testing Mode)</h3>
            <p className="text-xs text-white opacity-90">Full AI functionality enabled for testing</p>
          </div>
          <div className="bg-white text-green-600 px-3 py-1 rounded-full text-xs font-medium">
            ✓ Ready
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantScreen;
