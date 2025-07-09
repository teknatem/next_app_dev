# Procedure: update_jsdoc

This file describes the **update_jsdoc** action – a repeatable, automated workflow the LLM must follow when asked to add or update JSDoc-passports and trace-index records for an FSD slice.

---

## Trigger phrase

```
update_jsdoc <layer> <PascalName> ["summary up to 120 chars"]
```

- **layer** – one of `entities`, `features`, `widgets`, `shared`.
- **PascalName** – Slice folder name in PascalCase.
- **summary** – Optional short description (≤ 120 chars). If the user omits it, the LLM must invent a concise summary that meets the limit.

Example human request:

```
update_jsdoc widgets UserProfileMenu
```

Expected behaviour: the LLM generates a meaningful summary (≤ 120 chars) such as

```
"Dropdown with avatar and profile actions"
```

and proceeds with the workflow below.

---

## Workflow

1. **Generate / validate summary**  
   If the command lacks a summary argument, produce one ≤ 120 characters.

2. **Run CLI scaffold**  
   Execute:

   ```bash
   pnpm create:slice <layer> <PascalName> "<summary>"
   ```

   The CLI will:  
   • assign the next available trace-ID (`E-00x`, `F-00x`, `W-00x`, `S-00x`),  
   • update `trace-index.yml`,  
   • create `<layer>/<camelName>/index.ts` if missing,  
   • insert a JSDoc-passport block in the index file.

3. **If slice already exists**  
   • Ensure its `index.ts` contains a JSDoc block with the correct **@id**, **@layer**, **@summary**.  
   • Update the summary line if a new summary is provided.  
   • Synchronise the corresponding `description` field in `trace-index.yml`.

4. **Add ONLY essential JSDoc passport**  
   • Add **ONLY** the JSDoc passport block to the index file's top.
   • **DO NOT** add detailed comments to exports, functions, or interfaces.
   • **DO NOT** add @fileoverview, @module, @version, @author, @since tags.
   • **DO NOT** add parameter documentation or method descriptions.
   • Keep the codebase clean and focused.

5. **Update trace-index.yml**  
   • Add or update the entry for the slice.
   • Ensure the description matches the @summary.

6. **Commit result (optional)**  
   Include updated `trace-index.yml` and any new / changed files in the commit.

---

## JSDoc-passport template (MINIMAL)

```ts
/**
 * @id <ID> <PascalName>
 * @layer <layer>
 * @summary <summary ≤ 120 chars>
 * @description <detailed description of slice functionality, purpose, and key features>
 */

// ... existing exports without additional comments
```

---

## Important Rules

• **MINIMAL APPROACH**: Add ONLY the JSDoc passport block, nothing else.
• **NO BLOAT**: Do not add comments to exports, functions, interfaces, or parameters.
• **CLEAN CODE**: Keep the codebase lean and focused on functionality.
• **ESSENTIAL ONLY**: Only @id, @layer, @summary, @description are required.
• The action is idempotent – running it again updates the passport but doesn't add extra documentation.

---

## Notes

• The CLI `create:slice` remains the single source for generating IDs; **do not** hard-code IDs.
• Keep summaries short, active-voice, and free of code snippets.
• @description should provide comprehensive technical context for developers.
• **Avoid documentation bloat** – focus on the essential passport information only.
