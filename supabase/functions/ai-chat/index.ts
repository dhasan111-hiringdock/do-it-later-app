
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth header and create authenticated client
    const authHeader = req.headers.get('Authorization')!;
    const supabaseAuth = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get user's content items for context
    const { data: contentItems } = await supabaseAuth
      .from('content_items')
      .select('*')
      .limit(10);

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
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message;

    // Save conversation if conversationId provided
    if (conversationId) {
      await supabaseAuth
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
    }

    return new Response(JSON.stringify({ message: assistantMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
