import { useState, useRef, useCallback } from 'react';
import { useContentItems } from '@/hooks/useContentItems';
import InternalAIAssistant from '@/utils/internalAIAssistant';

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
      content: "Hi! I'm your DoLater assistant. I can help you organize your saved content, create action plans, and turn your saves into achievable goals. What would you like to work on today?",
      timestamp: new Date().toISOString(),
      suggestions: [
        "Create a plan from my saves",
        "Summarize my content", 
        "Help me get organized",
        "What can you help me with?"
      ]
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const { contentItems = [] } = useContentItems();
  const assistantRef = useRef<InternalAIAssistant | null>(null);

  // Initialize internal assistant
  const getAssistant = useCallback(() => {
    if (!assistantRef.current) {
      assistantRef.current = new InternalAIAssistant();
    }
    return assistantRef.current;
  }, []);

  // --- Added extra safety for chat UX (prevents empty AI responses) ---
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
      const assistant = getAssistant();
      
      // Convert content items to the format expected by the assistant
      const formattedContent = contentItems.map(item => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        category: item.category,
        tags: item.tags,
        url: item.url,
        action_type: item.actionType
      }));

      const result = await assistant.processMessage(userMessage, formattedContent);

      let safeResponse = (result && result.response && result.response.trim())
        ? result.response
        : "✨ Genie couldn't think of a reply. Try rewording your wish!";

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: safeResponse,
        timestamp: new Date().toISOString(),
        suggestions: result?.suggestions
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error in internal AI assistant:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm having a small hiccup processing that request. Could you try rephrasing it or asking something else? I'm here to help organize your content and create action plans!",
        timestamp: new Date().toISOString(),
        suggestions: [
          "Help me organize my saves",
          "Create an action plan",
          "What can you do?",
          "Summarize my content"
        ]
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, getAssistant, contentItems, messages]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: "Hi! I'm your DoLater assistant. I can help you organize your saved content, create action plans, and turn your saves into achievable goals. What would you like to work on today?",
        timestamp: new Date().toISOString(),
        suggestions: [
          "Create a plan from my saves",
          "Summarize my content",
          "Help me get organized", 
          "What can you help me with?"
        ]
      }
    ]);
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    apiStatus: 'healthy' as const, // Always healthy since it's internal
    checkHealth: async () => true, // Always returns true
    clearChat
  };
};
