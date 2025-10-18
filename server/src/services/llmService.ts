import { GoogleGenerativeAI } from "@google/generative-ai";

interface TaskGeneration {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  tags: string[];
}

export class LLMService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-2.0-flash which is available and fast
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async generateActionItems(transcript: string): Promise<TaskGeneration[]> {
    console.log("🤖 Starting LLM task generation...");
    console.log(`📝 Transcript length: ${transcript.length} characters`);

    const prompt = `
You are an AI assistant that extracts actionable tasks from meeting transcripts.

Analyze the following meeting transcript and extract clear, actionable tasks.

For each task, provide:
1. A clear, concise title (max 60 characters)
2. A brief description of what needs to be done
3. Priority level based on urgency and importance
4. Relevant tags for categorization

Format your response as a JSON array of tasks:
[
  {
    "title": "Task title",
    "description": "Detailed description",
    "priority": "MEDIUM",
    "tags": ["tag1", "tag2"]
  }
]

Priority Guidelines:
- URGENT: Immediate action required, blocking others, critical deadlines (today/tomorrow)
- HIGH: Important with near-term deadlines (this week), significant impact
- MEDIUM: Standard priority, reasonable timeframes (1-2 weeks), moderate impact
- LOW: Nice-to-have, no strict deadline, minimal immediate impact

Tag Guidelines:
- Extract relevant keywords from context (e.g., "meeting", "review", "proposal", "budget", "design")
- Include department/team names if mentioned
- Add deadline-related tags ("urgent", "weekly", "followup")
- Maximum 3 tags per task

Important guidelines:
- Only extract tasks that are explicitly mentioned or clearly implied as action items
- Make titles specific and actionable (start with verbs like "Review", "Send", "Schedule", etc.)
- Include deadlines or timeframes in descriptions if mentioned
- Assign priority based on urgency keywords ("ASAP", "urgent", "critical") and deadlines
- Limit to maximum 10 tasks to avoid overwhelming users
- If no clear action items are found, return an empty array

Meeting Transcript:
${transcript}

Return only the JSON array, no additional text or explanation.
`;

    try {
      console.log("🚀 Sending request to Gemini API...");
      const result = await this.model.generateContent(prompt);
      
      if (!result || !result.response) {
        console.error("❌ No response received from Gemini API");
        throw new Error("No response from LLM service");
      }

      const response = result.response;
      const text = response.text();
      
      console.log("✅ LLM Response received");
      console.log(`📊 Response length: ${text.length} characters`);
      console.log("🔍 Raw LLM Response:", text.substring(0, 500) + (text.length > 500 ? "..." : ""));

      // Try multiple JSON extraction patterns
      let jsonMatch = text.match(/\[\s*{[\s\S]*}\s*\]/);
      
      // If the first pattern fails, try alternative patterns
      if (!jsonMatch) {
        console.log("🔄 Trying alternative JSON patterns...");
        
        // Try extracting JSON from code blocks
        jsonMatch = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
        if (jsonMatch) {
          console.log("✅ Found JSON in code block");
          jsonMatch[0] = jsonMatch[1];
        } else {
          // Try extracting any array-like structure
          jsonMatch = text.match(/\[[\s\S]*?\]/);
          if (jsonMatch) {
            console.log("✅ Found array-like structure");
          }
        }
      } else {
        console.log("✅ Found JSON with primary pattern");
      }

      if (!jsonMatch) {
        console.warn("⚠️  No valid JSON found in LLM response");
        console.warn("📄 Full response:", text);
        return [];
      }

      console.log("🔗 Extracted JSON:", jsonMatch[0]);

      let tasks: TaskGeneration[];
      try {
        tasks = JSON.parse(jsonMatch[0]);
        console.log(`✅ Successfully parsed ${tasks.length} raw tasks`);
      } catch (parseError) {
        console.error("❌ JSON parsing failed:", parseError);
        console.error("📄 Failed to parse:", jsonMatch[0]);
        return [];
      }

      // Validate and sanitize the response
      const validatedTasks = this.validateAndSanitizeTasks(tasks);
      console.log(`✅ Validated ${validatedTasks.length} tasks`);
      
      return validatedTasks;
    } catch (error) {
      console.error("❌ Error generating action items:", error);
      
      // More detailed error logging
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      
      // Check for specific API errors
      if (error.message?.includes("API key")) {
        console.error("🔑 API Key issue detected");
        throw new Error("Invalid or missing Gemini API key");
      } else if (error.message?.includes("quota")) {
        console.error("💰 Quota exceeded");
        throw new Error("Gemini API quota exceeded");
      } else if (error.message?.includes("model")) {
        console.error("🤖 Model error detected");
        throw new Error("Gemini model not available or invalid");
      }
      
      throw new Error(`Failed to generate action items from transcript: ${error.message}`);
    }
  }

  private validateAndSanitizeTasks(tasks: any[]): TaskGeneration[] {
    if (!Array.isArray(tasks)) {
      return [];
    }

    return tasks
      .filter(
        (task) =>
          task && typeof task === "object" && task.title && task.description
      )
      .map((task) => ({
        title: String(task.title).trim().substring(0, 60),
        description: String(task.description).trim().substring(0, 500),
        priority: this.validatePriority(task.priority),
        tags: this.validateTags(task.tags),
      }))
      .slice(0, 10); // Limit to 10 tasks
  }

  private validatePriority(
    priority: any
  ): "LOW" | "MEDIUM" | "HIGH" | "URGENT" {
    const validPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
    if (
      typeof priority === "string" &&
      validPriorities.includes(priority.toUpperCase())
    ) {
      return priority.toUpperCase() as "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    }
    return "MEDIUM"; // Default fallback
  }

  private validateTags(tags: any): string[] {
    if (!Array.isArray(tags)) {
      return [];
    }

    return tags
      .filter((tag) => typeof tag === "string" && tag.trim().length > 0)
      .map((tag) => String(tag).trim().toLowerCase())
      .slice(0, 3); // Limit to 3 tags
  }

  async testConnection(): Promise<boolean> {
    console.log("🔧 Testing Gemini API connection...");
    
    try {
      const result = await this.model.generateContent(
        'Hello, just testing the connection. Respond with "OK".'
      );
      
      if (!result || !result.response) {
        console.error("❌ No response received during connection test");
        return false;
      }
      
      const response = result.response;
      const text = response.text();
      
      console.log("✅ Connection test response:", text);
      
      const isValid = text.includes("OK");
      console.log(`🔗 Connection test ${isValid ? "passed" : "failed"}`);
      
      return isValid;
    } catch (error) {
      console.error("❌ LLM connection test failed:", error);
      
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        
        if (error.message?.includes("API key")) {
          console.error("🔑 API Key appears to be invalid");
        } else if (error.message?.includes("quota")) {
          console.error("💰 API quota may be exceeded");
        } else if (error.message?.includes("model")) {
          console.error("🤖 Model 'gemini-1.5-flash' may not be available");
        }
      }
      
      return false;
    }
  }
}

export const llmService = new LLMService();
