#!/usr/bin/env -S node --loader tsx

/**
 * CLI: pnpm create:slice <layer> <PascalName> "<summary 120 chars>"
 *
 * Пример:
 *   pnpm create:slice widgets FileToBaseImport "Upload Excel/CSV → DB, shows results"
 */

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';

// ---------- helpers ----------
const TRACE_FILE = 'trace-index.yml';
type Layers = 'entities' | 'features' | 'widgets' | 'shared';
const PREFIX: Record<Layers, string> = {
  entities: 'E',
  features: 'F',
  widgets:  'W',
  shared:   'S'
};

function readTrace(): Record<string, any> {
  if (!fs.existsSync(TRACE_FILE)) return {};
  return yaml.parse(fs.readFileSync(TRACE_FILE, 'utf8')) ?? {};
}

// ---------- args ----------
const [,, layerArg, nameArg, ...rest] = process.argv;
if (!layerArg || !nameArg) {
  console.error('Usage: pnpm create:slice <layer> <PascalName> "<summary>"');
  process.exit(1);
}
const layer = layerArg as Layers;
if (!Object.keys(PREFIX).includes(layer)) {
  console.error(`Layer must be one of ${Object.keys(PREFIX).join(', ')}`);
  process.exit(1);
}
const name  = nameArg;
const summary = rest.join(' ').trim() || '(TODO summary)';

// ---------- generate ID ----------
const store  = readTrace();
const nextNum =
  Math.max(
    0,
    ...Object.keys(store)
      .filter(k => k.startsWith(PREFIX[layer]))
      .map(k => Number(k.split('-')[1] ?? 0))
  ) + 1;

const id = `${PREFIX[layer]}-${String(nextNum).padStart(3, '0')}`;
const slicePath = path.join(layer, name[0].toLowerCase() + name.slice(1));

// ---------- update YAML ----------
store[id] = { path: slicePath, name, layer, description: summary };
fs.writeFileSync(TRACE_FILE, yaml.stringify(store), 'utf8');
console.log(`✅  Added ${id} to ${TRACE_FILE}`);

// ---------- scaffold directory ----------
const absDir = path.join(process.cwd(), slicePath);
fs.mkdirSync(absDir, { recursive: true });

const indexFile = path.join(absDir, 'index.ts');
if (!fs.existsSync(indexFile)) {
  const jsdoc = [
    '/**',
    ` * @id ${id} ${name}`,
    ` * @layer ${layer}`,
    ` * @summary ${summary}`,
    ' */'
  ].join('\n');
  fs.writeFileSync(
    indexFile,
    `${jsdoc}\n\n// TODO: exports go here\n`,
    'utf8'
  );
  console.log(`✅  Created ${path.relative(process.cwd(), indexFile)}`);
} else {
  console.log('ℹ️   index.ts already exists – JSDoc не добавлён.');
}

console.log('\n🚀  Slice scaffold ready – continue coding!'); 