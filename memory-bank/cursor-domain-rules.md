# Cursor Domain Rules - Next.js FSD Project

## 🎯 CRITICAL: Domain Structure Rules

### **Always follow these rules when working with domains in this project**

---

## 📁 Domain Structure Template

```
domains/
└── <domain-name>/
    ├── model/                     # ✅ SHARED - Types, schemas, enums
    │   ├── *.schema.ts           # Zod schemas + TypeScript types
    │   └── *.types.ts            # Pure TypeScript types
    ├── data/                      # ⚠️ SERVER-ONLY - Database operations
    │   └── *.repo.server.ts      # Repository with 'server-only' directive
    ├── api/                       # ✅ CLIENT-ONLY - HTTP API calls
    │   └── *.api.client.ts       # Client API with 'use client' directive
    ├── lib/                       # 🔄 MIXED - Utilities and services
    │   ├── *.shared.ts           # ✅ SHARED - Pure functions, no side effects
    │   ├── *.server.ts           # ⚠️ SERVER-ONLY - S3, external APIs
    │   └── *.client.ts           # ✅ CLIENT-ONLY - Browser-specific logic
    ├── ui/                        # ✅ CLIENT-ONLY - React components
    │   └── *.tsx                 # All UI components with 'use client'
    ├── index.ts                   # ✅ CLIENT-SAFE - Public API for client
    ├── index.server.ts            # ⚠️ SERVER-ONLY - Public API for server
    └── README.md                  # Documentation
```

---

## 🔥 MANDATORY File Naming Rules

### **Server Files (Node.js only)**

- **ALWAYS** use `.server.ts` suffix
- **ALWAYS** add `import 'server-only';` at the top
- **Examples:** `file.repo.server.ts`, `s3.service.server.ts`

### **Client Files (Browser only)**

- **ALWAYS** use `.client.ts` suffix
- **ALWAYS** add `'use client';` at the top
- **Examples:** `file.api.client.ts`, `validation.client.ts`

### **Shared Files (Both environments)**

- **ALWAYS** use `.shared.ts` suffix OR no suffix
- **NEVER** add environment directives
- **Examples:** `date-utils.ts`, `types.shared.ts`

---

## 🎯 Double Export System

### **Client Index (index.ts)**

```typescript
// ✅ CLIENT-SAFE exports only
export * from './model/files.schema'; // Shared types & schemas
export { toISOString } from './lib/date-utils'; // Shared utilities
export { fileApiClient } from './api/file.api.client'; // Client API
export { FileList } from './ui/file-list'; // UI components
```

### **Server Index (index.server.ts)**

```typescript
import 'server-only';

// ⚠️ SERVER-ONLY exports
export * from './model/files.schema'; // Shared types & schemas
export { toISOString } from './lib/date-utils'; // Shared utilities
export { fileRepositoryServer } from './data/file.repo.server'; // Server data
export { getPresignedUploadUrlServer } from './lib/s3.service.server'; // Server services
```

---

## 🚫 FORBIDDEN Patterns

### **❌ NEVER do this:**

```typescript
// ❌ Direct imports from internal modules
import { fileRepository } from '@/domains/files/data/file.repo.server';

// ❌ Exporting server code from client index
export { fileRepository } from './data/file.repo.server';

// ❌ Mixing server/client code in same file
export const clientFunction = () => {
  /* client code */
};
export const serverFunction = async () => {
  /* server code */
};

// ❌ Wrong file naming
data / file.repo.ts; // Should be .server.ts
api / file.api.ts; // Should be .client.ts
```

### **✅ ALWAYS do this:**

```typescript
// ✅ Import from index files
import { fileApiClient } from '@/domains/files';
import { fileRepositoryServer } from '@/domains/files/index.server';

// ✅ Clear separation
// Client file: api/file.api.client.ts
('use client');
export const fileApiClient = {
  /* client code */
};

// Server file: data/file.repo.server.ts
import 'server-only';
export const fileRepositoryServer = {
  /* server code */
};
```

---

## 📋 Usage Rules

### **In API Routes (Server Context)**

```typescript
// ✅ Use server index
import {
  fileRepositoryServer,
  insertFileSchema
} from '@/domains/files/index.server';
```

### **In React Components (Client Context)**

```typescript
// ✅ Use client index
import { fileApiClient, File } from '@/domains/files';
```

### **In Shared Utilities**

```typescript
// ✅ Import shared modules directly
import { toISOString } from '@/domains/files/lib/date-utils';
```

---

## 🏗️ Project Context

### **Technology Stack**

- **Next.js 15** with App Router
- **TypeScript** strict mode
- **Drizzle ORM** with PostgreSQL
- **Yandex Cloud S3** for object storage
- **Feature-Sliced Design** architecture

### **Key Principles**

1. **Server/Client Separation** - Explicit boundaries
2. **Minimal Index Files** - Two index files max per domain
3. **Type Safety** - Zod schemas + TypeScript
4. **Performance** - Tree-shaking friendly exports
5. **Scalability** - Domain-driven design

---

## 🔄 Migration Path

### **When updating existing domains:**

1. **Identify server-only code** - DB operations, S3, external APIs
2. **Add .server.ts suffixes** - Rename files appropriately
3. **Add 'server-only' directives** - Top of server files
4. **Create client API layer** - \*.api.client.ts files
5. **Update index files** - Split exports between client/server
6. **Test isolation** - Verify no server code in client bundle

---

## 🎯 Quality Checklist

### **Before submitting domain changes:**

- [ ] All server files have `.server.ts` suffix + `'server-only'`
- [ ] All client files have `.client.ts` suffix + `'use client'`
- [ ] Two index files: `index.ts` (client) + `index.server.ts` (server)
- [ ] No direct imports from internal modules
- [ ] Server code not exported from client index
- [ ] Client code not exported from server index
- [ ] README.md updated with structure explanation

---

## 💡 Remember

**"If you're not sure whether code is client or server, it's probably shared"**

**"Always prefer explicit naming over implicit assumptions"**

**"Two index files are better than one confused index file"**

---

## 📚 References

- [domains/catalog-files-d002/README.md](../domains/catalog-files-d002/README.md) - Reference implementation
- [Feature-Sliced Design](https://feature-sliced.design/) - Official documentation
- [Next.js App Router](https://nextjs.org/docs/app) - Server/Client patterns
