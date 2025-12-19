declare const api: {
    system: {
        minimize: () => Promise<any>;
        maximize: () => Promise<any>;
        close: () => Promise<any>;
        getStatus: () => Promise<any>;
        getOfflineStatus: () => Promise<any>;
    };
    auth: {
        login: (email: string, password: string) => Promise<any>;
        logout: () => Promise<any>;
        getSession: () => Promise<any>;
        refresh: () => Promise<any>;
        register: (data: {
            email: string;
            password: string;
            firstName: string;
            lastName: string;
        }) => Promise<any>;
    };
    agent: {
        sendMessage: (message: string, context?: Record<string, unknown>) => Promise<any>;
        getSuggestions: () => Promise<any>;
        getContext: () => Promise<any>;
        updateContext: (context: Record<string, unknown>) => Promise<any>;
        setJobRole: (role: string, department?: string) => Promise<any>;
        cancelRequest: () => Promise<any>;
        onStreamResponse: (callback: (chunk: string) => void) => () => Electron.IpcRenderer;
    };
    chat: {
        sendMessage: (channelId: string, content: string, replyToId?: string) => Promise<any>;
        getChannels: () => Promise<any>;
        getMessages: (channelId: string, options?: {
            limit?: number;
            before?: string;
        }) => Promise<any>;
        createChannel: (name: string, type: string, teamId?: string) => Promise<any>;
        deleteChannel: (channelId: string) => Promise<any>;
        markRead: (channelId: string) => Promise<any>;
        editMessage: (messageId: string, content: string) => Promise<any>;
        deleteMessage: (messageId: string) => Promise<any>;
    };
    team: {
        getTeams: () => Promise<any>;
        createTeam: (name: string, description?: string) => Promise<any>;
        getMembers: (teamId: string) => Promise<any>;
        addMember: (teamId: string, email: string, role?: string) => Promise<any>;
        removeMember: (teamId: string, userId: string) => Promise<any>;
        getTasks: (teamId: string, filters?: Record<string, unknown>) => Promise<any>;
        createTask: (task: Record<string, unknown>) => Promise<any>;
        updateTask: (taskId: string, updates: Record<string, unknown>) => Promise<any>;
        deleteTask: (taskId: string) => Promise<any>;
        getReports: (teamId: string) => Promise<any>;
        submitReport: (report: Record<string, unknown>) => Promise<any>;
    };
    documents: {
        list: (folderId?: string) => Promise<any>;
        get: (documentId: string) => Promise<any>;
        create: (document: Record<string, unknown>) => Promise<any>;
        update: (documentId: string, updates: Record<string, unknown>) => Promise<any>;
        delete: (documentId: string) => Promise<any>;
        upload: (filePath: string, folderId?: string) => Promise<any>;
        download: (documentId: string) => Promise<any>;
        summarize: (documentId: string) => Promise<any>;
        search: (query: string, filters?: Record<string, unknown>) => Promise<any>;
    };
    meetings: {
        list: (filters?: Record<string, unknown>) => Promise<any>;
        get: (meetingId: string) => Promise<any>;
        create: (meeting: Record<string, unknown>) => Promise<any>;
        update: (meetingId: string, updates: Record<string, unknown>) => Promise<any>;
        delete: (meetingId: string) => Promise<any>;
        generateNotes: (meetingId: string) => Promise<any>;
        getSuggestions: (teamId: string, duration: number) => Promise<any>;
        invite: (meetingId: string, userIds: string[]) => Promise<any>;
    };
    voice: {
        startRecognition: () => Promise<any>;
        stopRecognition: () => Promise<any>;
        getStatus: () => Promise<any>;
        onTranscription: (callback: (text: string) => void) => () => Electron.IpcRenderer;
    };
    integrations: {
        getAll: () => Promise<any>;
        connect: (type: string, config: Record<string, unknown>) => Promise<any>;
        disconnect: (type: string) => Promise<any>;
        sync: (type: string) => Promise<any>;
        getStatus: (type: string) => Promise<any>;
        emailFetch: (options?: Record<string, unknown>) => Promise<any>;
        emailSend: (email: Record<string, unknown>) => Promise<any>;
        emailReply: (messageId: string, content: string) => Promise<any>;
        slackSend: (channel: string, message: string) => Promise<any>;
        slackFetch: (channel: string, options?: Record<string, unknown>) => Promise<any>;
        slackChannels: () => Promise<any>;
        discordSend: (channelId: string, message: string) => Promise<any>;
        discordFetch: (channelId: string, options?: Record<string, unknown>) => Promise<any>;
        discordServers: () => Promise<any>;
    };
    settings: {
        get: () => Promise<any>;
        update: (settings: Record<string, unknown>) => Promise<any>;
        getTheme: () => Promise<any>;
        setTheme: (theme: "light" | "dark" | "system") => Promise<any>;
        export: () => Promise<any>;
        import: (data: Record<string, unknown>) => Promise<any>;
    };
    analytics: {
        getDashboard: () => Promise<any>;
        getTeamMetrics: (teamId: string, period?: string) => Promise<any>;
        getTaskMetrics: (teamId?: string, period?: string) => Promise<any>;
        getPerformance: (userId?: string, period?: string) => Promise<any>;
        trackEvent: (eventType: string, data: Record<string, unknown>) => Promise<any>;
    };
    notifications: {
        getAll: () => Promise<any>;
        markRead: (notificationId: string) => Promise<any>;
        markAllRead: () => Promise<any>;
        delete: (notificationId: string) => Promise<any>;
    };
    on: (channel: string, callback: (...args: unknown[]) => void) => () => void;
    off: (channel: string, callback: (...args: unknown[]) => void) => void;
};
export type ElectronAPI = typeof api;
export {};
//# sourceMappingURL=index.d.ts.map