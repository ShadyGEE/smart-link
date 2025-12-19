// IPC Channel definitions for Main <-> Renderer communication

export const IPC_CHANNELS = {
  // Authentication
  AUTH: {
    LOGIN: 'auth:login',
    LOGOUT: 'auth:logout',
    REFRESH: 'auth:refresh',
    GET_SESSION: 'auth:get-session',
    REGISTER: 'auth:register',
  },

  // Agent Communication
  AGENT: {
    SEND_MESSAGE: 'agent:send-message',
    GET_SUGGESTIONS: 'agent:get-suggestions',
    STREAM_RESPONSE: 'agent:stream-response',
    CANCEL_REQUEST: 'agent:cancel-request',
    GET_CONTEXT: 'agent:get-context',
    UPDATE_CONTEXT: 'agent:update-context',
    SET_JOB_ROLE: 'agent:set-job-role',
  },

  // Chat
  CHAT: {
    SEND_MESSAGE: 'chat:send-message',
    GET_CHANNELS: 'chat:get-channels',
    GET_MESSAGES: 'chat:get-messages',
    CREATE_CHANNEL: 'chat:create-channel',
    DELETE_CHANNEL: 'chat:delete-channel',
    MARK_READ: 'chat:mark-read',
    EDIT_MESSAGE: 'chat:edit-message',
    DELETE_MESSAGE: 'chat:delete-message',
  },

  // Team
  TEAM: {
    GET_TEAMS: 'team:get-teams',
    CREATE_TEAM: 'team:create-team',
    GET_MEMBERS: 'team:get-members',
    ADD_MEMBER: 'team:add-member',
    REMOVE_MEMBER: 'team:remove-member',
    GET_TASKS: 'team:get-tasks',
    CREATE_TASK: 'team:create-task',
    UPDATE_TASK: 'team:update-task',
    DELETE_TASK: 'team:delete-task',
    GET_REPORTS: 'team:get-reports',
    SUBMIT_REPORT: 'team:submit-report',
  },

  // Documents
  DOCUMENTS: {
    LIST: 'documents:list',
    GET: 'documents:get',
    CREATE: 'documents:create',
    UPDATE: 'documents:update',
    DELETE: 'documents:delete',
    UPLOAD: 'documents:upload',
    DOWNLOAD: 'documents:download',
    SUMMARIZE: 'documents:summarize',
    SEARCH: 'documents:search',
  },

  // Meetings
  MEETINGS: {
    LIST: 'meetings:list',
    GET: 'meetings:get',
    CREATE: 'meetings:create',
    UPDATE: 'meetings:update',
    DELETE: 'meetings:delete',
    GENERATE_NOTES: 'meetings:generate-notes',
    GET_SUGGESTIONS: 'meetings:get-suggestions',
    INVITE: 'meetings:invite',
  },

  // Voice
  VOICE: {
    START_RECOGNITION: 'voice:start',
    STOP_RECOGNITION: 'voice:stop',
    TRANSCRIPTION: 'voice:transcription',
    GET_STATUS: 'voice:get-status',
  },

  // Integrations
  INTEGRATIONS: {
    CONNECT: 'integrations:connect',
    DISCONNECT: 'integrations:disconnect',
    SYNC: 'integrations:sync',
    GET_STATUS: 'integrations:get-status',
    GET_ALL: 'integrations:get-all',

    // Email specific
    EMAIL_FETCH: 'integrations:email:fetch',
    EMAIL_SEND: 'integrations:email:send',
    EMAIL_REPLY: 'integrations:email:reply',

    // Slack specific
    SLACK_SEND: 'integrations:slack:send',
    SLACK_FETCH: 'integrations:slack:fetch',
    SLACK_CHANNELS: 'integrations:slack:channels',

    // Discord specific
    DISCORD_SEND: 'integrations:discord:send',
    DISCORD_FETCH: 'integrations:discord:fetch',
    DISCORD_SERVERS: 'integrations:discord:servers',
  },

  // Settings
  SETTINGS: {
    GET: 'settings:get',
    UPDATE: 'settings:update',
    GET_THEME: 'settings:get-theme',
    SET_THEME: 'settings:set-theme',
    EXPORT: 'settings:export',
    IMPORT: 'settings:import',
  },

  // Analytics
  ANALYTICS: {
    GET_DASHBOARD: 'analytics:get-dashboard',
    GET_TEAM_METRICS: 'analytics:get-team-metrics',
    GET_TASK_METRICS: 'analytics:get-task-metrics',
    GET_PERFORMANCE: 'analytics:get-performance',
    TRACK_EVENT: 'analytics:track-event',
  },

  // Notifications
  NOTIFICATIONS: {
    GET_ALL: 'notifications:get-all',
    MARK_READ: 'notifications:mark-read',
    MARK_ALL_READ: 'notifications:mark-all-read',
    DELETE: 'notifications:delete',
  },

  // System
  SYSTEM: {
    GET_STATUS: 'system:get-status',
    CHECK_UPDATES: 'system:check-updates',
    GET_OFFLINE_STATUS: 'system:offline-status',
    MINIMIZE: 'system:minimize',
    MAXIMIZE: 'system:maximize',
    CLOSE: 'system:close',
  },
} as const;

// WebSocket Events for real-time updates
export const WS_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',

  // Chat events
  CHAT: {
    NEW_MESSAGE: 'chat:new-message',
    MESSAGE_UPDATED: 'chat:message-updated',
    MESSAGE_DELETED: 'chat:message-deleted',
    USER_TYPING: 'chat:user-typing',
    USER_PRESENCE: 'chat:user-presence',
  },

  // Agent events
  AGENT: {
    RESPONSE_START: 'agent:response-start',
    RESPONSE_CHUNK: 'agent:response-chunk',
    RESPONSE_END: 'agent:response-end',
    SUGGESTION: 'agent:suggestion',
    ACTION_REQUIRED: 'agent:action-required',
  },

  // Team events
  TEAM: {
    TASK_CREATED: 'team:task-created',
    TASK_UPDATED: 'team:task-updated',
    TASK_DELETED: 'team:task-deleted',
    REPORT_SUBMITTED: 'team:report-submitted',
    MEMBER_JOINED: 'team:member-joined',
    MEMBER_LEFT: 'team:member-left',
  },

  // Notification events
  NOTIFICATION: {
    NEW: 'notification:new',
    READ: 'notification:read',
  },

  // Integration events
  INTEGRATION: {
    EMAIL_RECEIVED: 'integration:email-received',
    SLACK_MESSAGE: 'integration:slack-message',
    DISCORD_MESSAGE: 'integration:discord-message',
    SYNC_COMPLETE: 'integration:sync-complete',
    SYNC_ERROR: 'integration:sync-error',
  },

  // Meeting events
  MEETING: {
    REMINDER: 'meeting:reminder',
    STARTING_SOON: 'meeting:starting-soon',
    NOTES_READY: 'meeting:notes-ready',
    UPDATED: 'meeting:updated',
  },
} as const;
