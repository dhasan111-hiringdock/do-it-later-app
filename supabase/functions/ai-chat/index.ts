
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AI-CHAT] ${step}${detailsStr}`);
};

// Extract and clean text content from URL
async function extractContentFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'DoLater-AI-Assistant/1.0' }
    });
    const html = await response.text();
    
    // Extract meaningful content (title, description, main text)
    const titleMatch = html.match(/<title.*?>(.*?)<\/title>/is);
    const title = titleMatch ? titleMatch[1].trim() : '';
    
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i);
    const description = descMatch ? descMatch[1].trim() : '';
    
    // Try to extract main content
    const mainMatch = html.match(/<(main|article)[^>]*>([\s\S]*?)<\/(main|article)>/i);
    let mainContent = '';
    if (mainMatch) {
      mainContent = mainMatch[2]
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 1000); // Limit length
    }
    
    return [title, description, mainContent].filter(Boolean).join(' ').slice(0, 1500);
  } catch (error) {
    logStep("Error extracting content from URL", { url, error: error.message });
    return '';
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("AI Chat function started");

    const { messages, userContent = [], test = false } = await req.json();
    
    // Handle test requests
    if (test) {
      return new Response(JSON.stringify({ 
        message: { content: 'API is working' },
        status: 'healthy' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      logStep("ERROR: OpenAI API key not found");
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured. Please add your OpenAI API key in the Supabase dashboard under Edge Functions > Secrets.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Clean and validate the API key
    const cleanApiKey = openAIApiKey.trim();
    if (!cleanApiKey.startsWith('sk-')) {
      logStep("ERROR: Invalid OpenAI API key format");
      return new Response(JSON.stringify({ 
        error: 'Invalid OpenAI API key format. Please check your API key.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    logStep("OpenAI API key validated", { keyLength: cleanApiKey.length });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth header for user context
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      logStep("ERROR: No authorization header");
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Enhance user content with actual content from URLs when relevant
    let enhancedContent = userContent;
    const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    
    if (lastUserMessage.includes('summar') || lastUserMessage.includes('analyz') || lastUserMessage.includes('content')) {
      logStep("Enhancing content for analysis");
      enhancedContent = await Promise.all(
        userContent.slice(0, 5).map(async (item: any) => {
          if (item.url && !item.summary) {
            const extractedContent = await extractContentFromUrl(item.url);
            return { ...item, extractedContent };
          }
          return item;
        })
      );
    }

    // Prepare context for OpenAI
    const contextPrompt = enhancedContent.length > 0 
      ? `User's saved content (${enhancedContent.length} items):
${enhancedContent.map((item: any) => `
- Title: ${item.title}
- Category: ${item.category}
- Summary: ${item.summary || 'No summary'}
- URL: ${item.url}
- Tags: ${item.tags?.join(', ') || 'None'}
${item.extractedContent ? `- Content: ${item.extractedContent}` : ''}
`).join('\n')}`
      : "The user hasn't saved any content items yet.";

    const systemMessage = {
      role: 'system',
      content: `You are an intelligent DoLater AI Assistant that helps users organize and take action on their saved content. You excel at:

1. **Content Analysis**: Deeply analyze articles, videos, and resources to extract key insights
2. **Smart Summarization**: Create concise, actionable summaries that highlight the most important points
3. **Action Planning**: Transform content into step-by-step action plans and achievable goals
4. **Personalized Recommendations**: Suggest next steps based on the user's interests and saved content
5. **Content Organization**: Help categorize and prioritize saved items

${contextPrompt}

Guidelines:
- Be specific and actionable in your responses
- When summarizing, focus on key takeaways and actionable insights
- Create realistic, time-bound action plans
- Reference specific content items when relevant
- Ask clarifying questions when needed
- Keep responses concise but comprehensive
- Suggest follow-up actions and related content exploration

Always aim to turn saved content into actionable knowledge and meaningful progress.`
    };

    logStep("Making OpenAI API request");

    // Ensure headers are properly formatted
    const requestHeaders = {
      'Authorization': `Bearer ${cleanApiKey}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logStep("OpenAI API error", { status: response.status, statusText: response.statusText, error: errorText });
      
      if (response.status === 401) {
        return new Response(JSON.stringify({ 
          error: 'Invalid OpenAI API key. Please check your API key is correct and has sufficient credits.' 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.' 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      logStep("Invalid response structure from OpenAI", { data });
      throw new Error('Invalid response from OpenAI API');
    }

    const assistantMessage = data.choices[0].message;

    logStep("OpenAI response received", { messageLength: assistantMessage.content?.length || 0 });

    return new Response(JSON.stringify({ message: assistantMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in ai-chat function", { message: errorMessage });
    return new Response(JSON.stringify({ error: `AI service temporarily unavailable: ${errorMessage}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
