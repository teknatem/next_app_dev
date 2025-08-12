# Context-Driven Design (CDD) Principles

## 🎯 Overview

**Context-Driven Design (CDD)** is an architecture philosophy that prioritizes context localization and clarity for both developers and AI assistants. The core principle is that the project structure should align with the mental model and business context, making it intuitive to navigate and understand.

## 🧠 Core Philosophy

### **Context Localization**

Every piece of code should be placed where it makes the most contextual sense. The structure should reflect how developers and AI think about the business domain, not just technical organization.

### **Cognitive Alignment**

The codebase structure should match the mental model of the business domain. When someone thinks "I need to work with employees," they should naturally navigate to the employees domain.

### **Explicit Boundaries**

Clear, explicit boundaries between different contexts (server/client, domains, layers) reduce cognitive overhead and prevent confusion.

## 🏗️ Key Principles

### 1. **Context-First Organization**

- **Domains as Business Contexts**: Each domain represents a clear business context (e.g., `catalog-employees-d003` for employee management)
- **Intuitive Navigation**: File structure should be predictable based on business understanding
- **Minimal Cross-Context Dependencies**: Domains should be self-contained with minimal external dependencies

### 2. **Explicit Context Separation**

- **Server/Client Boundaries**: Clear separation with explicit file naming (`.server.ts`, `.client.ts`)
- **Shared Context**: Minimal shared code that truly belongs to both environments
- **Context-Specific APIs**: Each context (client/server) has its own public API

### 3. **Context Clarity Through Naming**

- **Business Language**: Use business terminology in file and folder names
- **Predictable Patterns**: Consistent naming conventions across all domains
- **Self-Documenting Structure**: The structure itself should explain the purpose

### 4. **Context Evolution**

- **Adaptable Architecture**: Structure can evolve as business context changes
- **Backward Compatibility**: Changes should not break existing context boundaries
- **Incremental Refactoring**: Context improvements can be made incrementally

## 📁 Structural Principles

### **Domain Organization**

```
domain/
└── <dNNN>-<slug>/
    ├── model/           # Shared business models and enums
    ├── data/           # Server-only data operations
    ├── api/            # Client-only API calls
    ├── lib/            # Mixed utilities and services
    ├── ui/             # React components
    ├── index.ts        # Client-safe public API
    ├── index.server.ts # Server-only public API
    └── README.md       # Context documentation
```

### **Layer Responsibilities**

- **Model**: Business types, enums, and validation schemas
- **Data**: Database operations and data persistence
- **API**: HTTP client operations and external integrations
- **Lib**: Utilities, services, and business logic
- **UI**: User interface components
- **Index Files**: Public APIs for each context

## 🎯 Benefits

### **For Developers**

- **Intuitive Navigation**: Easy to find code based on business understanding
- **Reduced Cognitive Load**: Clear boundaries and predictable structure
- **Faster Onboarding**: New developers understand the structure quickly
- **Easier Refactoring**: Changes are localized to specific contexts

### **For AI Assistants**

- **Context-Aware Suggestions**: AI can understand the business context
- **Accurate Code Generation**: Generated code fits the established patterns
- **Better Documentation**: Structure itself provides context
- **Consistent Patterns**: Predictable organization across domains

### **For Business**

- **Aligned with Business Language**: Code structure matches business terminology
- **Easier Feature Development**: New features fit naturally into existing structure
- **Reduced Maintenance**: Clear organization reduces technical debt
- **Scalable Architecture**: Structure supports business growth

## 🔄 Relationship with DDD

### **What CDD Supports from DDD**

- **Domain Modeling**: Business concepts are modeled as domains
- **Separation of Concerns**: Clear boundaries between different business areas
- **Business Language**: Use of business terminology in code structure
- **Tactical Design**: Focus on organizing code within domains

### **What CDD Modifies from DDD**

- **Ubiquitous Language**: CDD uses business terminology but doesn't require strict unified language across all contexts
- **Bounded Contexts**: CDD uses domains as contexts but with more flexible boundaries that can evolve
- **Strategic Design**: CDD focuses on tactical design and contextual organization rather than strategic domain mapping
- **Domain Events**: CDD doesn't require mandatory use of domain events for communication between contexts

### **What CDD Adds Beyond DDD**

- **Context Localization**: Explicit focus on placing code where it makes the most contextual sense
- **AI-Friendly Structure**: Organization that helps AI assistants understand and work with the codebase
- **Explicit Server/Client Separation**: Clear boundaries for Next.js App Router patterns
- **Context-Specific APIs**: Separate public APIs for different contexts (client/server)

## 📚 Implementation Guidelines

### **Creating New Domains**

1. **Identify Business Context**: What business domain does this represent?
2. **Choose Domain Name**: Use business terminology (e.g., `catalog-employees-d003`)
3. **Define Context Boundaries**: What belongs in this domain vs. others?
4. **Create Structure**: Follow the standard domain template
5. **Document Context**: Explain the business purpose in README.md

### **Refactoring Existing Code**

1. **Analyze Current Context**: What business context does this code serve?
2. **Identify Context Boundaries**: Where should the boundaries be?
3. **Move Code**: Reorganize based on business context
4. **Update Dependencies**: Ensure cross-context dependencies are explicit
5. **Update Documentation**: Reflect the new context organization

### **Maintaining Context Clarity**

1. **Regular Reviews**: Periodically review if structure still matches business context
2. **Context Documentation**: Keep README files updated with business purpose
3. **Pattern Consistency**: Ensure all domains follow the same patterns
4. **Boundary Enforcement**: Use linting rules to enforce context boundaries

> Для получения подробных, практических правил по реализации этих принципов, обратитесь к [cursor-domain-rules.md](./cursor-domain-rules.md).

## 🎯 Success Metrics

### **Developer Experience**

- Time to find relevant code
- Number of cross-context imports
- Consistency of patterns across domains
- Documentation completeness

### **AI Assistant Effectiveness**

- Accuracy of code generation
- Context-aware suggestions
- Understanding of business domain
- Pattern recognition

### **Business Alignment**

- Feature development speed
- Code maintainability
- Technical debt reduction
- Scalability of architecture

## 💡 Remember

**"Context is king. Structure should serve understanding, not just organization."**

**"When in doubt, ask: 'What business context does this serve?'"**

**"The best architecture is the one that makes the most sense to the people who use it."**
