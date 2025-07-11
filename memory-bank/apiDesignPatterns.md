# 🔄 API Design Patterns

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
