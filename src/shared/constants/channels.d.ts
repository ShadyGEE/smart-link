export declare const IPC_CHANNELS: {
    readonly AUTH: {
        readonly LOGIN: "auth:login";
        readonly LOGOUT: "auth:logout";
        readonly REFRESH: "auth:refresh";
        readonly GET_SESSION: "auth:get-session";
        readonly REGISTER: "auth:register";
    };
    readonly AGENT: {
        readonly SEND_MESSAGE: "agent:send-message";
        readonly GET_SUGGESTIONS: "agent:get-suggestions";
        readonly STREAM_RESPONSE: "agent:stream-response";
        readonly CANCEL_REQUEST: "agent:cancel-request";
        readonly GET_CONTEXT: "agent:get-context";
        readonly UPDATE_CONTEXT: "agent:update-context";
        readonly SET_JOB_ROLE: "agent:set-job-role";
    };
    readonly CHAT: {
        readonly SEND_MESSAGE: "chat:send-message";
        readonly GET_CHANNELS: "chat:get-channels";
        readonly GET_MESSAGES: "chat:get-messages";
        readonly CREATE_CHANNEL: "chat:create-channel";
        readonly DELETE_CHANNEL: "chat:delete-channel";
        readonly MARK_READ: "chat:mark-read";
        readonly EDIT_MESSAGE: "chat:edit-message";
        readonly DELETE_MESSAGE: "chat:delete-message";
    };
    readonly TEAM: {
        readonly GET_TEAMS: "team:get-teams";
        readonly CREATE_TEAM: "team:create-team";
        readonly GET_MEMBERS: "team:get-members";
        readonly ADD_MEMBER: "team:add-member";
        readonly REMOVE_MEMBER: "team:remove-member";
        readonly GET_TASKS: "team:get-tasks";
        readonly CREATE_TASK: "team:create-task";
        readonly UPDATE_TASK: "team:update-task";
        readonly DELETE_TASK: "team:delete-task";
        readonly GET_REPORTS: "team:get-reports";
        readonly SUBMIT_REPORT: "team:submit-report";
    };
    readonly DOCUMENTS: {
        readonly LIST: "documents:list";
        readonly GET: "documents:get";
        readonly CREATE: "documents:create";
        readonly UPDATE: "documents:update";
        readonly DELETE: "documents:delete";
        readonly UPLOAD: "documents:upload";
        readonly DOWNLOAD: "documents:download";
        readonly SUMMARIZE: "documents:summarize";
        readonly SEARCH: "documents:search";
    };
    readonly MEETINGS: {
        readonly LIST: "meetings:list";
        readonly GET: "meetings:get";
        readonly CREATE: "meetings:create";
        readonly UPDATE: "meetings:update";
        readonly DELETE: "meetings:delete";
        readonly GENERATE_NOTES: "meetings:generate-notes";
        readonly GET_SUGGESTIONS: "meetings:get-suggestions";
        readonly INVITE: "meetings:invite";
    };
    readonly VOICE: {
        readonly START_RECOGNITION: "voice:start";
        readonly STOP_RECOGNITION: "voice:stop";
        readonly TRANSCRIPTION: "voice:transcription";
        readonly GET_STATUS: "voice:get-status";
    };
    readonly INTEGRATIONS: {
        readonly CONNECT: "integrations:connect";
        readonly DISCONNECT: "integrations:disconnect";
        readonly SYNC: "integrations:sync";
        readonly GET_STATUS: "integrations:get-status";
        readonly GET_ALL: "integrations:get-all";
        readonly EMAIL_FETCH: "integrations:email:fetch";
        readonly EMAIL_SEND: "integrations:email:send";
        readonly EMAIL_REPLY: "integrations:email:reply";
        readonly SLACK_SEND: "integrations:slack:send";
        readonly SLACK_FETCH: "integrations:slack:fetch";
        readonly SLACK_CHANNELS: "integrations:slack:channels";
        readonly DISCORD_SEND: "integrations:discord:send";
        readonly DISCORD_FETCH: "integrations:discord:fetch";
        readonly DISCORD_SERVERS: "integrations:discord:servers";
    };
    readonly SETTINGS: {
        readonly GET: "settings:get";
        readonly UPDATE: "settings:update";
        readonly GET_THEME: "settings:get-theme";
        readonly SET_THEME: "settings:set-theme";
        readonly EXPORT: "settings:export";
        readonly IMPORT: "settings:import";
    };
    readonly ANALYTICS: {
        readonly GET_DASHBOARD: "analytics:get-dashboard";
        readonly GET_TEAM_METRICS: "analytics:get-team-metrics";
        readonly GET_TASK_METRICS: "analytics:get-task-metrics";
        readonly GET_PERFORMANCE: "analytics:get-performance";
        readonly TRACK_EVENT: "analytics:track-event";
    };
    readonly NOTIFICATIONS: {
        readonly GET_ALL: "notifications:get-all";
        readonly MARK_READ: "notifications:mark-read";
        readonly MARK_ALL_READ: "notifications:mark-all-read";
        readonly DELETE: "notifications:delete";
    };
    readonly SYSTEM: {
        readonly GET_STATUS: "system:get-status";
        readonly CHECK_UPDATES: "system:check-updates";
        readonly GET_OFFLINE_STATUS: "system:offline-status";
        readonly MINIMIZE: "system:minimize";
        readonly MAXIMIZE: "system:maximize";
        readonly CLOSE: "system:close";
    };
};
export declare const WS_EVENTS: {
    readonly CONNECT: "connect";
    readonly DISCONNECT: "disconnect";
    readonly RECONNECT: "reconnect";
    readonly CHAT: {
        readonly NEW_MESSAGE: "chat:new-message";
        readonly MESSAGE_UPDATED: "chat:message-updated";
        readonly MESSAGE_DELETED: "chat:message-deleted";
        readonly USER_TYPING: "chat:user-typing";
        readonly USER_PRESENCE: "chat:user-presence";
    };
    readonly AGENT: {
        readonly RESPONSE_START: "agent:response-start";
        readonly RESPONSE_CHUNK: "agent:response-chunk";
        readonly RESPONSE_END: "agent:response-end";
        readonly SUGGESTION: "agent:suggestion";
        readonly ACTION_REQUIRED: "agent:action-required";
    };
    readonly TEAM: {
        readonly TASK_CREATED: "team:task-created";
        readonly TASK_UPDATED: "team:task-updated";
        readonly TASK_DELETED: "team:task-deleted";
        readonly REPORT_SUBMITTED: "team:report-submitted";
        readonly MEMBER_JOINED: "team:member-joined";
        readonly MEMBER_LEFT: "team:member-left";
    };
    readonly NOTIFICATION: {
        readonly NEW: "notification:new";
        readonly READ: "notification:read";
    };
    readonly INTEGRATION: {
        readonly EMAIL_RECEIVED: "integration:email-received";
        readonly SLACK_MESSAGE: "integration:slack-message";
        readonly DISCORD_MESSAGE: "integration:discord-message";
        readonly SYNC_COMPLETE: "integration:sync-complete";
        readonly SYNC_ERROR: "integration:sync-error";
    };
    readonly MEETING: {
        readonly REMINDER: "meeting:reminder";
        readonly STARTING_SOON: "meeting:starting-soon";
        readonly NOTES_READY: "meeting:notes-ready";
        readonly UPDATED: "meeting:updated";
    };
};
//# sourceMappingURL=channels.d.ts.map