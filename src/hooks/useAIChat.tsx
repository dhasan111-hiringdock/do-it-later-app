
import { useState, useRef, useCallback } from 'react';
import AIChatManager from '@/utils/aiChatManager';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
  isRetrying?: boolean;
}

export const useAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your DoLater AI Assistant. I can help you create action plans, build habits, and turn your saved content into achievable goals. What would you like to work on today?",
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'healthy' | 'error'>('unknown');
  const chatManagerRef = useRef<AIChatManager | null>(null);

  // Initialize chat manager
  const getChatManager = useCallback(() => {
    if (!chatManagerRef.current) {
      chatManagerRef.current = new AIChatManager();
    }
    return chatManagerRef.current;
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
      const chatManager = getChatManager();
      const result = await chatManager.sendMessage(userMessage);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result.response,
        timestamp: new Date().toISOString(),
        isError: !result.success,
        isRetrying: result.isRetrying
      };

      setMessages(prev => [...prev, aiResponse]);
      setApiStatus(result.success ? 'healthy' : 'error');

    } catch (error) {
      console.error('Error in useAIChat:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm experiencing technical difficulties. Please try again in a moment, or explore your saved content while I recover.",
        timestamp: new Date().toISOString(),
        isError: true
      };

      setMessages(prev => [...prev, errorResponse]);
      setApiStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, getChatManager]);

  const checkHealth = useCallback(async () => {
    try {
      const chatManager = getChatManager();
      const isHealthy = await chatManager.healthCheck();
      setApiStatus(isHealthy ? 'healthy' : 'error');
      return isHealthy;
    } catch {
      setApiStatus('error');
      return false;
    }
  }, [getChatManager]);

  const clearChat = useCallback(() => {
    const chatManager = getChatManager();
    chatManager.clearHistory();
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: "Hi! I'm your DoLater AI Assistant. I can help you create action plans, build habits, and turn your saved content into achievable goals. What would you like to work on today?",
        timestamp: new Date().toISOString()
      }
    ]);
    setApiStatus('unknown');
  }, [getChatManager]);

  return {
    messages,
    sendMessage,
    isLoading,
    apiStatus,
    checkHealth,
    clearChat
  };
};
