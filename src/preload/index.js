"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const channels_1 = require("../shared/constants/channels");
// Type-safe API exposed to renderer
const api = {
    // System
    system: {
        minimize: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.SYSTEM.MINIMIZE),
        maximize: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.SYSTEM.MAXIMIZE),
        close: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.SYSTEM.CLOSE),
        getStatus: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.SYSTEM.GET_STATUS),
        getOfflineStatus: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.SYSTEM.GET_OFFLINE_STATUS),
    },
    // Auth
    auth: {
        login: (email, password) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.AUTH.LOGIN, email, password),
        logout: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.AUTH.LOGOUT),
        getSession: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.AUTH.GET_SESSION),
        refresh: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.AUTH.REFRESH),
        register: (data) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.AUTH.REGISTER, data),
    },
    // Agent
    agent: {
        sendMessage: (message, context) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.AGENT.SEND_MESSAGE, message, context),
        getSuggestions: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.AGENT.GET_SUGGESTIONS),
        getContext: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.AGENT.GET_CONTEXT),
        updateContext: (context) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.AGENT.UPDATE_CONTEXT, context),
        setJobRole: (role, department) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.AGENT.SET_JOB_ROLE, role, department),
        cancelRequest: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.AGENT.CANCEL_REQUEST),
        onStreamResponse: (callback) => {
            const handler = (_, chunk) => callback(chunk);
            electron_1.ipcRenderer.on(channels_1.IPC_CHANNELS.AGENT.STREAM_RESPONSE, handler);
            return () => electron_1.ipcRenderer.removeListener(channels_1.IPC_CHANNELS.AGENT.STREAM_RESPONSE, handler);
        },
    },
    // Chat
    chat: {
        sendMessage: (channelId, content, replyToId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.CHAT.SEND_MESSAGE, channelId, content, replyToId),
        getChannels: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.CHAT.GET_CHANNELS),
        getMessages: (channelId, options) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.CHAT.GET_MESSAGES, channelId, options),
        createChannel: (name, type, teamId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.CHAT.CREATE_CHANNEL, name, type, teamId),
        deleteChannel: (channelId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.CHAT.DELETE_CHANNEL, channelId),
        markRead: (channelId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.CHAT.MARK_READ, channelId),
        editMessage: (messageId, content) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.CHAT.EDIT_MESSAGE, messageId, content),
        deleteMessage: (messageId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.CHAT.DELETE_MESSAGE, messageId),
    },
    // Team
    team: {
        getTeams: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.TEAM.GET_TEAMS),
        createTeam: (name, description) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.TEAM.CREATE_TEAM, name, description),
        getMembers: (teamId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.TEAM.GET_MEMBERS, teamId),
        addMember: (teamId, email, role) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.TEAM.ADD_MEMBER, teamId, email, role),
        removeMember: (teamId, userId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.TEAM.REMOVE_MEMBER, teamId, userId),
        getTasks: (teamId, filters) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.TEAM.GET_TASKS, teamId, filters),
        createTask: (task) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.TEAM.CREATE_TASK, task),
        updateTask: (taskId, updates) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.TEAM.UPDATE_TASK, taskId, updates),
        deleteTask: (taskId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.TEAM.DELETE_TASK, taskId),
        getReports: (teamId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.TEAM.GET_REPORTS, teamId),
        submitReport: (report) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.TEAM.SUBMIT_REPORT, report),
    },
    // Documents
    documents: {
        list: (folderId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.DOCUMENTS.LIST, folderId),
        get: (documentId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.DOCUMENTS.GET, documentId),
        create: (document) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.DOCUMENTS.CREATE, document),
        update: (documentId, updates) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.DOCUMENTS.UPDATE, documentId, updates),
        delete: (documentId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.DOCUMENTS.DELETE, documentId),
        upload: (filePath, folderId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.DOCUMENTS.UPLOAD, filePath, folderId),
        download: (documentId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.DOCUMENTS.DOWNLOAD, documentId),
        summarize: (documentId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.DOCUMENTS.SUMMARIZE, documentId),
        search: (query, filters) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.DOCUMENTS.SEARCH, query, filters),
    },
    // Meetings
    meetings: {
        list: (filters) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.MEETINGS.LIST, filters),
        get: (meetingId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.MEETINGS.GET, meetingId),
        create: (meeting) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.MEETINGS.CREATE, meeting),
        update: (meetingId, updates) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.MEETINGS.UPDATE, meetingId, updates),
        delete: (meetingId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.MEETINGS.DELETE, meetingId),
        generateNotes: (meetingId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.MEETINGS.GENERATE_NOTES, meetingId),
        getSuggestions: (teamId, duration) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.MEETINGS.GET_SUGGESTIONS, teamId, duration),
        invite: (meetingId, userIds) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.MEETINGS.INVITE, meetingId, userIds),
    },
    // Voice
    voice: {
        startRecognition: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.VOICE.START_RECOGNITION),
        stopRecognition: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.VOICE.STOP_RECOGNITION),
        getStatus: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.VOICE.GET_STATUS),
        onTranscription: (callback) => {
            const handler = (_, text) => callback(text);
            electron_1.ipcRenderer.on(channels_1.IPC_CHANNELS.VOICE.TRANSCRIPTION, handler);
            return () => electron_1.ipcRenderer.removeListener(channels_1.IPC_CHANNELS.VOICE.TRANSCRIPTION, handler);
        },
    },
    // Integrations
    integrations: {
        getAll: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.INTEGRATIONS.GET_ALL),
        connect: (type, config) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.INTEGRATIONS.CONNECT, type, config),
        disconnect: (type) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.INTEGRATIONS.DISCONNECT, type),
        sync: (type) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.INTEGRATIONS.SYNC, type),
        getStatus: (type) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.INTEGRATIONS.GET_STATUS, type),
        // Email
        emailFetch: (options) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.INTEGRATIONS.EMAIL_FETCH, options),
        emailSend: (email) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.INTEGRATIONS.EMAIL_SEND, email),
        emailReply: (messageId, content) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.INTEGRATIONS.EMAIL_REPLY, messageId, content),
        // Slack
        slackSend: (channel, message) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.INTEGRATIONS.SLACK_SEND, channel, message),
        slackFetch: (channel, options) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.INTEGRATIONS.SLACK_FETCH, channel, options),
        slackChannels: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.INTEGRATIONS.SLACK_CHANNELS),
        // Discord
        discordSend: (channelId, message) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.INTEGRATIONS.DISCORD_SEND, channelId, message),
        discordFetch: (channelId, options) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.INTEGRATIONS.DISCORD_FETCH, channelId, options),
        discordServers: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.INTEGRATIONS.DISCORD_SERVERS),
    },
    // Settings
    settings: {
        get: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.SETTINGS.GET),
        update: (settings) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.SETTINGS.UPDATE, settings),
        getTheme: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.SETTINGS.GET_THEME),
        setTheme: (theme) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.SETTINGS.SET_THEME, theme),
        export: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.SETTINGS.EXPORT),
        import: (data) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.SETTINGS.IMPORT, data),
    },
    // Analytics
    analytics: {
        getDashboard: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.ANALYTICS.GET_DASHBOARD),
        getTeamMetrics: (teamId, period) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.ANALYTICS.GET_TEAM_METRICS, teamId, period),
        getTaskMetrics: (teamId, period) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.ANALYTICS.GET_TASK_METRICS, teamId, period),
        getPerformance: (userId, period) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.ANALYTICS.GET_PERFORMANCE, userId, period),
        trackEvent: (eventType, data) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.ANALYTICS.TRACK_EVENT, eventType, data),
    },
    // Notifications
    notifications: {
        getAll: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.NOTIFICATIONS.GET_ALL),
        markRead: (notificationId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.NOTIFICATIONS.MARK_READ, notificationId),
        markAllRead: () => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.NOTIFICATIONS.MARK_ALL_READ),
        delete: (notificationId) => electron_1.ipcRenderer.invoke(channels_1.IPC_CHANNELS.NOTIFICATIONS.DELETE, notificationId),
    },
    // Event listeners for real-time updates
    on: (channel, callback) => {
        const validChannels = [
            'quick-action',
            'navigate',
            'notification',
            'chat-message',
            'agent-response',
            'integration-update',
        ];
        if (validChannels.includes(channel)) {
            const handler = (_, ...args) => callback(...args);
            electron_1.ipcRenderer.on(channel, handler);
            return () => electron_1.ipcRenderer.removeListener(channel, handler);
        }
        return () => { };
    },
    // Remove listener
    off: (channel, callback) => {
        electron_1.ipcRenderer.removeListener(channel, callback);
    },
};
// Expose API to renderer
electron_1.contextBridge.exposeInMainWorld('api', api);
//# sourceMappingURL=index.js.map