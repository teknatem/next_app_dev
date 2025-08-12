# Tech Context

## 🛠️ Technology Stack

### Core Frameworks & Libraries

- **Next.js 15:** App Router, Server Components, and Server Actions.
- **React 19:** For building the user interface.
- **TypeScript:** For static typing and code quality.
- **Tailwind CSS:** For utility-first styling.
- **Shadcn UI:** For the base component library.
- **next-themes:** For theme management (light/dark mode).
- **Zustand:** For client-side state management (UI state only).

### Database & Data Access

- **PostgreSQL:** Primary relational database.
- **Drizzle ORM:** Type-safe, SQL-like ORM for database access.
- **Vector Database (Planned):** For semantic search and AI features.

### Object Storage

- **Yandex Cloud S3:** S3-compatible storage for files and media.
- **Presigned URLs:** Used for secure file uploads/downloads directly from the client.

### AI & LLM Integration

- **OpenAI API:** For generative AI, data processing, and analysis.
- **AssemblyAI:** For audio transcription and diarization.
- **LangChain (Planned):** For building complex LLM-powered workflows.

### Development & Tooling

- **pnpm:** The required package manager for this project.
- **ESLint:** For code linting and enforcing architectural rules.
- **Drizzle Kit:** For generating and managing database migrations.
- **Vercel Analytics:** For performance monitoring.

### Server Actions Conventions

- Server Actions live under `domain/<domain>/infra/`.
- Filenames must end with `*.actions.ts`.
- Each file must start with `'use server'`.
- Export only via `index.server.ts`.
- Never import them in client modules.

See: [`memory-bank/cursor-domain-rules.md`](./cursor-domain-rules.md)

---

## 📋 Development Setup

### Prerequisites

- **Node.js 20+**
- **PostgreSQL 14+**
- **pnpm 8+**

### Local Environment Setup

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```
2.  **Configure environment variables:**
    - Create a `.env.local` file by copying `.env.example`.
    - Fill in the required variables, such as `POSTGRES_URL`.
3.  **Run the development server:**
    ```bash
    pnpm dev
    ```

### Database Management

- **Generate Migrations:** After changing a Drizzle schema in `domain/**/orm.server.ts` or `shared/database/schemas/`, run:
  ```bash
  pnpm db:generate
  ```
- **Apply Migrations:** To apply migrations to your local database, run:
  ```bash
  pnpm db:push
  ```

### Path Aliases (`tsconfig.json`)

The project uses path aliases for clean imports. Refer to `tsconfig.json` for the complete list.

- `@/shared/*`
- `@/domain/*`
- `@/widgets/*`
- `@/features/*`
