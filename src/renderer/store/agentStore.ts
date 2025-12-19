import { create } from 'zustand';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  metadata?: {
    tokensUsed?: number;
    modelUsed?: string;
    processingTime?: number;
  };
}

interface Suggestion {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

interface AgentState {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  suggestions: Suggestion[];
  error: string | null;
  jobRole: string | null;
  department: string | null;

  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  setJobRole: (role: string, department?: string) => void;
  getSuggestions: () => Promise<void>;
  clearError: () => void;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  messages: [],
  isLoading: false,
  isStreaming: false,
  suggestions: [],
  error: null,
  jobRole: null,
  department: null,

  sendMessage: async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // Add user message
    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await window.api.agent.sendMessage(content, {
        jobRole: get().jobRole,
        department: get().department,
      });

      if (response.success && response.data) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date(),
          metadata: response.data.metadata,
        };

        set((state) => ({
          messages: [...state.messages, assistantMessage],
          suggestions: response.data.suggestions || [],
          isLoading: false,
        }));
      } else {
        set({
          error: response.error?.message || 'Failed to get response',
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: 'An unexpected error occurred',
        isLoading: false,
      });
    }
  },

  clearMessages: () => set({ messages: [], suggestions: [] }),

  setJobRole: async (role: string, department?: string) => {
    set({ jobRole: role, department: department || null });

    try {
      await window.api.agent.setJobRole(role, department);
    } catch (error) {
      console.error('Failed to set job role:', error);
    }
  },

  getSuggestions: async () => {
    try {
      const response = await window.api.agent.getSuggestions();
      if (response.success && response.data) {
        set({ suggestions: response.data });
      }
    } catch (error) {
      console.error('Failed to get suggestions:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
