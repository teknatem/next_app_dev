# System Patterns

## 🏛️ Architecture Overview

### Feature-Sliced Design (FSD)

**Primary architectural pattern** ensuring scalability for dozens of widgets and features:

```
widgets/                    # Feature layer - business features
├── file-to-base-import/   # Data import widget
├── dashboard-analytics/   # Analytics widgets (planned)
├── report-builder/        # Report generation (planned)
└── llm-assistant/        # AI chat interface (planned)

shared/                    # Shared layer - reusable code
├── ui/                   # Common UI components
├── lib/                  # Utilities and helpers
├── api/                  # API integrations
└── config/              # Configuration

app/                      # App layer - Next.js routing
├── (bi)/                # BI layout group
├── api/                 # API routes
└── globals.css         # Global styles
```

### Widget Pattern (FSD Slice)

Each widget follows consistent internal structure:

```
widget-name/
├── ui/                  # React components
│   ├── component.tsx
│   └── index.ts        # UI exports
├── lib/                # Business logic
│   ├── utils.ts
│   ├── validators.ts
│   └── index.ts       # Logic exports
├── api/                # Data access layer
│   ├── service.ts
│   └── index.ts       # API exports
├── types/              # Type definitions
│   └── index.ts
└── index.ts           # Public widget API
```

---

## 🤖 LLM Integration Patterns

### Data Processing Pipeline

```typescript
// Pattern: LLM-Enhanced Data Processing
const processData = async (rawData: unknown[]) => {
  const mappedData = await llmMapping(rawData); // Column detection
  const cleanedData = await llmCleaning(mappedData); // Data validation
  const enrichedData = await llmEnrichment(cleanedData); // Smart defaults
  return transformToSchema(enrichedData);
};
```

### Smart Widget Generation

```typescript
// Pattern: AI-Assisted Widget Configuration
const generateWidget = async (dataType: string, userIntent: string) => {
  const widgetConfig = await llm.generateWidgetConfig(dataType, userIntent);
  return createWidget(widgetConfig);
};
```

### Natural Language Query Interface

```typescript
// Pattern: NL to SQL/API Translation
const queryData = async (naturalLanguageQuery: string) => {
  const sqlQuery = await llm.translateToSQL(naturalLanguageQuery);
  return database.execute(sqlQuery);
};
```

---

## 🗃️ Database Design Patterns

### Extensible Schema Pattern

```sql
-- Core entity tables
CREATE TABLE entities (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,     -- products, customers, orders, etc.
  data JSONB NOT NULL,           -- Flexible schema for diverse data
  metadata JSONB,                -- LLM-generated insights
  created_at TIMESTAMP DEFAULT NOW()
);

-- Entity relationships
CREATE TABLE entity_relationships (
  id SERIAL PRIMARY KEY,
  from_entity_id INTEGER REFERENCES entities(id),
  to_entity_id INTEGER REFERENCES entities(id),
  relationship_type VARCHAR(50),
  metadata JSONB
);
```

### Audit & LLM Tracking

```sql
-- Track LLM processing and decisions
CREATE TABLE llm_processing_log (
  id SERIAL PRIMARY KEY,
  entity_id INTEGER REFERENCES entities(id),
  operation_type VARCHAR(50),    -- mapping, cleaning, analysis
  llm_model VARCHAR(50),
  input_data JSONB,
  output_data JSONB,
  confidence_score DECIMAL(3,2),
  processing_time INTEGER,       -- milliseconds
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔄 API Design Patterns

### Standardized API Response

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    llmProcessed?: boolean;
    processingTime?: number;
    confidence?: number;
  };
}
```

### LLM-Enhanced Error Handling

```typescript
const handleError = async (error: Error, context: string) => {
  const suggestion = await llm.generateErrorSolution(error, context);
  return {
    error: error.message,
    suggestion,
    context
  };
};
```

---

## 📊 Performance Patterns

### Intelligent Caching

- **LLM Response Caching** - Cache similar queries to reduce API calls
- **Data Transformation Caching** - Reuse processed data patterns
- **Widget State Management** - Efficient re-rendering strategies

### Batch Processing

- **Data Import Batching** - Process large files in chunks
- **LLM Request Batching** - Combine multiple requests efficiently
- **Database Write Batching** - Optimize database operations

### Progressive Enhancement

- **Core Functionality First** - Basic features work without LLM
- **AI Enhancement Layer** - LLM features enhance but don't block
- **Graceful Degradation** - Fallbacks when AI services unavailable

---

## 📝 Code Quality Principles

### Readability Over Brevity

**Core Philosophy:** Меньше кода - лучше, но НЕ в ущерб простоте понимания.

### Complex Logic Decomposition

```typescript
// ❌ Плохо - сложное логическое выражение в одну строку
if (
  (user.status === 'active' && user.role === 'admin') ||
  (user.status === 'pending' && user.permissions.includes('read')) ||
  (user.isTemporary && Date.now() - user.createdAt < 86400000)
) {
  // logic
}

// ✅ Хорошо - разложение через промежуточные переменные
const isActiveAdmin = user.status === 'active' && user.role === 'admin';
const isPendingWithReadAccess =
  user.status === 'pending' && user.permissions.includes('read');
const isRecentTemporaryUser =
  user.isTemporary && Date.now() - user.createdAt < 86400000;
const hasAccess =
  isActiveAdmin || isPendingWithReadAccess || isRecentTemporaryUser;

if (hasAccess) {
  // logic
}
```

[... и остальные примеры как в созданной памяти]

## 🔧 Automated Procedures

- **update_jsdoc** – see [action_update_jsdoc.md](action_update_jsdoc.md) for the full workflow.
