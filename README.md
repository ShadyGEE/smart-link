# SmartLink - AI-Powered Management Agent Desktop Application

## Overview

SmartLink is a desktop application built with Electron + React that serves as an "Agent of all Agents" to help managers with their work. It features AI-powered assistance, team communication, document management, and productivity tools.

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Desktop Framework | Electron 33+ | Cross-platform desktop app |
| Frontend | React 18 + TypeScript | UI components |
| Build Tool | Vite 6 | Fast development/build |
| State Management | Zustand | Lightweight state |
| Styling | Tailwind CSS | Utility-first CSS |
| Database | PostgreSQL + Prisma | Primary data store |
| AI Gateway | OpenRouter API | Multi-LLM access |
| Voice (Offline) | Whisper (@xenova/transformers) | Speech-to-text |
| Real-time | Socket.IO | WebSocket communication |
| Email | Nodemailer + ImapFlow | Email integration |
| Slack | @slack/web-api | Slack integration |
| Discord | discord.js | Discord integration |
| Auth | JWT (jose) + Argon2 | Authentication |

## Project Structure

```
D:\smart-link\
├── package.json                 # Dependencies and npm scripts
├── tsconfig.json                # Base TypeScript config
├── tsconfig.main.json           # Electron main process TS config
├── tsconfig.renderer.json       # React renderer TS config
├── vite.config.ts               # Vite bundler configuration
├── tailwind.config.js           # Tailwind CSS with custom theme
├── postcss.config.js            # PostCSS for Tailwind
├── docker-compose.yml           # Docker: PostgreSQL + pgAdmin + Redis
├── Dockerfile                   # Multi-stage build for CI/packaging
├── start.bat                    # Windows quick start (checks Docker, starts containers, installs deps)
├── start.sh                     # Linux/Mac quick start (same as above)
├── .env.example                 # Environment variables template
├── .env                         # Local environment config
│
├── prisma/
│   └── schema.prisma            # Database schema (25+ models)
│
├── scripts/
│   └── init-db.sql              # Database initialization SQL
│
└── src/
    ├── main/                    # ELECTRON MAIN PROCESS
    │   ├── index.ts             # App entry, creates window, registers IPC
    │   ├── app/
    │   │   ├── WindowManager.ts # Creates BrowserWindow, handles lifecycle
    │   │   └── TrayManager.ts   # System tray with context menu
    │   ├── ipc/
    │   │   └── index.ts         # IPC handlers for all channels (auth, agent, chat, etc.)
    │   └── services/
    │       └── ai/
    │           └── OpenRouterClient.ts  # OpenRouter API client with streaming
    │
    ├── preload/
    │   └── index.ts             # Context bridge exposing safe API to renderer
    │                            # Exposes: api.auth, api.agent, api.chat, api.team,
    │                            # api.documents, api.meetings, api.voice, api.integrations,
    │                            # api.settings, api.analytics, api.notifications, api.system
    │
    ├── renderer/                # REACT FRONTEND
    │   ├── index.html           # HTML entry with CSP headers
    │   ├── index.tsx            # React entry, mounts App with BrowserRouter
    │   ├── App.tsx              # Root component with routes and theme
    │   │
    │   ├── components/
    │   │   └── common/
    │   │       ├── Layout.tsx       # Main layout with Sidebar + Header + content
    │   │       ├── Sidebar.tsx      # Navigation sidebar with user info
    │   │       ├── Header.tsx       # Top bar with search, notifications, window controls
    │   │       └── ThemeToggle.tsx  # Light/Dark/System theme switcher
    │   │
    │   ├── pages/
    │   │   ├── LoginPage.tsx        # Auth page with login/register forms
    │   │   ├── DashboardPage.tsx    # Overview with stats, suggestions, quick actions
    │   │   ├── AgentPage.tsx        # AI chat interface with voice input
    │   │   ├── ChatPage.tsx         # Team messaging with channels
    │   │   ├── TeamPage.tsx         # Task management (Kanban/List views)
    │   │   ├── DocumentsPage.tsx    # File management with AI summarization
    │   │   ├── MeetingsPage.tsx     # Calendar and meeting scheduler
    │   │   ├── AnalyticsPage.tsx    # Performance metrics and charts
    │   │   └── SettingsPage.tsx     # Profile, Agent, Integrations, Notifications, Security
    │   │
    │   ├── store/                   # ZUSTAND STATE MANAGEMENT
    │   │   ├── authStore.ts         # User auth state, login/logout, session
    │   │   ├── themeStore.ts        # Theme preference (light/dark/system)
    │   │   └── agentStore.ts        # AI chat messages, suggestions, context
    │   │
    │   └── styles/
    │       └── globals.css          # Tailwind imports + custom components
    │                                # Defines: .card, .btn-*, .input, .badge-*, .nav-item, etc.
    │
    ├── shared/                  # SHARED BETWEEN MAIN & RENDERER
    │   ├── constants/
    │   │   └── channels.ts      # IPC_CHANNELS and WS_EVENTS constants
    │   └── types/
    │       ├── agent.types.ts   # Agent, OpenRouter, conversation types
    │       └── api.types.ts     # API responses, user, team, task, meeting types
    │
    └── types/
        └── global.d.ts          # Global Window.api type declaration
```

