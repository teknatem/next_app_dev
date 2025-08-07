# Product Context

## 📊 Corporate Knowledge Base & BI System

### Purpose

Создание единой корпоративной платформы для накопления, систематизации и анализа всех данных компании с использованием передовых LLM технологий для максимальной эффективности.

### Target Users

- **Аналитики данных** - создание отчетов и дашбордов
- **Менеджеры** - просмотр KPI и принятие решений на основе данных
- **Операционные сотрудники** - загрузка и обработка данных
- **Руководство** - стратегический анализ и планирование

---

## 🎯 Core Features

### Phase 1: BI Foundation

- **Data Import System**

  - Excel/CSV file import with intelligent column mapping
  - API integrations for real-time data sync
  - Data validation and transformation pipelines
  - LLM-assisted data cleaning and standardization

- **Reporting Engine**
  - Dynamic dashboard creation
  - Customizable charts and visualizations
  - Automated report generation
  - LLM-powered insights and recommendations

### Phase 2: Advanced Analytics

- **AI-Powered Analytics**
  - Pattern recognition and anomaly detection
  - Predictive modeling with LLM assistance
  - Natural language query interface
  - Automated insight generation

### Phase 3: Knowledge Management

- **Document Processing**
  - PDF, Word, Excel document analysis
  - Semantic search across all corporate data
  - AI-powered content summarization
  - Knowledge graph construction

---

## 🏗️ System Architecture

### Frontend (Next.js 15)

- **Widget-Based Architecture** using Context-Driven Design (CDD)
- **Responsive Dashboards** with real-time data updates
- **LLM Chat Interface** for natural language queries
- **Advanced Data Visualization** components

### Backend Integration

- **PostgreSQL** with extensible schema (dozens of tables planned)
- **API Layer** for external system integrations
- **LLM Pipeline** integrated throughout data flow
- **Real-time Processing** for live data updates

### Data Flow

```
External Sources → API/File Import → LLM Processing → PostgreSQL → Widgets → Dashboards
```

---

## 🧠 LLM Integration Strategy

### Data Processing

- **Intelligent Data Mapping** - automatic column detection and transformation
- **Data Quality Enhancement** - cleaning, validation, standardization
- **Smart Data Classification** - automatic categorization and tagging

### Analytics & Insights

- **Natural Language Queries** - "Show me sales trends for Q4"
- **Automated Insights** - AI-generated explanations of data patterns
- **Predictive Analytics** - trend forecasting and recommendations

### UI/UX Enhancement

- **Dynamic Widget Generation** - LLM creates widgets based on data types
- **Intelligent Dashboards** - auto-layout optimization
- **Context-Aware Help** - smart assistance and guidance

---

## 📈 Success Metrics

- **Data Volume**: Support for millions of records across dozens of tables
- **Widget Scalability**: Dozens of specialized widgets within CDD contexts
- **Performance**: Sub-second query response times with LLM processing
- **User Adoption**: Intuitive interface requiring minimal training
- **AI Effectiveness**: 90%+ accuracy in automated data processing and insights

---

## ⚙️ Tech Stack

### Backend

- **Python + FastAPI** – Business logic and REST API
- **AssemblyAI** – Transcription and diarization of meeting recordings

### Frontend

- **Next.js 15 (App Router)** – UI and SSR
- **TypeScript + Tailwind CSS + Shadcn UI** – Modern typed UI framework

### Data Layer

- **PostgreSQL** – Structured data (employees, tasks, metrics)
- **S3 (Yandex or AWS)** – Media and document storage
- **Vector DB (Weaviate or Qdrant)** – Semantic search via embeddings
- **Drizzle ORM** – Type-safe database access
- **OpenAI API / LLMs** – Semantic Q&A and data classification

### Infrastructure

- **Docker + Docker Compose**
- **Replit / Vercel for deployment**
- **Auth.js + Vercel Analytics**

---

## 🧠 AI Pipelines

### 📅 Meeting Insights

- Upload → Transcription → Diarization → Speaker Attribution
- Extract decisions, tasks, insights with LLM
- Store JSON + embeddings → searchable summaries

### 📬 Email Intelligence

- Ingest from IMAP / Gmail API
- LLM-driven classification and entity linking
- Semantic index + structured log

### 📄 Document Processing

- Upload → Text extraction → Embedding
- Semantic document search and context-aware retrieval

---

## 🔍 Search Flow
