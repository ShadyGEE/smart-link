import type {
  OpenRouterRequest,
  OpenRouterResponse,
  StreamChunk,
  OpenRouterMessage,
} from '../../../shared/types/agent.types';

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';
  private defaultModel = 'openai/gpt-4o';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(request: OpenRouterRequest): Promise<OpenRouterResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://smartlink.app',
        'X-Title': 'SmartLink',
      },
      body: JSON.stringify({
        model: request.model || this.defaultModel,
        messages: request.messages,
        max_tokens: request.max_tokens || 4096,
        temperature: request.temperature ?? 0.7,
        top_p: request.top_p ?? 1,
        stream: false,
        tools: request.tools,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `OpenRouter API error: ${response.status} - ${error.message || 'Unknown error'}`
      );
    }

    return response.json();
  }

  async *chatStream(
    request: OpenRouterRequest
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://smartlink.app',
        'X-Title': 'SmartLink',
      },
      body: JSON.stringify({
        model: request.model || this.defaultModel,
        messages: request.messages,
        max_tokens: request.max_tokens || 4096,
        temperature: request.temperature ?? 0.7,
        top_p: request.top_p ?? 1,
        stream: true,
        tools: request.tools,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `OpenRouter API error: ${response.status} - ${error.message || 'Unknown error'}`
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (!trimmed.startsWith('data: ')) continue;

          try {
            const data = JSON.parse(trimmed.slice(6));
            yield data as StreamChunk;
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  setDefaultModel(model: string): void {
    this.defaultModel = model;
  }

  // Available models for different use cases
  static readonly MODELS = {
    // Fast and cheap
    FAST: 'openai/gpt-4o-mini',
    // Balanced
    BALANCED: 'openai/gpt-4o',
    // Powerful reasoning
    POWERFUL: 'anthropic/claude-3.5-sonnet',
    // Code-focused
    CODE: 'anthropic/claude-3.5-sonnet',
    // Cost-effective
    CHEAP: 'meta-llama/llama-3.1-70b-instruct',
  } as const;

  // Build a conversation with proper message formatting
  static buildMessages(
    systemPrompt: string,
    userMessage: string,
    conversationHistory: OpenRouterMessage[] = []
  ): OpenRouterMessage[] {
    return [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];
  }
}

export default OpenRouterClient;
