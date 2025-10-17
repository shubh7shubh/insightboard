import { GoogleGenerativeAI } from '@google/generative-ai';

interface TaskGeneration {
  title: string;
  description: string;
}

export class LLMService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateActionItems(transcript: string): Promise<TaskGeneration[]> {
    const prompt = `
You are an AI assistant that extracts actionable tasks from meeting transcripts.

Analyze the following meeting transcript and extract clear, actionable tasks.

For each task, provide:
1. A clear, concise title (max 60 characters)
2. A brief description of what needs to be done
3. Any relevant context or deadline if mentioned

Format your response as a JSON array of tasks:
[
  {
    "title": "Task title",
    "description": "Detailed description"
  }
]

Important guidelines:
- Only extract tasks that are explicitly mentioned or clearly implied as action items
- Make titles specific and actionable (start with verbs like "Review", "Send", "Schedule", etc.)
- Include deadlines or timeframes in descriptions if mentioned
- Limit to maximum 10 tasks to avoid overwhelming users
- If no clear action items are found, return an empty array

Meeting Transcript:
${transcript}

Return only the JSON array, no additional text or explanation.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\[\s*{[\s\S]*}\s*\]/);
      if (!jsonMatch) {
        console.warn('No valid JSON found in LLM response:', text);
        return [];
      }

      const tasks: TaskGeneration[] = JSON.parse(jsonMatch[0]);
      
      // Validate and sanitize the response
      return this.validateAndSanitizeTasks(tasks);
    } catch (error) {
      console.error('Error generating action items:', error);
      throw new Error('Failed to generate action items from transcript');
    }
  }

  private validateAndSanitizeTasks(tasks: any[]): TaskGeneration[] {
    if (!Array.isArray(tasks)) {
      return [];
    }

    return tasks
      .filter(task => task && typeof task === 'object' && task.title && task.description)
      .map(task => ({
        title: String(task.title).trim().substring(0, 60),
        description: String(task.description).trim().substring(0, 500)
      }))
      .slice(0, 10); // Limit to 10 tasks
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.model.generateContent('Hello, just testing the connection. Respond with "OK".');
      const response = result.response;
      return response.text().includes('OK');
    } catch (error) {
      console.error('LLM connection test failed:', error);
      return false;
    }
  }
}

export const llmService = new LLMService();