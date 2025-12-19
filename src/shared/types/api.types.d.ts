export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
    metadata?: ResponseMetadata;
}
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    stack?: string;
}
export interface ResponseMetadata {
    timestamp: number;
    requestId: string;
    duration?: number;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: PaginationInfo;
}
export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
}
export interface StreamResponse {
    type: 'start' | 'chunk' | 'end' | 'error';
    data?: string;
    metadata?: Record<string, unknown>;
}
export interface PaginatedRequest {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface SearchRequest extends PaginatedRequest {
    query: string;
    filters?: Record<string, unknown>;
}
export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    jobTitle?: string;
    department?: string;
    role: 'ADMIN' | 'MANAGER' | 'MEMBER' | 'GUEST';
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    preferences?: Record<string, unknown>;
    createdAt: Date;
}
export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}
export interface LoginResponse {
    user: UserProfile;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}
export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    jobTitle?: string;
    department?: string;
}
export interface TeamInfo {
    id: string;
    name: string;
    description?: string;
    ownerId: string;
    memberCount: number;
    createdAt: Date;
}
export interface TeamMemberInfo {
    id: string;
    userId: string;
    teamId: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
    user: UserProfile;
    joinedAt: Date;
}
export interface TaskInfo {
    id: string;
    title: string;
    description?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'BLOCKED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate?: Date;
    teamId: string;
    assignee?: UserProfile;
    creator: UserProfile;
    subtasks?: TaskInfo[];
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateTaskRequest {
    title: string;
    description?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate?: Date;
    teamId: string;
    assigneeId?: string;
    parentId?: string;
}
export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'BLOCKED';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    dueDate?: Date;
    assigneeId?: string;
}
export interface MessageInfo {
    id: string;
    content: string;
    type: 'TEXT' | 'FILE' | 'IMAGE' | 'SYSTEM' | 'AGENT_RESPONSE';
    channelId: string;
    sender: UserProfile;
    replyTo?: MessageInfo;
    metadata?: Record<string, unknown>;
    isEdited: boolean;
    createdAt: Date;
}
export interface ChannelInfo {
    id: string;
    name: string;
    description?: string;
    type: 'PUBLIC' | 'PRIVATE' | 'DIRECT' | 'AGENT';
    teamId?: string;
    lastMessage?: MessageInfo;
    unreadCount: number;
    createdAt: Date;
}
export interface DocumentInfo {
    id: string;
    title: string;
    content?: string;
    filePath?: string;
    type: 'TEXT' | 'PDF' | 'IMAGE' | 'SPREADSHEET' | 'PRESENTATION' | 'REFERENCE_BOOK' | 'OTHER';
    mimeType?: string;
    size?: number;
    owner: UserProfile;
    teamId?: string;
    summary?: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
export interface MeetingInfo {
    id: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    location?: string;
    meetingLink?: string;
    teamId: string;
    notes?: string;
    agenda?: MeetingAgendaItem[];
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    attendees: MeetingAttendeeInfo[];
    createdAt: Date;
}
export interface MeetingAgendaItem {
    id: string;
    title: string;
    duration: number;
    presenter?: string;
    notes?: string;
}
export interface MeetingAttendeeInfo {
    userId: string;
    user: UserProfile;
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'TENTATIVE';
    isOrganizer: boolean;
}
export interface CreateMeetingRequest {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    location?: string;
    meetingLink?: string;
    teamId: string;
    attendeeIds: string[];
    agenda?: Omit<MeetingAgendaItem, 'id'>[];
}
export interface ReportInfo {
    id: string;
    title: string;
    content: string;
    type: 'DAILY' | 'WEEKLY' | 'TASK_COMPLETION' | 'PROGRESS' | 'ISSUE';
    teamId: string;
    taskId?: string;
    submitter: UserProfile;
    summary?: string;
    createdAt: Date;
}
export interface NotificationInfo {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, unknown>;
    isRead: boolean;
    createdAt: Date;
}
export type NotificationType = 'TASK_ASSIGNED' | 'TASK_UPDATED' | 'MESSAGE_RECEIVED' | 'MEETING_REMINDER' | 'REPORT_SUBMITTED' | 'AGENT_SUGGESTION' | 'RISK_ALERT';
export interface DashboardMetrics {
    tasksCompleted: number;
    tasksInProgress: number;
    tasksPending: number;
    tasksBlocked: number;
    upcomingMeetings: number;
    unreadMessages: number;
    pendingReports: number;
    teamPerformance: TeamPerformanceMetric[];
}
export interface TeamPerformanceMetric {
    teamId: string;
    teamName: string;
    completionRate: number;
    avgTaskDuration: number;
    activeMembers: number;
}
export interface TaskMetrics {
    byStatus: {
        status: string;
        count: number;
    }[];
    byPriority: {
        priority: string;
        count: number;
    }[];
    completionTrend: {
        date: string;
        completed: number;
    }[];
    overdueCount: number;
}
export interface IntegrationInfo {
    id: string;
    type: 'EMAIL' | 'SLACK' | 'DISCORD' | 'GOOGLE_CALENDAR' | 'MICROSOFT_CALENDAR';
    status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
    lastSyncAt?: Date;
    errorMessage?: string;
}
export interface IntegrationConfig {
    type: IntegrationInfo['type'];
    credentials: Record<string, string>;
    settings?: Record<string, unknown>;
}
//# sourceMappingURL=api.types.d.ts.map