## Core Features

### 1. Main Agent ("Agent of all Agents")
- Central AI assistant that understands user's job role
- Routes requests to specialized sub-agents
- Provides actionable recommendations
- Reviews team reports and task outputs

### 2. Research Sub-Agent
- Web search for best practices
- Find common mistakes to avoid
- Evidence-based recommendations

### 3. Team Communication
- Built-in chat system with channels
- Email integration (IMAP/SMTP)
- Slack integration
- Discord integration

### 4. Document Management
- Upload and organize files
- AI-powered summarization
- Knowledge base for reference materials

### 5. Meeting Scheduler
- Calendar view (month/week/day)
- AI-suggested optimal meeting times
- Auto-generated meeting notes

### 6. Analytics Dashboard
- Task completion metrics
- Team performance tracking
- Risk assessment with AI

### 7. Voice Commands
- English voice input
- Whisper for offline speech-to-text
- Command parsing

## Database Schema (Prisma)

Key models in `prisma/schema.prisma`:

- **User** - Users with roles (ADMIN, MANAGER, MEMBER, GUEST)
- **Session** - JWT sessions with refresh tokens
- **Team** - Teams with owner and members
- **TeamMember** - User-Team relationship with roles
- **Channel** - Chat channels (PUBLIC, PRIVATE, DIRECT, AGENT)
- **Message** - Chat messages with threading
- **Task** - Tasks with status, priority, assignments, subtasks
- **Report** - Team reports with AI summaries
- **Document** - Files with metadata, tags, AI summaries
- **Folder** - Hierarchical folder structure
- **Meeting** - Meetings with attendees, agenda, notes
- **MeetingAttendee** - User-Meeting relationship
- **AgentContext** - User context for AI personalization
- **AgentConversation** - AI conversation history
- **Integration** - Email, Slack, Discord configs
- **EmailMessage** - Cached email messages
- **Notification** - User notifications
- **AnalyticsEvent** - Event tracking
- **SyncQueue** - Offline sync queue

## IPC Communication

The app uses Electron IPC for main-renderer communication.

### Channel Categories (from `src/shared/constants/channels.ts`):
- `IPC_CHANNELS.AUTH.*` - Login, logout, session management
- `IPC_CHANNELS.AGENT.*` - AI chat, suggestions, context
- `IPC_CHANNELS.CHAT.*` - Messages, channels
- `IPC_CHANNELS.TEAM.*` - Teams, members, tasks, reports
- `IPC_CHANNELS.DOCUMENTS.*` - Files, summarization, search
- `IPC_CHANNELS.MEETINGS.*` - Schedule, notes, invites
- `IPC_CHANNELS.VOICE.*` - Speech recognition
- `IPC_CHANNELS.INTEGRATIONS.*` - Email, Slack, Discord
- `IPC_CHANNELS.SETTINGS.*` - User preferences, theme
- `IPC_CHANNELS.ANALYTICS.*` - Metrics, dashboards
- `IPC_CHANNELS.NOTIFICATIONS.*` - Alerts
- `IPC_CHANNELS.SYSTEM.*` - Window controls, status

