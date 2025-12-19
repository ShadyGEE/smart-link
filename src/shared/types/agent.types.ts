// Agent Types and Interfaces

export type AgentType = 'MAIN' | 'RESEARCH' | 'DOCUMENT' | 'RISK' | 'MEETING';

export interface AgentInput {
  message: string;
  context: AgentContext;
  conversationHistory: ConversationMessage[];
  attachments?: Attachment[];
  voiceTranscription?: string;
}

export interface AgentOutput {
  response: string;
  actions?: AgentAction[];
  suggestions?: Suggestion[];
  metadata: AgentMetadata;
}

export interface AgentContext {
  userId: string;
  teamId?: string;
  jobRole?: string;
  department?: string;
  preferences: UserPreferences;
  recentTasks?: TaskSummary[];
  recentDocuments?: DocumentSummary[];
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agentType?: AgentType;
  metadata?: Record<string, unknown>;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  content?: string;
}

export interface AgentAction {
  id: string;
  type: ActionType;
  target: string;
  payload: Record<string, unknown>;
  requiresConfirmation: boolean;
  status: 'pending' | 'confirmed' | 'executed' | 'cancelled';
}

export type ActionType =
  | 'CREATE_TASK'
  | 'UPDATE_TASK'
  | 'DELETE_TASK'
  | 'SEND_MESSAGE'
  | 'SEND_EMAIL'
  | 'SCHEDULE_MEETING'
  | 'CREATE_DOCUMENT'
  | 'SEARCH_WEB'
  | 'GENERATE_REPORT'
  | 'SUMMARIZE_DOCUMENT'
  | 'ANALYZE_RISK';

export interface Suggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  action?: AgentAction;
}

export type SuggestionType =
  | 'TASK_REMINDER'
  | 'MEETING_PREP'
  | 'DOCUMENT_REVIEW'
  | 'RISK_ALERT'
  | 'BEST_PRACTICE'
  | 'TEAM_UPDATE';

export interface AgentMetadata {
  tokensUsed: number;
  modelUsed: string;
  processingTime: number;
  confidence: number;
  sources?: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationPreferences;
  agent: AgentPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  desktop: boolean;
  sound: boolean;
  taskReminders: boolean;
  meetingReminders: boolean;
  agentSuggestions: boolean;
}

export interface AgentPreferences {
  autoSuggestions: boolean;
  voiceEnabled: boolean;
  responseStyle: 'concise' | 'detailed' | 'balanced';
  preferredModel?: string;
}

export interface TaskSummary {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: Date;
}

export interface DocumentSummary {
  id: string;
  title: string;
  type: string;
  summary?: string;
  lastAccessed: Date;
}

// OpenRouter API Types
export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
  tools?: OpenRouterTool[];
}

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export interface OpenRouterTool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface OpenRouterResponse {
  id: string;
  model: string;
  choices: {
    message: OpenRouterMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface StreamChunk {
  id: string;
  choices: {
    delta: {
      content?: string;
      tool_calls?: ToolCall[];
    };
    finish_reason?: string;
  }[];
}
