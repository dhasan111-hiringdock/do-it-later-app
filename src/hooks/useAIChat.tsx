
import { useState, useRef, useCallback } from 'react';
import { useContentItems } from '@/hooks/useContentItems';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export const useAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your intelligent DoLater assistant powered by AI. I can analyze and summarize your saved content, create personalized action plans, and provide insights from your articles, videos, and resources. What would you like me to help you with?",
      timestamp: new Date().toISOString(),
      suggestions: [
        "Summarize my latest saves",
        "Create an action plan from my content", 
        "Analyze my fitness articles",
        "What should I focus on this week?"
      ]
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'healthy' | 'error' | 'checking'>('checking');
  const { contentItems = [] } = useContentItems();

  // Check API health
  const checkHealth = useCallback(async () => {
    try {
      setApiStatus('checking');
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          messages: [{ role: 'user', content: 'test' }],
          test: true 
        }
      });
      
      if (error) throw error;
      setApiStatus('healthy');
      return true;
    } catch (error) {
      console.error('AI Chat health check failed:', error);
      setApiStatus('error');
      return false;
    }
  }, []);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Prepare conversation context
      const conversationMessages = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // Add current message
      conversationMessages.push({
        role: 'user',
        content: userMessage
      });

      // Include user's content items for context
      const contentContext = contentItems.slice(0, 10).map(item => ({
        title: item.title,
        summary: item.summary,
        category: item.category,
        url: item.url,
        tags: item.tags
      }));

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          messages: conversationMessages,
          userContent: contentContext
        }
      });

      if (error) throw error;

      let responseContent = data.message?.content || "I'm having trouble processing that request. Could you try rephrasing it?";
      
      // Generate smart suggestions based on response
      const suggestions = generateSmartSuggestions(userMessage, responseContent, contentItems);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
        suggestions
      };

      setMessages(prev => [...prev, aiResponse]);
      setApiStatus('healthy');
    } catch (error) {
      console.error('Error in AI chat:', error);
      setApiStatus('error');
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm experiencing some technical difficulties. This might be due to API configuration issues. Please check that your OpenAI API key is properly set up, or try again in a moment.",
        timestamp: new Date().toISOString(),
        suggestions: [
          "Check API configuration",
          "Try a simpler question",
          "Refresh and try again"
        ]
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, contentItems]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: "Hi! I'm your intelligent DoLater assistant powered by AI. I can analyze and summarize your saved content, create personalized action plans, and provide insights from your articles, videos, and resources. What would you like me to help you with?",
        timestamp: new Date().toISOString(),
        suggestions: [
          "Summarize my latest saves",
          "Create an action plan from my content",
          "Analyze my fitness articles", 
          "What should I focus on this week?"
        ]
      }
    ]);
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    apiStatus,
    checkHealth,
    clearChat
  };
};

// Helper function to generate contextual suggestions
function generateSmartSuggestions(userMessage: string, response: string, contentItems: any[]): string[] {
  const categories = [...new Set(contentItems.map(item => item.category))];
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('summar')) {
    return [
      "Create action steps from summary",
      "Focus on specific category",
      "Get more detailed analysis"
    ];
  }
  
  if (lowerMessage.includes('plan') || lowerMessage.includes('action')) {
    return [
      "Break down into weekly goals",
      "Set reminders for tasks",
      "Prioritize by difficulty"
    ];
  }
  
  if (categories.length > 0) {
    return [
      `Analyze my ${categories[0]} content`,
      "Compare different categories",
      "Suggest learning priorities"
    ];
  }
  
  return [
    "Tell me more about this",
    "Create a plan from this",
    "What should I do first?"
  ];
}
