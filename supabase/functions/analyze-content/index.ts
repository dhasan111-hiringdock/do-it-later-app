
// Ultra Debug Analyze-content Edge Function

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
    let url, title, content;
    try {
      const json = await req.json();
      url = typeof json.url === "string" ? json.url : "";
      title = typeof json.title === "string" ? json.title : "";
      content = typeof json.content === "string" ? json.content : "";
    } catch (parseErr) {
      console.error('Ultra-Debug: Error parsing request JSON:', parseErr);
      return new Response(JSON.stringify({ error: "Invalid request JSON" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('Ultra-Debug: Retrieved OpenAI API Key?:', !!openAIApiKey, 'Length:', openAIApiKey?.length);

    if (!openAIApiKey || openAIApiKey.trim().length < 10) {
      console.error('Ultra-Debug: OPENAI_API_KEY not set or too short.');
      return new Response(JSON.stringify({ error: "OpenAI API key not configured or too short" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let analysisContent = content || title || '';
    if (url && !content) {
      try {
        const urlResponse = await fetch(url);
        const html = await urlResponse.text();
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const extractedTitle = titleMatch ? titleMatch[1] : '';
        const descMatch = html.match(/<meta\s+name=["\']description["\']\s+content=["\']([^"']*)["\']/i);
        const description = descMatch ? descMatch[1] : '';
        analysisContent = `${extractedTitle}\n${description}`;
      } catch (fetchError) {
        console.warn('Ultra-Debug: Could not fetch URL content:', fetchError);
      }
    }

    const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';
    const reqBody = {
      model: 'gpt-4.1-2025-04-14',
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
    };

    console.log('Ultra-Debug: About to call OpenAI API. Body:', JSON.stringify(reqBody).slice(0,300), '...');

    let openAIResponse;
    try {
      openAIResponse = await fetch(openaiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${String(openAIApiKey)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
      });
    } catch (apiRequestError) {
      console.error('Ultra-Debug: Error calling OpenAI API:', apiRequestError && apiRequestError.message ? apiRequestError.message : apiRequestError);
      return new Response(JSON.stringify({ error: "Failed to call OpenAI API", debug: String(apiRequestError) }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('Ultra-Debug: OpenAI API error:', openAIResponse.status, openAIResponse.statusText, errorText);
      return new Response(JSON.stringify({ error: `OpenAI API error: ${openAIResponse.statusText}`, raw: errorText }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let data;
    try {
      data = await openAIResponse.json();
    } catch (jsonParseError) {
      console.error('Ultra-Debug: Failed to parse OpenAI API response as JSON:', jsonParseError);
      return new Response(JSON.stringify({ error: "Failed to parse OpenAI output JSON" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let analysis;
    try {
      analysis = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      console.warn('Ultra-Debug: Could not parse OpenAI response as JSON; using fallback.', parseError, data.choices?.[0]?.message?.content);
      analysis = {
        summary: data.choices?.[0]?.message?.content?.substring(0, 200) + '...',
        category: 'knowledge',
        tags: ['content'],
        priority: 'medium',
        actionType: 'read'
      };
    }

    console.log('Ultra-Debug: Analysis result to send to client:', analysis);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Ultra-Debug: Error in analyze-content function:', error && error.message ? error.message : error);
    return new Response(JSON.stringify({ error: error.message, debug: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