### Preload API (from `src/preload/index.ts`):
```typescript
window.api.auth.login(email, password)
window.api.agent.sendMessage(message, context)
window.api.chat.getChannels()
window.api.team.getTasks(teamId)
window.api.documents.summarize(documentId)
window.api.meetings.create(meeting)
window.api.voice.startRecognition()
window.api.settings.setTheme('dark')
window.api.system.minimize()
// ... and more
```

## OpenRouter Integration

The `OpenRouterClient` class (`src/main/services/ai/OpenRouterClient.ts`) handles AI:

```typescript
// Available models
OpenRouterClient.MODELS = {
  FAST: 'openai/gpt-4o-mini',
  BALANCED: 'openai/gpt-4o',
  POWERFUL: 'anthropic/claude-3.5-sonnet',
  CODE: 'anthropic/claude-3.5-sonnet',
  CHEAP: 'meta-llama/llama-3.1-70b-instruct',
}

// Usage
const client = new OpenRouterClient(apiKey);
const response = await client.chat({ model, messages });
// Or streaming:
for await (const chunk of client.chatStream({ model, messages, stream: true })) {
  // Handle chunk
}
```

## UI Components

### Custom CSS Classes (from `globals.css`):
- `.card` - White/dark card with border and shadow
- `.btn-primary` - Blue primary button
- `.btn-secondary` - Gray secondary button
- `.btn-ghost` - Transparent button
- `.btn-danger` - Red danger button
- `.input` - Styled text input
- `.label` - Form label
- `.badge-*` - Status badges (primary, success, warning, error)
- `.nav-item` - Sidebar navigation item
- `.nav-item-active` - Active nav state
- `.message-bubble-user` - User chat bubble (blue, right)
- `.message-bubble-assistant` - AI chat bubble (gray, left)
- `.app-drag` - Electron window drag region
- `.app-no-drag` - Non-draggable area within drag region

### Theme System:
- Supports Light, Dark, and System themes
- Uses Tailwind's `dark:` variant
- Theme stored in Zustand with localStorage persistence
- Applied via `document.documentElement.classList.add('dark')`

## Environment Variables

The `.env` file is pre-configured for local Docker development:

```env
# Database (matches docker-compose.yml)
DATABASE_URL="postgresql://smartlink:smartlink_secure_password_2024@localhost:5432/smartlink?schema=public"

# OpenRouter API (required for AI features)
# Get your API key from https://openrouter.ai/keys
OPENROUTER_API_KEY=""

# Redis (matches docker-compose.yml)
REDIS_URL="redis://localhost:6379"

# Email Integration (IMAP/SMTP)
EMAIL_IMAP_HOST="imap.gmail.com"
EMAIL_IMAP_PORT="993"
EMAIL_SMTP_HOST="smtp.gmail.com"
EMAIL_SMTP_PORT="587"
EMAIL_USER=""
EMAIL_PASSWORD=""

# Slack Integration
SLACK_BOT_TOKEN=""
SLACK_APP_TOKEN=""

# Discord Integration
DISCORD_BOT_TOKEN=""

# Security (change in production!)
JWT_SECRET="smartlink-jwt-secret-change-in-production-2024"
ENCRYPTION_KEY="smartlink-32char-encrypt-key!!"

# App Settings
NODE_ENV="development"
```

**Note:** The DATABASE_URL and REDIS_URL are pre-configured to work with the Docker containers out of the box.

## NPM Scripts

```bash
npm run dev          # Start Vite + Electron in development
npm run build        # Build for production
npm run package      # Package as distributable
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
npm run lint         # Run ESLint
npm run test         # Run Vitest
```

## Docker Setup

The project includes a complete Docker setup with PostgreSQL, pgAdmin, and Redis.

### Docker Services (docker-compose.yml)

| Service | Container Name | Port | Purpose |
|---------|---------------|------|---------|
| PostgreSQL 16 | smartlink-db | 5432 | Primary database |
| pgAdmin 4 | smartlink-pgadmin | 5050 | Database GUI |
| Redis 7 | smartlink-redis | 6379 | Caching & real-time |

