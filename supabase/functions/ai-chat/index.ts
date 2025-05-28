
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { messages, conversationId } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured. Please check your edge function secrets.');
    }

    logStep("OpenAI API key found");

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth header and create authenticated client for user operations
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    const supabaseAuth = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    });

    logStep("Supabase clients initialized");

    // Get user's content items for context
    const { data: contentItems, error: contentError } = await supabaseAuth
      .from('content_items')
      .select('*')
      .limit(10);

    if (contentError) {
      logStep("Error fetching content items", { error: contentError });
    }

    const contextPrompt = contentItems && contentItems.length > 0 
      ? `Here are some of the user's saved content items for context: ${JSON.stringify(contentItems.map(item => ({ title: item.title, summary: item.summary, category: item.category })))}`
      : "The user hasn't saved any content items yet.";

    const systemMessage = {
      role: 'system',
      content: `You are a DoLater AI Assistant that helps users organize and take action on their saved content. You can:
1. Create action plans from saved content
2. Build habits based on user's interests
3. Organize content into actionable steps
4. Provide productivity coaching

${contextPrompt}

Be helpful, actionable, and concise. Focus on turning saved content into achievable goals.`
    };

    logStep("Making OpenAI API request");

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
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
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message;

    logStep("OpenAI response received", { messageLength: assistantMessage.content.length });

    // Save conversation if conversationId provided
    if (conversationId) {
      const { error: insertError } = await supabase
        .from('ai_messages')
        .insert([
          {
            conversation_id: conversationId,
            role: 'user',
            content: messages[messages.length - 1].content
          },
          {
            conversation_id: conversationId,
            role: 'assistant',
            content: assistantMessage.content
          }
        ]);

      if (insertError) {
        logStep("Error saving conversation", { error: insertError });
      } else {
        logStep("Conversation saved successfully");
      }
    }

    return new Response(JSON.stringify({ message: assistantMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in ai-chat function", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
