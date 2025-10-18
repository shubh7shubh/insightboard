# InsightBoard AI Dashboard

A smart, AI-powered dashboard that transforms meeting transcripts into actionable tasks with intelligent prioritization and progress tracking.

## 🚀 Live Deployment

- **Frontend Application**: [https://insightboard-seven.vercel.app/](https://insightboard-seven.vercel.app/)
- **Backend API**: [https://insightboard-rfxc.onrender.com](https://insightboard-rfxc.onrender.com)
- **API Health Check**: [https://insightboard-rfxc.onrender.com/health](https://insightboard-rfxc.onrender.com/health)

## Backend Deployment on Render

This backend is deployed on a serverless architecture, so it may take some time to start when inactive.

## 📊 Project Completion Status

- ✅ **Level 1 - Core Features**: Fully Implemented
- ✅ **Level 2 - Enhancements**: Fully Implemented
- 🔄 **Level 3 - Advanced Features**: Claud AWS Deployment

## 🤖 LLM API Used

**Google Gemini API** (Free Tier)

- **Model**: `gemini-2.0-flash`
- **Why Gemini**:
  - Generous free tier (15 requests/min, 1M tokens/min)
  - Fast response times
  - Excellent task extraction capabilities
  - No credit card required for development
- **Cost**: $0/month for current usage

## 🛠️ Tech & Infrastructure Stack

### Frontend

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: Shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Theme**: next-themes
- **Hosting**: Vercel

### Backend

- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL (Supabase)
- **AI Integration**: Google Generative AI SDK
- **Validation**: Zod
- **CORS**: Enabled for cross-origin requests
- **Hosting**: Render

### Database & Infrastructure

- **Database**: PostgreSQL (Supabase)
- **Connection Pooling**: PgBouncer (Supabase)
- **Migrations**: Prisma Migrate
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render

## ✨ Features Implemented

### Level 1 - Core Features ✅

#### 1. Transcript Submission

- Clean, intuitive multi-line textarea form
- Input validation with error handling
- Loading states during submission
- Character count and clear functionality
- Responsive design for all devices

#### 2. AI-Powered Action Item Generation

- Integration with Google Gemini 2.0 Flash model
- Intelligent parsing of meeting transcripts
- Automatic extraction of actionable tasks
- Structured task generation with:
  - Concise titles (max 60 characters)
  - Detailed descriptions
  - Priority levels (URGENT, HIGH, MEDIUM, LOW)
  - Contextual tags for categorization
- Robust error handling with fallback responses

#### 3. Task Interaction

- Responsive, card-based task list
- Interactive checkboxes to mark tasks complete/pending
- Delete functionality for individual tasks
- Real-time UI updates
- Color-coded priority badges
- Tag display for easy categorization
- Creation timestamps
- Smooth animations and transitions

#### 4. Progress Visualization

- Interactive pie chart showing task completion
- Real-time updates on status changes
- Percentage breakdown (Completed vs Pending)
- Custom tooltips with detailed information
- Responsive design that adapts to screen size
- Visual completion rate indicator
- Celebration badge for 100% completion

#### 5. Modern UI

- Professional, clean interface using Shadcn/ui
- Fully responsive design (mobile-first)
- Dark mode support with theme toggle
- Toast notifications for user feedback
- Loading states for all async operations
- Error boundaries and fallback UI
- Consistent design system
- Smooth animations and transitions
- Accessible components (ARIA labels, keyboard navigation)

#### 6. Deployment & Hosting

- Production-ready deployment
- Environment variable management
- Optimized builds for performance
- Health check endpoints
- CORS configuration

### Level 2 - Enhancements ✅

#### 1. Filter and Sort Functionality

- **Multi-criteria Filtering**:
  - Status filter (All, Pending, Completed)
  - Priority filter (All, Urgent, High, Medium, Low)
  - Keyword search (searches titles and descriptions)
  - Tag-based filtering
- **Flexible Sorting**:
  - Sort by creation date (newest/oldest)
  - Sort by priority level
  - Sort by completion status
  - Alphabetical sorting
- **Real-time Updates**: Instant UI refresh on filter/sort changes
- **Filter Persistence**: Maintains filter state during session

#### 2. AI-Powered Prioritization

- LLM intelligently assigns priority levels based on:
  - Urgency keywords ("ASAP", "urgent", "critical", "immediately")
  - Deadline mentions (today, tomorrow, this week)
  - Impact assessment from context
  - Action verb intensity
- **Four Priority Levels**:
  - **URGENT**: Immediate action required, blocking issues
  - **HIGH**: Important with near-term deadlines
  - **MEDIUM**: Standard priority, reasonable timeframes
  - **LOW**: Nice-to-have, no strict deadline
- Priority displayed with color-coded badges throughout UI
- Priority shown in all visualizations

#### 3. Bar Chart Visualization

- Interactive bar chart showing task distribution by priority
- Color-coded bars for visual priority distinction
- Custom tooltips with task counts and percentages
- Responsive design
- Real-time updates on task changes
- Summary statistics (total tasks, urgent tasks)
- Clean, professional styling

#### 4. Complete Database Integration

- **PostgreSQL** database via Supabase
- **Full Data Persistence**:
  - All transcripts stored
  - All tasks persisted
  - Relationships maintained
- **Prisma ORM** with type-safe queries
- **Database Schema**:
  - UUID primary keys
  - Proper foreign key relationships
  - Cascade delete support
  - Timestamps (createdAt, updatedAt)
  - Enums for status and priority
  - Array support for tags
- **Migrations**: Managed with Prisma Migrate
- **Connection Pooling**: PgBouncer for optimal performance

## 📂 Project Structure

```
insightboard/
├── client/                      # Next.js Frontend
│   ├── src/
│   │   ├── app/                # Next.js 15 App Router
│   │   │   ├── page.tsx        # Main dashboard page
│   │   │   └── layout.tsx      # Root layout with providers
│   │   ├── components/         # React components
│   │   │   ├── ui/             # Shadcn UI components
│   │   │   ├── TranscriptForm.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   ├── TaskFilters.tsx
│   │   │   ├── ProgressChart.tsx
│   │   │   ├── PriorityChart.tsx
│   │   │   └── Header.tsx
│   │   ├── lib/                # Utilities and helpers
│   │   │   ├── api.ts          # API client
│   │   │   └── utils.ts        # Utility functions
│   │   └── types/              # TypeScript type definitions
│   ├── .env.local              # Client environment variables
│   ├── tsconfig.json           # TypeScript configuration
│   └── package.json
│
├── server/                      # Express Backend
│   ├── src/
│   │   ├── index.ts            # Server entry point
│   │   ├── routes/             # API route handlers
│   │   │   ├── transcripts.ts
│   │   │   └── tasks.ts
│   │   ├── controllers/        # Request controllers
│   │   │   ├── transcriptController.ts
│   │   │   └── taskController.ts
│   │   ├── services/           # Business logic
│   │   │   └── llmService.ts   # Gemini AI integration
│   │   ├── middleware/         # Express middleware
│   │   │   └── errorHandler.ts
│   │   └── validation/         # Zod validation schemas
│   │       └── schemas.ts
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # Database migrations
│   ├── generated/              # Prisma generated client
│   ├── .env                    # Server environment variables
│   ├── tsconfig.json           # TypeScript configuration
│   └── package.json
│
├── DEPLOYMENT.md               # Deployment guide
├── TROUBLESHOOTING.md          # Common issues and solutions
└── README.md                   # This file
```

## 🚀 Local Development Setup

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm** or **pnpm**: Package manager
- **PostgreSQL Database**: Supabase account (free tier)
- **Gemini API Key**: Free from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Step 1: Clone the Repository

```bash
git clone https://github.com/shubh7shubh/insightboard.git
cd insightboard
```

### Step 2: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
# Copy the following and replace with your actual values:
```

Create `server/.env`:

```env
# Database Configuration (from Supabase)
DATABASE_URL="postgresql://user:password@host:port/database?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:port/database"

# Google Gemini API Configuration
GEMINI_API_KEY="your-gemini-api-key-here"

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Start development server
npm run dev
```

The backend will be running at `http://localhost:3001`

**Verify Backend**:

- Visit: `http://localhost:3001/health`
- Should see: `{"ok":true}`

### Step 3: Frontend Setup

```bash
# Navigate to client directory (from project root)
cd client

# Install dependencies
npm install

# Create .env.local file
# Copy the following:
```

Create `client/.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

```bash
# Start development server
npm run dev
```

The frontend will be running at `http://localhost:3000`

### Step 4: Test the Application

1. **Open browser**: Navigate to `http://localhost:3000`
2. **Test LLM Connection**: The app will show connection status
3. **Submit a sample transcript**:

```
Team Meeting -

John mentioned we need to finalize the proposal by Friday for the client presentation.
Sarah will review the budget allocation for the new feature release next week.
We should schedule a follow-up meeting for next Tuesday to discuss the design mockups.
Mike needs to urgently fix the authentication bug that's blocking the deployment.
The marketing team requested updated screenshots by end of day tomorrow.
```

4. **Verify functionality**:
   - Tasks are generated with priorities and tags
   - Charts display correctly
   - Filters and sorting work
   - Mark tasks as complete
   - Delete tasks
   - Dark mode toggle

## 🔑 Environment Variables

**IMPORTANT**: No API keys or secrets are committed to this repository. All sensitive configuration is managed through environment variables.

### Server Environment Variables

| Variable         | Description                                   | Example                                              |
| ---------------- | --------------------------------------------- | ---------------------------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string (pooled)         | `postgresql://user:pass@host:6543/db?pgbouncer=true` |
| `DIRECT_URL`     | Direct PostgreSQL connection (for migrations) | `postgresql://user:pass@host:5432/db`                |
| `GEMINI_API_KEY` | Google Gemini API key                         | `AIzaSy...`                                          |
| `PORT`           | Server port                                   | `3001`                                               |
| `NODE_ENV`       | Environment                                   | `development` or `production`                        |
| `CORS_ORIGIN`    | Allowed origins for CORS                      | `http://localhost:3000` or production URL            |

### Client Environment Variables

| Variable              | Description     | Example                                   |
| --------------------- | --------------- | ----------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` or production URL |

## 🗄️ Database Schema

### Transcript Model

```prisma
model Transcript {
  id        String   @id @default(uuid())
  content   String   @db.Text
  createdAt DateTime @default(now())
  tasks     Task[]
}
```

### Task Model

```prisma
model Task {
  id           String       @id @default(uuid())
  title        String
  description  String?
  status       TaskStatus   @default(PENDING)
  priority     TaskPriority @default(MEDIUM)
  tags         String[]     @default([])
  transcriptId String
  transcript   Transcript   @relation(...)
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}
```

### Enums

```prisma
enum TaskStatus {
  PENDING
  COMPLETED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

## 🔗 API Endpoints

### Transcripts

- `POST /api/transcripts` - Submit transcript and generate tasks
- `GET /api/transcripts` - Get all transcripts with tasks
- `GET /api/transcripts/:id` - Get specific transcript
- `DELETE /api/transcripts/:id` - Delete transcript and tasks

### Tasks

- `GET /api/tasks` - Get all tasks (supports filters and sorting)
- `GET /api/tasks/:id` - Get specific task
- `PATCH /api/tasks/:id` - Update task (status or priority)
- `DELETE /api/tasks/:id` - Delete task

### Statistics

- `GET /api/stats` - Get task completion statistics

### Health

- `GET /health` - Health check endpoint

## 🎯 Key Features & Highlights

- **Intelligent AI Integration**: Uses Google Gemini 2.0 for accurate task extraction
- **Smart Prioritization**: AI automatically assigns priorities based on urgency and context
- **Interactive Visualizations**: Beautiful pie and bar charts with Recharts
- **Advanced Filtering**: Multi-criteria filtering by status, priority, and keywords
- **Real-time Updates**: Instant UI updates on all changes
- **Dark Mode**: Full theme support with smooth transitions
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Type-Safe**: Complete TypeScript implementation
- **Database Persistence**: All data persisted in PostgreSQL
- **Modern Architecture**: Clean separation of concerns, modular design
- **Error Handling**: Comprehensive error handling and user feedback
- **Accessible**: ARIA labels, keyboard navigation, screen reader support

## 🔒 Security & Best Practices

- ✅ No API keys or secrets committed to repository
- ✅ Environment variables for all sensitive configuration
- ✅ CORS properly configured
- ✅ Input validation with Zod
- ✅ SQL injection prevention via Prisma ORM
- ✅ Error handling without exposing sensitive info
- ✅ TypeScript for type safety
- ✅ Secure database connections (SSL)

## 📝 Development Commands

### Server

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

### Client

```bash
npm run dev      # Start Next.js dev server
npm run build    # Build production bundle
npm start        # Start production server
npm run lint     # Run ESLint
```

### Database

```bash
npx prisma migrate dev    # Create and apply migration
npx prisma generate       # Generate Prisma client
npx prisma studio         # Open Prisma Studio GUI
npx prisma migrate deploy # Deploy migrations to production
```

## 🌐 GitHub Repository

[https://github.com/shubh7shubh/insightboard](https://github.com/shubh7shubh/insightboard)

## 💰 Cost Breakdown

### Current Setup

- **Vercel**
- **Render** - spins down after 15 min
- **Supabase**
- **Gemini API**

## 🚧 Future Enhancements (Level 3)

## 📄 License

This project was created as part of the InsightBoard AI Dashboard assignment.

## 👨‍💻 Developer

Built with ❤️ using Next.js, Express, Prisma, and Google Gemini AI

---

**Live Demo**: [https://insightboard-seven.vercel.app/](https://insightboard-seven.vercel.app/)

**API Health**: [https://insightboard-rfxc.onrender.com/health](https://insightboard-rfxc.onrender.com/health)
