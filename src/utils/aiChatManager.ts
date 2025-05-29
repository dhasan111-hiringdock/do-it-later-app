
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
  retryAfter?: number;
}

class AIChatManager {
  private maxRetries = 3;
  private baseDelay = 1000; // 1 second
  private conversationHistory: ChatMessage[] = [];

  constructor() {
    this.initializeSystem();
  }

  private initializeSystem() {
    this.conversationHistory = [{
      role: 'system',
      content: "You are a DoLater AI Assistant that helps users organize and take action on their saved content. Be helpful, actionable, and concise."
    }];
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeAPICall(messages: ChatMessage[], attempt: number = 1): Promise<ChatResponse> {
    try {
      console.log(`[AI Chat Manager] Attempt ${attempt} - Making API call`);
      
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: messages.slice(-10), // Keep last 10 messages for context
          conversationId: null
        }
      });

      if (error) {
        console.error(`[AI Chat Manager] Supabase error:`, error);
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (data.error) {
        console.error(`[AI Chat Manager] Edge function error:`, data.error);
        
        // Handle specific error types
        if (data.error.includes('API key') || data.error.includes('OpenAI')) {
          throw new Error('API_KEY_ERROR');
        }
        if (data.error.includes('credits') || data.error.includes('quota') || data.error.includes('rate limit')) {
          throw new Error('RATE_LIMIT_ERROR');
        }
        
        throw new Error(data.error);
      }

      console.log(`[AI Chat Manager] Success on attempt ${attempt}`);
      return {
        success: true,
        message: data.message.content
      };

    } catch (error) {
      console.error(`[AI Chat Manager] Attempt ${attempt} failed:`, error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Don't retry API key errors
      if (errorMessage === 'API_KEY_ERROR') {
        return {
          success: false,
          error: 'API key configuration error. Please check your OpenAI settings.'
        };
      }
      
      // Handle rate limiting with exponential backoff
      if (errorMessage === 'RATE_LIMIT_ERROR') {
        const retryDelay = this.baseDelay * Math.pow(2, attempt - 1);
        return {
          success: false,
          error: 'Rate limit reached. Please try again in a moment.',
          retryAfter: retryDelay
        };
      }
      
      // For other errors, retry if we haven't exceeded max attempts
      if (attempt < this.maxRetries) {
        const retryDelay = this.baseDelay * Math.pow(2, attempt - 1);
        console.log(`[AI Chat Manager] Retrying in ${retryDelay}ms`);
        await this.delay(retryDelay);
        return this.makeAPICall(messages, attempt + 1);
      }
      
      return {
        success: false,
        error: `Failed after ${this.maxRetries} attempts: ${errorMessage}`
      };
    }
  }

  private generateFallbackResponse(userMessage: string): string {
    const fallbackResponses = [
      "I'm having trouble connecting to the AI service right now. In the meantime, you can organize your saved content into boards or try asking me again in a moment.",
      "The AI service is temporarily unavailable. You can still browse your saved content and organize it while I try to reconnect.",
      "I'm experiencing some technical difficulties. Please try your request again, or feel free to explore your content library in the meantime."
    ];
    
    // Simple keyword-based fallback logic
    if (userMessage.toLowerCase().includes('plan')) {
      return "I'd love to help you create a plan, but I'm having connection issues. Try browsing your saved content for inspiration, then ask me again in a moment.";
    }
    
    if (userMessage.toLowerCase().includes('organize')) {
      return "While I'm having technical difficulties, you can manually organize your content using the Boards feature. I'll be back to help with AI-powered organization soon!";
    }
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  public async sendMessage(userMessage: string): Promise<{
    success: boolean;
    response: string;
    isRetrying?: boolean;
  }> {
    // Add user message to history
    const userChatMessage: ChatMessage = {
      role: 'user',
      content: userMessage
    };
    
    this.conversationHistory.push(userChatMessage);
    
    // Try to get AI response
    const result = await this.makeAPICall(this.conversationHistory);
    
    if (result.success && result.message) {
      // Add successful AI response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: result.message
      });
      
      return {
        success: true,
        response: result.message
      };
    } else {
      // Generate fallback response
      const fallbackResponse = this.generateFallbackResponse(userMessage);
      
      // Add fallback to history with a note
      this.conversationHistory.push({
        role: 'assistant',
        content: `[Fallback] ${fallbackResponse}`
      });
      
      return {
        success: false,
        response: fallbackResponse,
        isRetrying: result.retryAfter ? true : false
      };
    }
  }

  public clearHistory(): void {
    this.initializeSystem();
  }

  public getHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const testResult = await this.makeAPICall([
        { role: 'user', content: 'test' }
      ]);
      return testResult.success;
    } catch {
      return false;
    }
  }
}

export default AIChatManager;
