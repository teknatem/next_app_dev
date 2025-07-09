# Tech Context

## 🛠️ Technology Stack

### Frontend Framework

- **Next.js 15** (App Router) - Server-side rendering and modern React patterns
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS + Shadcn UI** - Modern, consistent styling and components
- **Vercel Analytics** - Performance monitoring and user analytics

### Database & ORM

- **PostgreSQL** - Primary database for structured data storage
- **Drizzle ORM** - Type-safe database operations and schema management
- **Database Extensions** - Support for vector data (future LLM embeddings)

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

### Feature-Sliced Design (FSD)

```
widgets/
├── file-to-base-import/     # File import widget
│   ├── ui/                  # React components
│   ├── lib/                 # Business logic
│   ├── api/                 # Data access
│   ├── types/               # Type definitions
│   └── index.ts             # Public API
├── data-visualization/      # Charts and graphs (planned)
├── report-builder/          # Report creation (planned)
└── llm-chat/               # AI assistant (planned)
```

### Data Flow Architecture

- **API Routes** (`/app/api/`) - Server-side data processing
- **Server Components** - Optimized data fetching
- **Client Components** - Interactive widgets and forms
- **Shared Libraries** (`/lib/`) - Common utilities and configurations

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
    "@/components/*": ["components/*"],
    "@/lib/*": ["lib/*"],
    "@/widgets/*": ["widgets/*"]
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
- **Performance Monitoring** - Built-in analytics and optimization
