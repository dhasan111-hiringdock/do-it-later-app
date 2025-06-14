
/**
 * Pattern triggers for Genie keyword detection.
 */
const patterns = {
  greeting: /^(hi|hello|hey|good morning|good afternoon|good evening)/i,
  plan: /(plan|organize|schedule|structure|roadmap|outline|blueprint|timeline|strategy|map out|workflow|step\-by\-step|next steps|prioritize)/i,
  workout: /(workout|exercise|fitness|gym|training|routine|athletic|run|yoga)/i,
  finance: /(money|finance|budget|save|invest|spending|expenses|debt|investing|retirement|portfolio|bank|pay off|saving|fund)/i,
  recipe: /(recipe|cook|food|meal|ingredient|dish|kitchen|grocery|shopping list|snack|lunch|breakfast|dinner)/i,
  learn: /(learn|study|knowledge|skill|course|practice|lesson|education|memorize|exam|school|tutorial)/i,
  summary: /(summary|summarize|overview|digest|recap|quick look|tl;dr)/i,
  action: /(action|todo|task|do|next step|execute|complete|checklist)/i,
  help: /(help|assist|support|guide|how|what can you do|usage|feature|explain)/i,
  productivity: /(productive|productivity|focus|efficient|system|method|workflow|get things done|gtd|prioritization|time management)/i,
  reading: /(read|article|book|reading|library|chapter|reference|e-book|magazine)/i,
  reminder: /(remind|reminder|reminders|notify|alarm|alert|remember|due)/i,
  goals: /(goal|objective|aim|ambition|milestone|target|purpose|mission|resolution)/i,
  motivation: /(motivat(e|ion)|inspire|encourage|drive|boost|energy|push|quote|affirmation)/i,
  selfimprovement: /(self(?:-|\s)?improv(e|ement)|develop|growth|better|upgrade|enhance|habit|routine|personal development)/i,
  quote: /(quote|saying|wisdom|proverb|mantra|words of wisdom)/i,
};

export default patterns;
