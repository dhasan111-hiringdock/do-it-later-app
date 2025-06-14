interface ContentItem {
  id: string;
  title: string;
  summary?: string;
  category: string;
  tags?: string[];
  url?: string;
  action_type?: string;
}

interface ChatResponse {
  response: string;
  suggestions?: string[];
  isHelpful: boolean;
}

class InternalAIAssistant {
  private patterns = {
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

  private responses = {
    greeting: [
      "Hi! I'm here to help you organize and take action on your saved content. What would you like to work on?",
      "Hello! I can help you create plans, organize content, and turn your saves into actionable steps. How can I assist you today?",
      "Hey there! Ready to turn your saved content into something actionable? What's on your mind?"
    ],
    plan: [
      "I can help you create a plan! Based on your saved content, I'll organize it into actionable steps.",
      "Let's build a structured plan together. I'll analyze your saves and suggest a logical sequence.",
      "Great idea! I'll help you turn your saved items into a step-by-step plan."
    ],
    workout: [
      "I can help organize your fitness content into a workout routine. Let me check your fitness saves...",
      "Perfect! I'll create a structured fitness plan from your saved workout content.",
      "Let's build your fitness plan! I'll organize your saved exercises and tips into a routine."
    ],
    finance: [
      "I'll help you organize your financial content into actionable money management steps.",
      "Great! Let me turn your saved finance tips into a practical money plan.",
      "I can help structure your financial saves into budgeting and investment actions."
    ],
    recipe: [
      "I'll organize your saved recipes into meal plans and shopping lists!",
      "Perfect! Let me turn your recipe saves into organized meal planning.",
      "I can help you create meal plans and shopping lists from your saved recipes."
    ],
    learn: [
      "I'll help organize your learning content into a structured study plan.",
      "Great! Let me create a learning path from your saved educational content.",
      "I can turn your saved learning resources into a step-by-step study guide."
    ],
    summary: [
      "I'll create summaries of your saved content to help you quickly review key points.",
      "Let me digest your saves into clear, actionable summaries.",
      "I can summarize your content to highlight the most important takeaways."
    ],
    productivity: [
      "Improving productivity is all about smart workflows! I can help you set up systems or extract productivity tips from your saves.",
      "Let's enhance your productivity! Ready to organize your resources into a focused action plan?",
      "You're looking to get more done—let's prioritize your tasks and help you stay efficient."
    ],
    reading: [
      "It sounds like you want to organize your reading list. I can group your articles and books, set up a reading schedule, or summarize your most important saves.",
      "Let's help you stay on top of your reading! Would you like a summary, plan, or recommendations from your saved reading content?",
      "I'm ready to organize and prioritize your reading list so nothing gets lost."
    ],
    reminder: [
      "I can help you set reminders or extract action steps that you can add to your own reminder system.",
      "Staying on track is easier with good reminders. Want to turn your to-dos into scheduled alerts?",
      "I can organize your action items and suggest how to schedule reminders in your favorite tool."
    ],
    goals: [
      "Setting goals is the first step! I can help turn your saved ideas into clear objectives and suggest actionable next steps.",
      "Let's break your goals into milestones using your saved content.",
      "Ready to turn your aspirations into structured goals? I’m here to help organize them into achievable action plans!"
    ],
    motivation: [
      "A little motivation goes a long way! Would you like to see a quote or find inspiration in your saved content?",
      "Let's find your drive. Do you want encouraging words, or should I highlight inspiring content from your saves?",
      "Here's a motivational boost: 'The secret of getting ahead is getting started.'"
    ],
    selfimprovement: [
      "Working on self-improvement? Let's organize your resources into a personal growth routine.",
      "Personal development is a journey—I'll help you set priorities and find actionable steps from your saves.",
      "Ready to level up? I can structure your self-improvement content to help you build better habits."
    ],
    quote: [
      "Here's a quote for you: 'Success is not final, failure is not fatal: It is the courage to continue that counts.' —Winston Churchill",
      "Whenever you need inspiration, just ask for a quote!",
      "Stay motivated: 'Your limitation—it's only your imagination.'"
    ],
    action: [
      "Let's turn your tasks into action! I can break down your to-do list and help you plan the next steps.",
      "Taking action is key—ready to create some actionable items from your saved content?",
      "Let’s organize your action items for momentum!"
    ],
    default: [
      "I can help you organize your saved content into actionable plans. Try asking me to create a plan, summarize content, or build a routine!",
      "I'm here to help turn your saves into action! I can create plans, organize content by category, or suggest next steps.",
      "Let me help you make the most of your saved content. I can organize, summarize, or create action plans from your saves."
    ]
  };

  private suggestions = {
    fitness: [
      "Create a weekly workout schedule",
      "Organize exercises by muscle group",
      "Build a beginner-friendly routine"
    ],
    finance: [
      "Create a monthly budget plan",
      "Organize savings strategies",
      "Build an investment roadmap"
    ],
    knowledge: [
      "Create a learning schedule",
      "Organize topics by priority",
      "Build a study timeline"
    ],
    personal: [
      "Create daily habits",
      "Organize goals by timeline",
      "Build a personal routine"
    ],
    work: [
      "Create a productivity system",
      "Organize tasks by priority",
      "Build a work schedule"
    ],
    reading: [
      "Summarize my reading list",
      "Prioritize saved articles",
      "Suggest top books to start"
    ],
    goals: [
      "Break down my goals",
      "Set up goal milestones",
      "Suggest actions for my goals"
    ],
    motivation: [
      "Send me a quote",
      "Find inspiring content",
      "Boost my motivation"
    ]
  };

  public async processMessage(message: string, userContent: ContentItem[] = []): Promise<ChatResponse> {
    const lowerMessage = message.toLowerCase();

    // Pattern-matching with logging for debugging
    if (this.patterns.greeting.test(message)) {
      console.log("Genie matched: greeting");
      return {
        response: this.getRandomResponse('greeting'),
        suggestions: this.getGeneralSuggestions(),
        isHelpful: true
      };
    }
    if (this.patterns.help.test(message)) {
      console.log("Genie matched: help");
      return {
        response: this.getHelpResponse(),
        suggestions: this.getGeneralSuggestions(),
        isHelpful: true
      };
    }
    if (this.patterns.plan.test(message)) {
      console.log("Genie matched: plan");
      return this.createPlanResponse(message, userContent);
    }
    if (this.patterns.summary.test(message)) {
      console.log("Genie matched: summary");
      return this.createSummaryResponse(userContent);
    }
    if (this.patterns.workout.test(message)) {
      console.log("Genie matched: workout");
      return this.createCategoryResponse('fitness', userContent);
    }
    if (this.patterns.finance.test(message)) {
      console.log("Genie matched: finance");
      return this.createCategoryResponse('finance', userContent);
    }
    if (this.patterns.recipe.test(message)) {
      console.log("Genie matched: recipe");
      return this.createRecipeResponse(userContent);
    }
    if (this.patterns.learn.test(message)) {
      console.log("Genie matched: learn");
      return this.createCategoryResponse('knowledge', userContent);
    }
    if (this.patterns.productivity.test(message)) {
      console.log("Genie matched: productivity");
      return {
        response: this.getRandomResponse('productivity'),
        suggestions: [
          "Build a productivity workflow",
          "Suggest focus routines",
          "Get productivity tips"
        ],
        isHelpful: true
      };
    }
    if (this.patterns.reading.test(message)) {
      console.log("Genie matched: reading");
      return {
        response: this.getRandomResponse('reading'),
        suggestions: this.suggestions.reading,
        isHelpful: true
      };
    }
    if (this.patterns.reminder.test(message)) {
      console.log("Genie matched: reminder");
      return {
        response: this.getRandomResponse('reminder'),
        suggestions: ["Add a reminder", "Set a due date", "Organize my tasks"],
        isHelpful: true
      };
    }
    if (this.patterns.goals.test(message)) {
      console.log("Genie matched: goals");
      return {
        response: this.getRandomResponse('goals'),
        suggestions: this.suggestions.goals,
        isHelpful: true
      };
    }
    if (this.patterns.motivation.test(message)) {
      console.log("Genie matched: motivation");
      return {
        response: this.getRandomResponse('motivation'),
        suggestions: this.suggestions.motivation,
        isHelpful: true
      };
    }
    if (this.patterns.selfimprovement.test(message)) {
      console.log("Genie matched: selfimprovement");
      return {
        response: this.getRandomResponse('selfimprovement'),
        suggestions: [
          "Suggest self-improvement tasks",
          "Build a better habit",
          "Organize personal growth goals"
        ],
        isHelpful: true
      };
    }
    if (this.patterns.quote.test(message)) {
      console.log("Genie matched: quote");
      return {
        response: this.getRandomResponse('quote'),
        suggestions: this.suggestions.motivation,
        isHelpful: true
      };
    }
    if (this.patterns.action.test(message)) {
      console.log("Genie matched: action");
      return {
        response: this.getRandomResponse('action'),
        suggestions: [
          "Suggest next action",
          "Create actionable steps",
          "Make a to-do list"
        ],
        isHelpful: true
      };
    }

    // If no patterns matched, log a fallback
    console.log("Genie matched: default (no patterns matched)");
    return {
      response: this.getRandomResponse('default'),
      suggestions: this.getGeneralSuggestions(),
      isHelpful: true
    };
  }

  private getRandomResponse(category: keyof typeof this.responses): string {
    const responses = this.responses[category] || this.responses.default;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getHelpResponse(): string {
    return `I'm your internal assistant! Here's what I can help you with:

📋 **Create Plans** - Turn your saves into step-by-step action plans
📊 **Organize Content** - Group your saves by category or topic
📝 **Summarize** - Get quick overviews of your saved content
🎯 **Build Routines** - Create workout, study, or daily routines
💡 **Suggest Actions** - Get specific next steps for your goals

Just ask me things like:
• "Create a workout plan from my fitness saves"
• "Summarize my finance content"
• "Build a learning schedule"
• "Organize my recipes into meal plans"`;
  }

  private createPlanResponse(message: string, content: ContentItem[]): ChatResponse {
    if (content.length === 0) {
      return {
        response: "I'd love to help you create a plan! However, I don't see any saved content to work with yet. Try saving some articles, videos, or resources first, then ask me to organize them into a plan.",
        suggestions: ["Save some content first", "Browse popular content", "Start with a simple goal"],
        isHelpful: true
      };
    }

    const categories = this.categorizeContent(content);
    const dominantCategory = this.getDominantCategory(categories);
    
    let planResponse = `Great! I can create a plan from your ${content.length} saved items. `;
    
    if (dominantCategory) {
      planResponse += `I notice you have a lot of ${dominantCategory} content. `;
      planResponse += this.generateCategoryPlan(dominantCategory, categories[dominantCategory]);
    } else {
      planResponse += this.generateMixedPlan(categories);
    }

    return {
      response: planResponse,
      suggestions: this.getSuggestionsForCategory(dominantCategory || 'general'),
      isHelpful: true
    };
  }

  private createSummaryResponse(content: ContentItem[]): ChatResponse {
    if (content.length === 0) {
      return {
        response: "I'd be happy to summarize your content, but I don't see any saves yet. Once you start saving articles, videos, or other content, I can create helpful summaries for you!",
        suggestions: ["Save some content first", "Explore trending content", "Start with your interests"],
        isHelpful: true
      };
    }

    const categories = this.categorizeContent(content);
    let summary = `Here's a summary of your ${content.length} saved items:\n\n`;

    Object.entries(categories).forEach(([category, items]) => {
      summary += `**${category.toUpperCase()}** (${items.length} items):\n`;
      items.slice(0, 3).forEach(item => {
        summary += `• ${item.title}\n`;
      });
      if (items.length > 3) {
        summary += `• ...and ${items.length - 3} more\n`;
      }
      summary += '\n';
    });

    summary += "Would you like me to create action plans for any specific category?";

    return {
      response: summary,
      suggestions: Object.keys(categories).map(cat => `Create ${cat} plan`),
      isHelpful: true
    };
  }

  private createCategoryResponse(category: string, content: ContentItem[]): ChatResponse {
    const categoryItems = content.filter(item => 
      item.category.toLowerCase() === category.toLowerCase() ||
      item.tags?.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
    );

    if (categoryItems.length === 0) {
      return {
        response: `I don't see any ${category} content in your saves yet. Try saving some ${category}-related articles, videos, or resources, then I can help organize them!`,
        suggestions: [`Save ${category} content`, "Explore popular content", "Browse categories"],
        isHelpful: true
      };
    }

    let response = `I found ${categoryItems.length} ${category}-related items! `;
    response += this.generateCategoryPlan(category, categoryItems);

    return {
      response,
      suggestions: this.getSuggestionsForCategory(category),
      isHelpful: true
    };
  }

  private createRecipeResponse(content: ContentItem[]): ChatResponse {
    const recipeItems = content.filter(item => 
      item.category.toLowerCase() === 'personal' && 
      (item.title.toLowerCase().includes('recipe') || 
       item.tags?.some(tag => ['recipe', 'cooking', 'food'].includes(tag.toLowerCase())))
    );

    if (recipeItems.length === 0) {
      return {
        response: "I don't see any recipe content in your saves yet. Try saving some recipes, cooking tips, or meal ideas, then I can help you create meal plans and shopping lists!",
        suggestions: ["Save some recipes", "Explore cooking content", "Plan your meals"],
        isHelpful: true
      };
    }

    const response = `Perfect! I found ${recipeItems.length} recipe-related saves. I can help you:

📅 **Meal Planning**: Organize your recipes into weekly meal plans
🛒 **Shopping Lists**: Extract ingredients for easy grocery shopping  
👨‍🍳 **Cooking Schedule**: Plan when to prep and cook each meal
🍽️ **Meal Categories**: Group by breakfast, lunch, dinner, or cuisine type

Your saved recipes include:
${recipeItems.slice(0, 3).map(item => `• ${item.title}`).join('\n')}
${recipeItems.length > 3 ? `• ...and ${recipeItems.length - 3} more!` : ''}`;

    return {
      response,
      suggestions: ["Create weekly meal plan", "Generate shopping list", "Organize by meal type"],
      isHelpful: true
    };
  }

  private categorizeContent(content: ContentItem[]): Record<string, ContentItem[]> {
    const categories: Record<string, ContentItem[]> = {};
    
    content.forEach(item => {
      const category = item.category || 'general';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });

    return categories;
  }

  private getDominantCategory(categories: Record<string, ContentItem[]>): string | null {
    let maxCount = 0;
    let dominantCategory = null;

    Object.entries(categories).forEach(([category, items]) => {
      if (items.length > maxCount) {
        maxCount = items.length;
        dominantCategory = category;
      }
    });

    return maxCount >= 3 ? dominantCategory : null;
  }

  private generateCategoryPlan(category: string, items: ContentItem[]): string {
    switch (category.toLowerCase()) {
      case 'fitness':
        return `Here's your fitness action plan:

🎯 **Week 1-2**: Foundation
• Start with basic exercises from your saves
• Focus on form and consistency
• Track your progress

🎯 **Week 3-4**: Build intensity  
• Add more challenging workouts
• Incorporate nutrition tips you've saved
• Establish a routine

🎯 **Week 5+**: Advanced training
• Try advanced techniques from your saves
• Set new fitness goals
• Monitor and adjust your plan

Your saved content includes: ${items.slice(0, 2).map(item => item.title).join(', ')}`;

      case 'finance':
        return `Here's your financial action plan:

💰 **Month 1**: Foundation
• Review budgeting tips from your saves
• Track your current spending
• Set financial goals

💰 **Month 2**: Optimization
• Implement saving strategies you've saved
• Reduce unnecessary expenses
• Start emergency fund

💰 **Month 3+**: Growth
• Explore investment options from your saves
• Automate your savings
• Plan for long-term goals

Based on your saves: ${items.slice(0, 2).map(item => item.title).join(', ')}`;

      case 'knowledge':
        return `Here's your learning plan:

📚 **Phase 1**: Foundation (Week 1-2)
• Start with beginner content from your saves
• Set daily learning time
• Take notes and track progress

📚 **Phase 2**: Deep dive (Week 3-6)
• Focus on core concepts you've saved
• Practice what you learn
• Connect concepts together

📚 **Phase 3**: Application (Week 7+)
• Apply knowledge to real projects
• Review advanced content
• Share and teach others

Your learning resources: ${items.slice(0, 2).map(item => item.title).join(', ')}`;

      default:
        return `Here's an action plan for your ${category} content:

✅ **Step 1**: Review and organize
• Go through your ${items.length} saved items
• Identify key themes and priorities
• Remove outdated or irrelevant content

✅ **Step 2**: Create action items
• Turn each save into specific tasks
• Set deadlines and milestones
• Start with quick wins

✅ **Step 3**: Execute and track
• Work through your action items
• Track progress and results
• Adjust your approach as needed`;
    }
  }

  private generateMixedPlan(categories: Record<string, ContentItem[]>): string {
    const categoryList = Object.keys(categories).join(', ');
    return `I see you have diverse content across ${categoryList}. Here's a balanced approach:

🎯 **Week 1**: Foundation
• Pick one category to focus on first
• Review and organize that content
• Start with 1-2 actionable items

🎯 **Week 2-3**: Expand  
• Add a second category
• Create routines for both areas
• Track your progress

🎯 **Week 4+**: Integrate
• Balance all your interests
• Create cross-category connections
• Maintain consistent action

Which category would you like to start with?`;
  }

  private getSuggestionsForCategory(category: string): string[] {
    return this.suggestions[category as keyof typeof this.suggestions] || [
      "Create an action plan",
      "Organize by priority",
      "Set up reminders"
    ];
  }

  private getGeneralSuggestions(): string[] {
    return [
      "Create a plan from my saves",
      "Summarize my content",
      "Help me get organized",
      "What should I do first?"
    ];
  }
}

export default InternalAIAssistant;
