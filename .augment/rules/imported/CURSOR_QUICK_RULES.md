---
type: "manual"
---

# 🎯 CURSOR QUICK RULES - Domain Structure

## ⚡ MUST READ FIRST

### 🚫 NEVER DO THIS

```typescript
// ❌ Direct import from internal modules
import { fileRepository } from '@/domains/files/data/file.repo.server';

// ❌ Server code in client index
export { fileRepository } from './data/file.repo.server';

// ❌ Wrong file naming
data / file.repo.ts; // Should be .server.ts
api / file.api.ts; // Should be .client.ts
```

### ✅ ALWAYS DO THIS

```typescript
// ✅ Import from index files
import { fileApiClient } from '@/domains/files'; // Client
import { fileRepositoryServer } from '@/domains/files/index.server'; // Server

// ✅ Correct file naming
data / file.repo.server.ts; // + 'server-only' directive
api / file.api.client.ts; // + 'use client' directive
```

---

## 📁 Domain Template

```
domains/<domain-name>/
├── model/                  # ✅ SHARED - Types, Zod schemas
├── data/                   # ⚠️ SERVER-ONLY - *.repo.server.ts
├── api/                    # ✅ CLIENT-ONLY - *.api.client.ts
├── lib/                    # 🔄 MIXED - *.server.ts, *.client.ts, *.shared.ts
├── ui/                     # ✅ CLIENT-ONLY - *.tsx
├── index.ts                # ✅ CLIENT-SAFE - Public API
├── index.server.ts         # ⚠️ SERVER-ONLY - Server API
└── README.md               # Documentation
```

---

## 🔥 Mandatory Rules

### File Naming

- `*.server.ts` → Add `import 'server-only';`
- `*.client.ts` → Add `'use client';`
- `*.shared.ts` → No directives (pure functions)

### Export System

- `index.ts` → Client-safe exports only
- `index.server.ts` → Server-only exports + shared types

### Import Rules

- Client components → `from '@/domains/<domain>'`
- API routes → `from '@/domains/<domain>/index.server'`
- Never import directly from internal modules

---

## 🎯 Project Context

- **Next.js 15** with App Router
- **TypeScript** strict mode
- **Drizzle ORM** + PostgreSQL
- **Yandex Cloud S3** object storage
- **Feature-Sliced Design** architecture

---

## 📋 Quality Checklist

Before submitting domain changes:

- [ ] Server files have `.server.ts` suffix + `'server-only'`
- [ ] Client files have `.client.ts` suffix + `'use client'`
- [ ] Two index files: `index.ts` + `index.server.ts`
- [ ] No direct imports from internal modules
- [ ] No server code in client index
- [ ] README.md updated

---

## 📚 Full Documentation

- [cursor-domain-rules.md](./cursor-domain-rules.md) - Complete guide
- [systemPatterns.md](./systemPatterns.md) - Architecture patterns
- [domains/catalog-files-d002/README.md](../domains/catalog-files-d002/README.md) - Reference implementation

---

## 💡 Remember

**"Two index files are better than one confused index file"**

**"If unsure whether code is client or server, it's probably shared"**

**"Always prefer explicit naming over implicit assumptions"**
