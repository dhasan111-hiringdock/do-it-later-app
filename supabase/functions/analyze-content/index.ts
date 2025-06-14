
/**
 * Internal Content Analysis Edge Function
 * - No OpenAI
 * - Simple heuristics for: summary, tags, category, priority, actionType.
 */

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getFirstSentences(text: string, count = 2): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.slice(0, count).join(" ").trim() || (text.slice(0, 180) + (text.length > 180 ? "..." : ""));
}

// Simple tag extraction: most frequent nouns/words longer than X chars, minus stopwords
function extractTags(text: string, max = 5): string[] {
  if (!text) return [];
  const stopwords = new Set([
    "the","be","to","of","and","a","in","that","have","I","it","for","not","on","with","as","you","do","at",
    "is","are","was","were","this","but","by","from","or","an","so","if","will","would","can","has",
    "about","more","your","which","when","who","what","how","we","they","their","our"
  ]);
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopwords.has(w));
  const counts: Record<string, number> = {};
  words.forEach(w => counts[w] = (counts[w] || 0) + 1);
  return Object.entries(counts)
    .sort((a,b) => b[1] - a[1])
    .slice(0, max)
    .map(([word]) => word);
}

// Heuristic category detection
function detectCategory(text: string): string {
  const str = text.toLowerCase();
  if (/workout|exercise|fitness|gym|training|run|yoga|sport|walk/.test(str)) return "fitness";
  if (/money|finance|budget|save|invest|spending|bank|investment|debt|stock/.test(str)) return "finance";
  if (/learn|study|knowledge|course|education|class|read|tutorial|training/.test(str)) return "knowledge";
  if (/family|goal|personal|habit|routine|journal|travel|health|diary|mood/.test(str)) return "personal";
  if (/project|work|meeting|deadline|team|career|business|job|task|office/.test(str)) return "work";
  return "knowledge";
}

// Heuristic priority & actionType detection
function detectPriority(text: string): "low" | "medium" | "high" {
  const str = text.toLowerCase();
  if (/urgent|important|now|immediately|priority|must/.test(str)) return "high";
  if (/soon|should|later|plan|next|review/.test(str)) return "medium";
  return "low";
}
function detectActionType(text: string): "read" | "watch" | "try" | "buy" | "learn" {
  const str = text.toLowerCase();
  if (/watch|video|youtube|webinar|movie|film/.test(str)) return "watch";
  if (/try|exercise|workout|practice/.test(str)) return "try";
  if (/buy|purchase|shop/.test(str)) return "buy";
  if (/learn|study|course|tutorial|read|summarize/.test(str)) return "learn";
  return "read";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let url = "", title = "", content = "";
    try {
      const json = await req.json();
      url = typeof json.url === "string" ? json.url : "";
      title = typeof json.title === "string" ? json.title : "";
      content = typeof json.content === "string" ? json.content : "";
    } catch (parseErr) {
      console.error('Error parsing request JSON:', parseErr);
      return new Response(JSON.stringify({ error: "Invalid request JSON" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Try to fetch title/content from url if content is missing
    let analysisContent = content || title || '';
    let fetchedTitle = "";
    if (url && !content) {
      try {
        const urlResponse = await fetch(url);
        const html = await urlResponse.text();
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        fetchedTitle = titleMatch ? titleMatch[1] : '';
        const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
        const description = descMatch ? descMatch[1] : '';
        analysisContent = `${fetchedTitle}\n${description}`;
      } catch (fetchError) {
        console.warn('Could not fetch URL content:', fetchError);
      }
    }

    // Use best effort analysis
    const fullText = [title, analysisContent, url].filter(Boolean).join(' ').trim();

    const summary = getFirstSentences(analysisContent || title, 2) || "No summary available.";
    const category = detectCategory(fullText);
    const tags = extractTags(analysisContent || title, 5);
    const priority = detectPriority(fullText) as "low" | "medium" | "high";
    const actionType = detectActionType(fullText);

    const analysis = {
      summary,
      category,
      tags,
      priority,
      actionType
    };

    console.log('Internal Analysis result:', analysis);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in internal analyze-content function:', error?.message || error);
    return new Response(
      JSON.stringify({ error: String(error?.message || error), debug: String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
