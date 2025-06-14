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

import patterns from './patterns';
import { responses, suggestions } from './responses';

class InternalAIAssistant {
  private patterns = patterns;

  private responses = responses;

  private suggestions = suggestions;

  public async processMessage(message: string, userContent: ContentItem[] = []): Promise<ChatResponse> {
    console.log('[Genie] processMessage called with:', message, userContent);
    const lowerMessage = message.toLowerCase();

    // Pattern-matching with logging for debugging
    if (this.patterns.greeting.test(message)) {
      console.log("Genie matched: greeting");
      const response = this.getRandomResponse('greeting');
      console.log("Genie response (greeting):", response);
      return {
        response,
        suggestions: this.getGeneralSuggestions(),
        isHelpful: true
      };
    }
    if (this.patterns.help.test(message)) {
      console.log("Genie matched: help");
      const response = this.getHelpResponse();
      console.log("Genie response (help):", response);
      return {
        response,
        suggestions: this.getGeneralSuggestions(),
        isHelpful: true
      };
    }
    if (this.patterns.plan.test(message)) {
      console.log("Genie matched: plan");
      const res = this.createPlanResponse(message, userContent);
      console.log("Genie response (plan):", res);
      return res;
    }
    if (this.patterns.summary.test(message)) {
      console.log("Genie matched: summary");
      const res = this.createSummaryResponse(userContent);
      console.log("Genie response (summary):", res);
      return res;
    }
    if (this.patterns.workout.test(message)) {
      console.log("Genie matched: workout");
      const res = this.createCategoryResponse('fitness', userContent);
      console.log("Genie response (workout):", res);
      return res;
    }
    if (this.patterns.finance.test(message)) {
      console.log("Genie matched: finance");
      const res = this.createCategoryResponse('finance', userContent);
      console.log("Genie response (finance):", res);
      return res;
    }
    if (this.patterns.recipe.test(message)) {
      console.log("Genie matched: recipe");
      const res = this.createRecipeResponse(userContent);
      console.log("Genie response (recipe):", res);
      return res;
    }
    if (this.patterns.learn.test(message)) {
      console.log("Genie matched: learn");
      const res = this.createCategoryResponse('knowledge', userContent);
      console.log("Genie response (learn):", res);
      return res;
    }
    if (this.patterns.productivity.test(message)) {
      console.log("Genie matched: productivity");
      const response = this.getRandomResponse('productivity');
      console.log("Genie response (productivity):", response);
      return {
        response,
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
      const response = this.getRandomResponse('reading');
      console.log("Genie response (reading):", response);
      return {
        response,
        suggestions: this.suggestions.reading,
        isHelpful: true
      };
    }
    if (this.patterns.reminder.test(message)) {
      console.log("Genie matched: reminder");
      const response = this.getRandomResponse('reminder');
      console.log("Genie response (reminder):", response);
      return {
        response,
        suggestions: ["Add a reminder", "Set a due date", "Organize my tasks"],
        isHelpful: true
      };
    }
    if (this.patterns.goals.test(message)) {
      console.log("Genie matched: goals");
      const response = this.getRandomResponse('goals');
      console.log("Genie response (goals):", response);
      return {
        response,
        suggestions: this.suggestions.goals,
        isHelpful: true
      };
    }
    if (this.patterns.motivation.test(message)) {
      console.log("Genie matched: motivation");
      const response = this.getRandomResponse('motivation');
      console.log("Genie response (motivation):", response);
      return {
        response,
        suggestions: this.suggestions.motivation,
        isHelpful: true
      };
    }
    if (this.patterns.selfimprovement.test(message)) {
      console.log("Genie matched: selfimprovement");
      const response = this.getRandomResponse('selfimprovement');
      console.log("Genie response (selfimprovement):", response);
      return {
        response,
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
      const response = this.getRandomResponse('quote');
      console.log("Genie response (quote):", response);
      return {
        response,
        suggestions: this.suggestions.motivation,
        isHelpful: true
      };
    }
    if (this.patterns.action.test(message)) {
      console.log("Genie matched: action");
      const response = this.getRandomResponse('action');
      console.log("Genie response (action):", response);
      return {
        response,
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
    const defaultResponse = this.getRandomResponse('default');
    console.log("Genie default response:", defaultResponse);

    return {
      response: defaultResponse,
      suggestions: this.getGeneralSuggestions(),
      isHelpful: true
    };
  }

  private getRandomResponse(category: keyof typeof responses): string {
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
    return suggestions[category as keyof typeof suggestions] || [
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
