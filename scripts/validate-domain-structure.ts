/*
 Domain Structure Validator

 Usage:
   pnpm tsx scripts/validate-domain-structure.ts domains/catalog-files-d002

 Validates a single domain against project rules:
  - Server Actions live under infra/*.actions.ts with "'use server'" as the very first non-empty line
  - index.ts (client-safe) must not export server-only modules
  - index.server.ts must not export client-only modules
  - ui/ follows "1 folder = 1 widget" and each widget has index.ts
  - Client components do not import server code directly (infra/, data/, index.server, *.server)
  - Client files include 'use client'; server files include import 'server-only'
*/

import { promises as fs } from 'fs';
import * as path from 'path';

type ValidationResult = {
  errors: string[];
  warnings: string[];
};

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readText(p: string): Promise<string> {
  return await fs.readFile(p, 'utf8');
}

function getFirstNonEmptyLine(text: string): string | null {
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0) continue;
    return trimmed;
  }
  return null;
}

function rel(root: string, target: string): string {
  return path.relative(root, target).replace(/\\/g, '/');
}

async function validateDomain(domainRoot: string): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const mustExist = async (p: string, label?: string) => {
    if (!(await fileExists(p))) {
      errors.push(`Missing required ${label ?? 'file'}: ${rel(domainRoot, p)}`);
      return false;
    }
    return true;
  };

  // 1. Basic required files
  const indexTs = path.join(domainRoot, 'index.ts');
  const indexServerTs = path.join(domainRoot, 'index.server.ts');
  await mustExist(indexTs, 'index.ts');
  await mustExist(indexServerTs, 'index.server.ts');

  // 2. Server Actions under infra/*.actions.ts with 'use server' first line
  const infraDir = path.join(domainRoot, 'infra');
  if (await fileExists(infraDir)) {
    const infraEntries = await fs.readdir(infraDir);
    const hasActions = infraEntries.some((f) => f.endsWith('.actions.ts'));
    if (!hasActions)
      warnings.push(
        `No *.actions.ts found in ${rel(domainRoot, infraDir)} (is this expected?)`
      );

    for (const file of infraEntries) {
      const full = path.join(infraDir, file);
      const stat = await fs.stat(full);
      if (!stat.isFile()) continue;
      if (file.endsWith('.actions.ts')) {
        const content = await readText(full);
        const first = getFirstNonEmptyLine(content);
        if (first !== "'use server';") {
          errors.push(
            `'use server' must be the very first non-empty line in ${rel(domainRoot, full)} (found: ${first ?? 'empty'})`
          );
        }
      }
      if (file.endsWith('.server.ts')) {
        warnings.push(
          `In infra/ prefer *.actions.ts over *.server.ts: ${rel(domainRoot, full)}`
        );
      }
    }
  } else {
    warnings.push(`No infra/ directory found under ${rel('.', domainRoot)}`);
  }

  // 3. index.ts must be client-safe (no infra/, data/, .server, index.server)
  if (await fileExists(indexTs)) {
    const text = await readText(indexTs);
    const invalidPatterns = [
      /from\s+['"].*\/infra\//,
      /from\s+['"].*\/data\//,
      /from\s+['"].*index\.server/,
      /from\s+['"].*\.server(?:\.|['"])\b/
    ];
    for (const re of invalidPatterns) {
      if (re.test(text)) {
        errors.push(
          `index.ts exports server-only module (pattern ${re} matched)`
        );
      }
    }
  }

  // 4. index.server.ts must be server-only (should not export client-only ui *.client)
  if (await fileExists(indexServerTs)) {
    const text = await readText(indexServerTs);
    const clientLeak = /from\s+['"].*\/ui\/.*\.client/;
    if (clientLeak.test(text)) {
      errors.push(
        `index.server.ts must not export client-only components (*.client.*)`
      );
    }
  }

  // 5. ui/ folderized widgets and environment markers
  const uiDir = path.join(domainRoot, 'ui');
  if (await fileExists(uiDir)) {
    const entries = await fs.readdir(uiDir);
    for (const entry of entries) {
      const full = path.join(uiDir, entry);
      const stat = await fs.stat(full);
      if (stat.isFile()) {
        if (entry !== 'index.ts') {
          errors.push(
            `ui/ should contain widget folders; found stray file: ${rel(domainRoot, full)}`
          );
        }
        continue;
      }
      if (stat.isDirectory()) {
        // Each widget folder must have index.ts
        const widgetIndex = path.join(full, 'index.ts');
        if (!(await fileExists(widgetIndex))) {
          errors.push(
            `Widget folder missing index.ts: ${rel(domainRoot, widgetIndex)}`
          );
        }
        // Validate client/server markers inside widget
        const widgetFiles = await fs.readdir(full);
        for (const wf of widgetFiles) {
          const wfull = path.join(full, wf);
          const wstat = await fs.stat(wfull);
          if (!wstat.isFile()) continue;
          if (/\.client\.(t|j)sx?$/.test(wf)) {
            const content = await readText(wfull);
            const top = content.split(/\r?\n/).slice(0, 5).join('\n');
            if (!top.includes("'use client'")) {
              errors.push(
                `Client file missing 'use client' directive: ${rel(domainRoot, wfull)}`
              );
            }
            // Disallow direct imports of server code in client files
            const badImportRe =
              /from\s+['"].*(?:\/infra\/|\/data\/|index\.server|\.server(?:\.|['"]))+/;
            if (badImportRe.test(content)) {
              errors.push(
                `Client file imports server code directly: ${rel(domainRoot, wfull)}`
              );
            }
          }
          if (/\.server\.(t|j)sx?$/.test(wf)) {
            const content = await readText(wfull);
            const first = getFirstNonEmptyLine(content);
            if (first !== "import 'server-only';") {
              errors.push(
                `Server file must start with: import 'server-only'; → ${rel(domainRoot, wfull)}`
              );
            }
          }
        }
      }
    }
  } else {
    warnings.push(`No ui/ directory found under ${rel('.', domainRoot)}`);
  }

  return { errors, warnings };
}

async function main() {
  const domainArg = process.argv[2];
  if (!domainArg) {
    console.error(
      'Usage: pnpm tsx scripts/validate-domain-structure.ts <path-to-domain>'
    );
    process.exit(2);
  }
  const domainRoot = path.resolve(domainArg);
  const stat = await fs.stat(domainRoot).catch(() => null);
  if (!stat || !stat.isDirectory()) {
    console.error(`Not a directory: ${domainRoot}`);
    process.exit(2);
  }

  const { errors, warnings } = await validateDomain(domainRoot);

  if (warnings.length) {
    console.warn('Warnings:');
    for (const w of warnings) console.warn('  - ' + w);
  }
  if (errors.length) {
    console.error(`\nFAILED: ${errors.length} error(s)`);
    for (const e of errors) console.error('  - ' + e);
    process.exit(1);
  }
  console.log('OK: Domain structure validation passed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