### Database Credentials

```
PostgreSQL:
  Host: localhost:5432
  User: smartlink
  Password: smartlink_secure_password_2024
  Database: smartlink

pgAdmin:
  URL: http://localhost:5050
  Email: admin@smartlink.local
  Password: admin123
```

### Dockerfile

The Dockerfile uses multi-stage build:
1. **Builder stage** - Installs deps, generates Prisma, builds app
2. **Production stage** - Minimal image for packaging

Note: Electron apps run natively, not in Docker. The Dockerfile is for building/CI.

---

## Running the Application

### Quick Start (Recommended)

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

The start script automatically:
1. Checks if Docker is running
2. Starts PostgreSQL, pgAdmin, Redis containers
3. Waits for PostgreSQL to be ready
4. Installs npm dependencies (if needed)
5. Generates Prisma client
6. Pushes database schema
7. Shows connection info

Then run:
```bash
npm run dev
```

### Manual Setup

1. **Start Docker containers:**
   ```bash
   docker-compose up -d
   ```

2. **Wait for PostgreSQL to be healthy:**
   ```bash
   docker-compose ps  # Check status
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration (or use defaults for local dev)
   ```

5. **Initialize database:**
   ```bash
   npm run db:generate   # Generate Prisma client
   npm run db:push       # Push schema to database
   ```

6. **Run in development:**
   ```bash
   npm run dev
   ```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f postgres

# Reset database (delete all data)
docker-compose down -v
docker-compose up -d

# Check service health
docker-compose ps
```

### Access Points After Setup

| Service | URL/Port |
|---------|----------|
| SmartLink App | Electron window (npm run dev) |
| PostgreSQL | localhost:5432 |
| pgAdmin | http://localhost:5050 |
| Redis | localhost:6379 |

## Architecture Decisions

1. **Electron with Context Isolation** - Secure IPC via preload script
2. **Vite for Renderer** - Fast HMR and build
3. **Zustand over Redux** - Simpler state management
4. **Prisma ORM** - Type-safe database access
5. **OpenRouter** - Access to multiple LLMs with single API
6. **Custom Titlebar** - Frameless window with custom controls
7. **Tailwind CSS** - Rapid UI development with dark mode

## Future Implementation Notes

### Pending Features to Implement:
1. **Agent Services** - Implement actual agent logic in `src/main/services/agents/`
   - `AgentOrchestrator.ts` - Route requests to sub-agents
   - `MainAgent.ts` - Primary assistant
   - `ResearchAgent.ts` - Web search capabilities
   - `DocumentAgent.ts` - Summarization
   - `RiskAgent.ts` - Risk assessment
   - `MeetingAgent.ts` - Scheduling optimization

2. **Voice Recognition** - Implement Whisper integration in `src/main/services/voice/`

3. **Communication Services** - Implement in `src/main/services/communication/`
   - `EmailService.ts` - IMAP/SMTP
   - `SlackService.ts` - Slack API
   - `DiscordService.ts` - Discord.js
   - `ChatService.ts` - Real-time chat

4. **WebSocket Server** - Real-time updates via Socket.IO

5. **Offline Support** - SQLite cache and sync queue

## File Size Reference

Key files by size (for context on complexity):
- `prisma/schema.prisma` - 11KB (complete database schema)
- `src/preload/index.ts` - 11KB (full IPC API bridge)
- `src/renderer/pages/SettingsPage.tsx` - 15KB (most complex page)
- `src/renderer/pages/AgentPage.tsx` - 11KB (AI chat interface)
- `src/renderer/pages/DashboardPage.tsx` - 11KB (overview page)
- `src/renderer/components/common/Sidebar.tsx` - 7KB (navigation)
- `src/shared/types/api.types.ts` - 6KB (API type definitions)
- `src/renderer/styles/globals.css` - 6KB (all custom styles)
- `src/shared/constants/channels.ts` - 5KB (IPC channels)

## Contact & License

This is a private project created for management assistance.
