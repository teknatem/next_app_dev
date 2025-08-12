---
type: "manual"
---

# Tech Context

## 🛠️ Technology Stack

### Frontend Framework

- **Next.js 15** (App Router) - Server-side rendering and modern React patterns
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS + Shadcn UI** - Modern, consistent styling and components
- **next-themes** - For theme management (light/dark mode).
- **Vercel Analytics** - Performance monitoring and user analytics

### Database & ORM

- **PostgreSQL** - Primary database for structured data storage
- **Drizzle ORM** - Type-safe database operations and schema management
- **Database Extensions** - Support for vector data (future LLM embeddings)

### Object Storage

- **Yandex Cloud S3** - AWS S3-compatible object storage
- **Presigned URLs** - Secure file upload/download
- **File Management** - Metadata tracking and lifecycle management

### LLM & AI Integration

- **OpenAI API** - GPT models for data processing and analysis
- **LangChain** (planned) - LLM workflow orchestration
- **Vector Databases** (future) - Semantic search capabilities
- **Custom AI Pipelines** - Data transformation and insight generation

### Development Environment

- **Local Development** - Direct Node.js setup (no Docker)
- **pnpm** - Fast, efficient package management
- **TypeScript Config** - Strict type checking with path mapping
- **Environment Variables** - Secure configuration management

---

## 🏗️ Architecture Patterns

### Feature-Sliced Design (FSD) with Server/Client Separation

```
domains/
├── catalog-files-d002/      # File management domain
│   ├── model/               # ✅ SHARED - Zod schemas, TypeScript types
│   ├── data/                # ⚠️ SERVER-ONLY - Database repositories
│   ├── api/                 # ✅ CLIENT-ONLY - HTTP API calls
│   ├── lib/                 # 🔄 MIXED - Utilities and services
│   ├── ui/                  # ✅ CLIENT-ONLY - React components
│   ├── index.ts             # ✅ CLIENT-SAFE - Public API
│   ├── index.server.ts      # ⚠️ SERVER-ONLY - Server API
│   └── README.md            # Documentation
├── catalog-llm-bot-d001/    # LLM chat domain (planned)
└── production-items/        # Production items domain (planned)

widgets/
├── file-to-base-import/     # File import widget
├── llm-chat/               # AI assistant
└── production-items-table/ # Data tables
```

### Data Flow Architecture

- **API Routes** (`/app/api/`) - Server-side data processing
- **Server Components** - Optimized data fetching
- **Client Components** - Interactive widgets and forms
- **Shared Libraries** (`/shared/`) - Common utilities and configurations

### Server/Client Separation

- **Explicit Boundaries** - `.server.ts` and `.client.ts` suffixes
- **Runtime Directives** - `'server-only'` and `'use client'`
- **Double Export System** - `index.ts` (client) + `index.server.ts` (server)
- **Type Safety** - Prevents server code in client bundles

### LLM Integration Points

- **Data Import** - Intelligent column mapping and validation
- **Processing Pipeline** - Automated data cleaning and transformation
- **Analytics Engine** - Pattern recognition and insight generation
- **User Interface** - Dynamic content and recommendations

---

## 📋 Development Setup

### Prerequisites

- **Node.js 18+** - Runtime environment
- **PostgreSQL 14+** - Database server
- **pnpm 8+** - Package manager

### Recent Fixes

- **`next-themes` import issue (2024-07-26)**: Fixed a build error by updating the import path for `ThemeProviderProps` in `app/theme-provider.tsx` from `next-themes/dist/types` to `next-themes`. This was necessary after an update to the `next-themes` package.

### Local Environment

```bash
# Install dependencies
pnpm install

# Setup database connection
# Configure .env.local with POSTGRES_URL

# Run development server
pnpm dev
```

### Path Mapping (tsconfig.json)

```json
{
  "paths": {
    "@/shared/*": ["shared/*"],
    "@/domain/*": ["domains/*"],
    "@/widgets/*": ["widgets/*"],
    "@/features/*": ["features/*"],
    "@/entities/*": ["entities/*"]
  }
}
```

---

## 🔧 Technical Constraints & Decisions

### Performance Requirements

- **Sub-second Response** - Critical for BI dashboard usability
- **Concurrent Users** - Support 50+ simultaneous users
- **Large Data Sets** - Handle millions of records efficiently

### Scalability Considerations

- **Widget Architecture** - FSD enables independent development of dozens of widgets
- **Database Schema** - Extensible design for dozens of new tables
- **LLM Rate Limits** - Intelligent caching and batching strategies

### Code Quality Standards

- **TypeScript Strict Mode** - Maximum type safety
- **FSD Architecture** - Consistent, scalable code organization
- **Server/Client Separation** - Explicit boundaries and runtime safety
- **Double Export System** - Clear public APIs for each environment
- **File Naming Convention** - Explicit `.server.ts` and `.client.ts` suffixes
- **Performance Monitoring** - Built-in analytics and optimization
