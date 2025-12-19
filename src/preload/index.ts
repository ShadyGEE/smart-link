import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IPC_CHANNELS } from '../shared/constants/channels';

// Type-safe API exposed to renderer
const api = {
  // System
  system: {
    minimize: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.MINIMIZE),
    maximize: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.MAXIMIZE),
    close: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.CLOSE),
    getStatus: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.GET_STATUS),
    getOfflineStatus: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM.GET_OFFLINE_STATUS),
  },

  // Auth
  auth: {
    login: (email: string, password: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.AUTH.LOGIN, email, password),
    logout: () => ipcRenderer.invoke(IPC_CHANNELS.AUTH.LOGOUT),
    getSession: () => ipcRenderer.invoke(IPC_CHANNELS.AUTH.GET_SESSION),
    refresh: () => ipcRenderer.invoke(IPC_CHANNELS.AUTH.REFRESH),
    register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
      ipcRenderer.invoke(IPC_CHANNELS.AUTH.REGISTER, data),
  },

  // Agent
  agent: {
    sendMessage: (message: string, context?: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.AGENT.SEND_MESSAGE, message, context),
    getSuggestions: () => ipcRenderer.invoke(IPC_CHANNELS.AGENT.GET_SUGGESTIONS),
    getContext: () => ipcRenderer.invoke(IPC_CHANNELS.AGENT.GET_CONTEXT),
    updateContext: (context: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.AGENT.UPDATE_CONTEXT, context),
    setJobRole: (role: string, department?: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.AGENT.SET_JOB_ROLE, role, department),
    cancelRequest: () => ipcRenderer.invoke(IPC_CHANNELS.AGENT.CANCEL_REQUEST),
    onStreamResponse: (callback: (chunk: string) => void) => {
      const handler = (_: IpcRendererEvent, chunk: string) => callback(chunk);
      ipcRenderer.on(IPC_CHANNELS.AGENT.STREAM_RESPONSE, handler);
      return () => ipcRenderer.removeListener(IPC_CHANNELS.AGENT.STREAM_RESPONSE, handler);
    },
  },

  // Chat
  chat: {
    sendMessage: (channelId: string, content: string, replyToId?: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.CHAT.SEND_MESSAGE, channelId, content, replyToId),
    getChannels: () => ipcRenderer.invoke(IPC_CHANNELS.CHAT.GET_CHANNELS),
    getMessages: (channelId: string, options?: { limit?: number; before?: string }) =>
      ipcRenderer.invoke(IPC_CHANNELS.CHAT.GET_MESSAGES, channelId, options),
    createChannel: (name: string, type: string, teamId?: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.CHAT.CREATE_CHANNEL, name, type, teamId),
    deleteChannel: (channelId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.CHAT.DELETE_CHANNEL, channelId),
    markRead: (channelId: string) => ipcRenderer.invoke(IPC_CHANNELS.CHAT.MARK_READ, channelId),
    editMessage: (messageId: string, content: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.CHAT.EDIT_MESSAGE, messageId, content),
    deleteMessage: (messageId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.CHAT.DELETE_MESSAGE, messageId),
  },

  // Team
  team: {
    getTeams: () => ipcRenderer.invoke(IPC_CHANNELS.TEAM.GET_TEAMS),
    createTeam: (name: string, description?: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.TEAM.CREATE_TEAM, name, description),
    getMembers: (teamId: string) => ipcRenderer.invoke(IPC_CHANNELS.TEAM.GET_MEMBERS, teamId),
    addMember: (teamId: string, email: string, role?: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.TEAM.ADD_MEMBER, teamId, email, role),
    removeMember: (teamId: string, userId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.TEAM.REMOVE_MEMBER, teamId, userId),
    getTasks: (teamId: string, filters?: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.TEAM.GET_TASKS, teamId, filters),
    createTask: (task: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.TEAM.CREATE_TASK, task),
    updateTask: (taskId: string, updates: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.TEAM.UPDATE_TASK, taskId, updates),
    deleteTask: (taskId: string) => ipcRenderer.invoke(IPC_CHANNELS.TEAM.DELETE_TASK, taskId),
    getReports: (teamId: string) => ipcRenderer.invoke(IPC_CHANNELS.TEAM.GET_REPORTS, teamId),
    submitReport: (report: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.TEAM.SUBMIT_REPORT, report),
  },

  // Documents
  documents: {
    list: (folderId?: string) => ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS.LIST, folderId),
    get: (documentId: string) => ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS.GET, documentId),
    create: (document: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS.CREATE, document),
    update: (documentId: string, updates: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS.UPDATE, documentId, updates),
    delete: (documentId: string) => ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS.DELETE, documentId),
    upload: (filePath: string, folderId?: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS.UPLOAD, filePath, folderId),
    download: (documentId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS.DOWNLOAD, documentId),
    summarize: (documentId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS.SUMMARIZE, documentId),
    search: (query: string, filters?: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS.SEARCH, query, filters),
  },

  // Meetings
  meetings: {
    list: (filters?: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.MEETINGS.LIST, filters),
    get: (meetingId: string) => ipcRenderer.invoke(IPC_CHANNELS.MEETINGS.GET, meetingId),
    create: (meeting: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.MEETINGS.CREATE, meeting),
    update: (meetingId: string, updates: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.MEETINGS.UPDATE, meetingId, updates),
    delete: (meetingId: string) => ipcRenderer.invoke(IPC_CHANNELS.MEETINGS.DELETE, meetingId),
    generateNotes: (meetingId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.MEETINGS.GENERATE_NOTES, meetingId),
    getSuggestions: (teamId: string, duration: number) =>
      ipcRenderer.invoke(IPC_CHANNELS.MEETINGS.GET_SUGGESTIONS, teamId, duration),
    invite: (meetingId: string, userIds: string[]) =>
      ipcRenderer.invoke(IPC_CHANNELS.MEETINGS.INVITE, meetingId, userIds),
  },

  // Voice
  voice: {
    startRecognition: () => ipcRenderer.invoke(IPC_CHANNELS.VOICE.START_RECOGNITION),
    stopRecognition: () => ipcRenderer.invoke(IPC_CHANNELS.VOICE.STOP_RECOGNITION),
    getStatus: () => ipcRenderer.invoke(IPC_CHANNELS.VOICE.GET_STATUS),
    transcribe: (audioData: ArrayBuffer, sampleRate: number) =>
      ipcRenderer.invoke('voice:transcribe', audioData, sampleRate),
    onTranscription: (callback: (text: string) => void) => {
      const handler = (_: IpcRendererEvent, text: string) => callback(text);
      ipcRenderer.on(IPC_CHANNELS.VOICE.TRANSCRIPTION, handler);
      return () => ipcRenderer.removeListener(IPC_CHANNELS.VOICE.TRANSCRIPTION, handler);
    },
  },

  // Integrations
  integrations: {
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.INTEGRATIONS.GET_ALL),
    connect: (type: string, config: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.INTEGRATIONS.CONNECT, type, config),
    disconnect: (type: string) => ipcRenderer.invoke(IPC_CHANNELS.INTEGRATIONS.DISCONNECT, type),
    sync: (type: string) => ipcRenderer.invoke(IPC_CHANNELS.INTEGRATIONS.SYNC, type),
    getStatus: (type: string) => ipcRenderer.invoke(IPC_CHANNELS.INTEGRATIONS.GET_STATUS, type),
    // Email
    emailFetch: (options?: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.INTEGRATIONS.EMAIL_FETCH, options),
    emailSend: (email: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.INTEGRATIONS.EMAIL_SEND, email),
    emailReply: (messageId: string, content: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.INTEGRATIONS.EMAIL_REPLY, messageId, content),
    // Slack
    slackSend: (channel: string, message: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.INTEGRATIONS.SLACK_SEND, channel, message),
    slackFetch: (channel: string, options?: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.INTEGRATIONS.SLACK_FETCH, channel, options),
    slackChannels: () => ipcRenderer.invoke(IPC_CHANNELS.INTEGRATIONS.SLACK_CHANNELS),
    // Discord
    discordSend: (channelId: string, message: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.INTEGRATIONS.DISCORD_SEND, channelId, message),
    discordFetch: (channelId: string, options?: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.INTEGRATIONS.DISCORD_FETCH, channelId, options),
    discordServers: () => ipcRenderer.invoke(IPC_CHANNELS.INTEGRATIONS.DISCORD_SERVERS),
  },

  // Settings
  settings: {
    get: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.GET),
    update: (settings: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.UPDATE, settings),
    getTheme: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.GET_THEME),
    setTheme: (theme: 'light' | 'dark' | 'system') =>
      ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.SET_THEME, theme),
    export: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.EXPORT),
    import: (data: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.SETTINGS.IMPORT, data),
  },

  // Analytics
  analytics: {
    getDashboard: () => ipcRenderer.invoke(IPC_CHANNELS.ANALYTICS.GET_DASHBOARD),
    getTeamMetrics: (teamId: string, period?: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.ANALYTICS.GET_TEAM_METRICS, teamId, period),
    getTaskMetrics: (teamId?: string, period?: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.ANALYTICS.GET_TASK_METRICS, teamId, period),
    getPerformance: (userId?: string, period?: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.ANALYTICS.GET_PERFORMANCE, userId, period),
    trackEvent: (eventType: string, data: Record<string, unknown>) =>
      ipcRenderer.invoke(IPC_CHANNELS.ANALYTICS.TRACK_EVENT, eventType, data),
  },

  // Notifications
  notifications: {
    getAll: () => ipcRenderer.invoke(IPC_CHANNELS.NOTIFICATIONS.GET_ALL),
    markRead: (notificationId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.NOTIFICATIONS.MARK_READ, notificationId),
    markAllRead: () => ipcRenderer.invoke(IPC_CHANNELS.NOTIFICATIONS.MARK_ALL_READ),
    delete: (notificationId: string) =>
      ipcRenderer.invoke(IPC_CHANNELS.NOTIFICATIONS.DELETE, notificationId),
  },

  // Event listeners for real-time updates
  on: (channel: string, callback: (...args: unknown[]) => void) => {
    const validChannels = [
      'quick-action',
      'navigate',
      'notification',
      'chat-message',
      'agent-response',
      'integration-update',
    ];
    if (validChannels.includes(channel)) {
      const handler = (_: IpcRendererEvent, ...args: unknown[]) => callback(...args);
      ipcRenderer.on(channel, handler);
      return () => ipcRenderer.removeListener(channel, handler);
    }
    return () => {};
  },

  // Remove listener
  off: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.removeListener(channel, callback);
  },
};

// Expose API to renderer
contextBridge.exposeInMainWorld('api', api);

// Type declaration for renderer
export type ElectronAPI = typeof api;
