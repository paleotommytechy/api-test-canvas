import OpenAI from 'openai';
import { ApiEndpoint } from '../types/api';

export class AiService {
  private openai: OpenAI | null = null;

  constructor(apiKey: string) {
    if (apiKey) {
      this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    }
  }

  async enrichEndpoint(endpoint: ApiEndpoint): Promise<Partial<ApiEndpoint['aiGenerated']>> {
    if (!this.openai) {
      return this.getMockEnrichment(endpoint);
    }

    try {
      const prompt = `Analyze this API endpoint and generate a detailed explanation, suggested improvements, a sample request body (JSON), a sample response body (JSON), and code snippets in cURL, Python, and TypeScript.
      
      Endpoint: ${endpoint.method} ${endpoint.path}
      Summary: ${endpoint.summary}
      Description: ${endpoint.description || 'N/A'}
      Parameters: ${JSON.stringify(endpoint.parameters)}
      Request Body: ${JSON.stringify(endpoint.requestBody)}
      
      Return a JSON object with:
      {
        "explanation": "string",
        "suggestedImprovements": ["string"],
        "sampleRequest": {},
        "sampleResponse": {},
        "snippets": { "curl": "string", "python": "string", "typescript": "string", "java": "string" }
      }`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message.content;
      return content ? JSON.parse(content) : this.getMockEnrichment(endpoint);
    } catch (error) {
      console.error('AI Enrichment error:', error);
      return this.getMockEnrichment(endpoint);
    }
  }

  async chatAboutEndpoint(endpoint: ApiEndpoint, question: string, history: any[]): Promise<string> {
    if (!this.openai) return "AI key not provided. Using mock response: This endpoint is used to interact with resources.";

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: `You are an API expert. Help the user understand this endpoint: ${endpoint.method} ${endpoint.path}. ${endpoint.description || ''}` },
          ...history,
          { role: 'user', content: question }
        ]
      });

      return response.choices[0].message.content || "No response from AI.";
    } catch (error) {
      return "Sorry, I encountered an error while processing your request.";
    }
  }

  private getMockEnrichment(endpoint: ApiEndpoint): ApiEndpoint['aiGenerated'] {
    return {
      explanation: `This is a ${endpoint.method} request to ${endpoint.path}. It is typically used for ${endpoint.summary.toLowerCase()}.`,
      suggestedImprovements: [
        "Add more detailed error responses",
        "Implement rate limiting headers",
        "Add request validation schemas"
      ],
      sampleRequest: endpoint.parameters.find(p => p.in === 'body')?.example || { key: "value" },
      sampleResponse: endpoint.responses[0]?.example || { status: "success", data: {} },
      snippets: {
        curl: `curl -X ${endpoint.method} "https://api.example.com${endpoint.path}"`,
        python: `import requests

response = requests.${endpoint.method.toLowerCase()}("https://api.example.com${endpoint.path}")
print(response.json())`,
        typescript: `const response = await fetch("https://api.example.com${endpoint.path}", {
  method: "${endpoint.method}"
});
const data = await response.json();`,
        java: `// Simplified Java example
HttpRequest request = HttpRequest.newBuilder()
  .uri(URI.create("https://api.example.com${endpoint.path}"))
  .method("${endpoint.method}", HttpRequest.BodyPublishers.noBody())
  .build();`
      }
    };
  }
}
