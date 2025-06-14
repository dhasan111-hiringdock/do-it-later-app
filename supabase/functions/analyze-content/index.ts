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

// Improved: Try to fetch description, readable body, and relevant meta for summary
async function extractWebContent(url: string) {
  try {
    const urlResponse = await fetch(url, { headers: { "User-Agent": "DoLaterAnalyzer/1.0" } });
    const html = await urlResponse.text();

    // Extract <title>
    const titleMatch = html.match(/<title.*?>(.*?)<\/title>/is);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Extract <meta name="description">
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i);
    const description = descMatch ? descMatch[1].trim() : "";

    // Try to extract readable 'main' or 'article' tag
    const mainMatch = html.match(/<(main|article)[^>]*>([\s\S]*?)<\/(main|article)>/i);
    let mainText = "";
    if (mainMatch) {
      const inner = mainMatch[2]
        .replace(/<[^>]+>/g, " ") // Remove HTML tags
        .replace(/\s+/g, " ")
        .trim();
      mainText = inner;
    }

    return { title, description, mainText };
  } catch (fetchError) {
    console.warn('[analyze-content] Could not fetch or parse URL:', url, fetchError);
    return { title: "", description: "", mainText: "" };
  }
}

// Smarter summary getter: prefer note content, then description, mainText, then title
function generateSummary(content: string, description: string, mainText: string, title: string): string {
  if (content && content.length > 30) {
    return getFirstSentences(content, 2);
  }
  if (description && description.length > 30) {
    return getFirstSentences(description, 2);
  }
  if (mainText && mainText.length > 40) {
    return getFirstSentences(mainText, 2);
  }
  if (title) {
    return title.length > 180 ? title.slice(0,180) + "..." : title;
  }
  return "No summary available.";
}

// Improved tag extraction: consider splitting by -, _, /, and get tokens from URL
function extractTags(text: string, url = "", max = 5): string[] {
  // Existing word-based extraction
  const stopwords = new Set([
    "the","be","to","of","and","a","in","that","have","I","it","for","not","on","with","as","you","do","at",
    "is","are","was","were","this","but","by","from","or","an","so","if","will","would","can","has",
    "about","more","your","which","when","who","what","how","we","they","their","our"
  ]);
  let words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopwords.has(w));
  // Add tokens from URL (slashes, dashes)
  if (url) {
    let urlTokens = url.split(/\/|\.|\?|=|&|_|-/).filter(Boolean);
    urlTokens = urlTokens.map(t => t.toLowerCase()).filter(t => t.length > 3 && !stopwords.has(t));
    words = words.concat(urlTokens);
  }
  const counts: Record<string, number> = {};
  words.forEach(w => counts[w] = (counts[w] || 0) + 1);
  return Object.entries(counts)
    .sort((a,b) => b[1] - a[1])
    .slice(0, max)
    .map(([word]) => word);
}

// Much broader keyword coverage
function detectCategory(text: string): string {
  const str = text.toLowerCase();
  if (/workout|exercise|fitness|gym|training|run|yoga|sport|walk|bodybuilding|HIIT|pilates|cardio|meditation|wellness/.test(str)) return "fitness";
  if (/money|finance|budget|save|invest|spending|bank|investment|debt|stock|tax|crypto|nft|loans|credit|retire|salary/.test(str)) return "finance";
  if (/learn|study|knowledge|course|education|class|read|tutorial|training|book|book summary|university|edx|udemy|coursera|language/.test(str)) return "knowledge";
  if (/family|goal|personal|habit|routine|journal|travel|health|diary|mood|mental|mindfulness|self|relationship|parenting|vacation/.test(str)) return "personal";
  if (/project|work|meeting|deadline|team|career|business|job|task|office|startup|company|funding|presentation|scrum|manager/.test(str)) return "work";
  // Platform-specific detection
  if (/youtube|video|watch|channel|youtuber/.test(str)) return "knowledge";
  if (/instagram|tiktok/.test(str)) return "personal";
  return "knowledge";
}

function detectPriority(text: string): "low" | "medium" | "high" {
  const str = text.toLowerCase();
  if (/urgent|important|now|immediately|priority|must|critical|asap/.test(str)) return "high";
  if (/soon|should|later|plan|next|review|schedule|pending/.test(str)) return "medium";
  return "low";
}

function detectActionType(text: string): "read" | "watch" | "try" | "buy" | "learn" {
  const str = text.toLowerCase();
  if (/watch|video|youtube|webinar|movie|film|vlog|livestream/.test(str)) return "watch";
  if (/try|exercise|workout|practice|demo|experiment|test out/.test(str)) return "try";
  if (/buy|purchase|shop|order|cart|checkout|deal/.test(str)) return "buy";
  if (/learn|study|course|tutorial|read|summary|discover/.test(str)) return "learn";
  return "read";
}

// Main entry
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

    // Fetch web info if needed
    let fetched = { title: "", description: "", mainText: "" };
    let analysisContent = content || title || '';
    if (url) {
      fetched = await extractWebContent(url);
      // Only overwrite if content is empty
      if (!analysisContent) {
        analysisContent = [fetched.title, fetched.description, fetched.mainText].filter(Boolean).join(" ").slice(0, 800);
      }
    }

    // Compose a full "corpus" for keyword detection
    const fullText = [title, analysisContent, url, fetched.title, fetched.description, fetched.mainText].filter(Boolean).join(' ').trim();

    // Use improved summary and tag methods
    const summary = generateSummary(content, fetched.description, fetched.mainText, title || fetched.title);
    const category = detectCategory(fullText);
    const tags = extractTags(analysisContent || fullText, url, 5);
    const priority = detectPriority(fullText) as "low" | "medium" | "high";
    const actionType = detectActionType(fullText);

    const analysis = {
      summary,
      category,
      tags,
      priority,
      actionType,
    };

    console.log('Improved Internal Analysis result:', analysis);

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
