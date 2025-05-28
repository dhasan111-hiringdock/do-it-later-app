
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, title, content } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Fetch URL metadata if only URL provided
    let analysisContent = content || title || '';
    
    if (url && !content) {
      try {
        const urlResponse = await fetch(url);
        const html = await urlResponse.text();
        
        // Extract title and basic content from HTML
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const extractedTitle = titleMatch ? titleMatch[1] : '';
        
        // Extract meta description
        const descMatch = html.match(/<meta\s+name=["\']description["\']\s+content=["\']([^"']*)["\']/i);
        const description = descMatch ? descMatch[1] : '';
        
        analysisContent = `${extractedTitle}\n${description}`;
      } catch (fetchError) {
        console.warn('Could not fetch URL content:', fetchError);
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a content analyzer. Analyze the given content and return a JSON object with: summary (2-3 sentences), category (one of: fitness, finance, knowledge, personal, work), tags (array of 3-5 relevant tags), priority (low, medium, high), and actionType (read, watch, try, buy, learn). Be concise and accurate.'
          },
          {
            role: 'user',
            content: `Analyze this content:\nURL: ${url}\nTitle: ${title}\nContent: ${analysisContent}`
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    let analysis;
    
    try {
      analysis = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      analysis = {
        summary: data.choices[0].message.content.substring(0, 200) + '...',
        category: 'knowledge',
        tags: ['content'],
        priority: 'medium',
        actionType: 'read'
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
