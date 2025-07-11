# 📝 Code Quality Principles

### Readability Over Brevity

Меньше кода — лучше, но не в ущерб простоте понимания.

### Complex Logic Decomposition

```typescript
// ❌ Плохо — сложное условие в одну строку
if ((a && b) || (c && d)) {
  // ...
}

// ✅ Хорошо — выносим условия в промежуточные переменные
const hasPrimaryAccess = a && b;
const hasSecondaryAccess = c && d;

if (hasPrimaryAccess || hasSecondaryAccess) {
  // ...
}
```
