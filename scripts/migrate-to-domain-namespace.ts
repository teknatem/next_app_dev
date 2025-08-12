/*
  Migration: switch from ./domains to ./domain; flatten family level; enforce <dNNN>-<slug> names; add meta.shared.ts and re-export metadata.

  Usage (Windows-friendly, no &&):
    pnpm tsx scripts/migrate-to-domain-namespace.ts
*/

import { promises as fs } from 'fs';
import * as path from 'path';

type MapEntry = { oldName: string; newName: string };

const repoRoot = process.cwd();
const domainsRoot = path.join(repoRoot, 'domains');
const domainRoot = path.join(repoRoot, 'domain');

function isAggregateName(name: string): boolean {
  // Accept already-correct dNNN-slug names
  if (/^d\d{3}-[a-z0-9_-]+$/i.test(name)) return true;
  // Accept legacy names like catalog-*-d001 or document-*-d001
  if (/^(catalog|document)-[a-z0-9_-]+-d\d{3}$/i.test(name)) return true;
  return false;
}

const guessMapping = (name: string): MapEntry | null => {
  // catalog-bots-d001 -> d001-bots
  // document-meetings-d004 -> d004-meetings
  const legacy = /^(catalog|document)-([a-z0-9_-]+)-d(\d{3})$/i.exec(name);
  if (legacy)
    return {
      oldName: name,
      newName: `d${legacy[3]}-${legacy[2]}`.toLowerCase()
    };
  // already correct dNNN-*
  if (/^d\d{3}-[a-z0-9_-]+$/i.test(name))
    return { oldName: name, newName: name };
  return null;
};

async function ensureDir(p: string) {
  try {
    await fs.mkdir(p, { recursive: true });
  } catch {}
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function walkFiles(dir: string, acc: string[] = []): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    // Skip node_modules and .next
    if (e.name === 'node_modules' || e.name === '.next') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walkFiles(p, acc);
    else if (
      [
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.json',
        '.md',
        '.mdx',
        '.cjs',
        '.mjs'
      ].some((ext) => e.name.endsWith(ext))
    )
      acc.push(p);
  }
  return acc;
}

async function main() {
  const existsDomains = await fs
    .stat(domainsRoot)
    .then((s) => s.isDirectory())
    .catch(() => false);
  if (!existsDomains) throw new Error('No ./domains directory found');

  await ensureDir(domainRoot);

  const entries = await fs.readdir(domainsRoot);
  const aggregateDirs = entries.filter(isAggregateName);
  const mappings: MapEntry[] = [];
  const manual: string[] = [];

  for (const entry of aggregateDirs) {
    const m = guessMapping(entry);
    if (m) mappings.push(m);
    else manual.push(entry);
  }

  // Utility: copy folder recursively
  const copyDir = async (srcDir: string, dstDir: string) => {
    await ensureDir(dstDir);
    const items = await fs.readdir(srcDir, { withFileTypes: true });
    for (const it of items) {
      const s = path.join(srcDir, it.name);
      const d = path.join(dstDir, it.name);
      if (it.isDirectory()) await copyDir(s, d);
      else {
        const data = await fs.readFile(s);
        await fs.writeFile(d, data);
      }
    }
  };

  const removeDirRecursive = async (dir: string) => {
    const items = await fs.readdir(dir, { withFileTypes: true });
    for (const it of items) {
      const p = path.join(dir, it.name);
      if (it.isDirectory()) await removeDirRecursive(p);
      else await fs.unlink(p);
    }
    await fs.rmdir(dir);
  };

  // Move each aggregate into ./domain/<newName>
  for (const m of mappings) {
    const src = path.join(domainsRoot, m.oldName);
    const dst = path.join(domainRoot, m.newName);
    await ensureDir(path.dirname(dst));
    try {
      await fs.rename(src, dst);
      console.log(`Moved: ${m.oldName} -> ${path.relative(repoRoot, dst)}`);
    } catch (err: any) {
      console.warn(
        `Rename failed for ${m.oldName} (${err?.code || err}). Attempting copy+delete...`
      );
      await copyDir(src, dst);
      await removeDirRecursive(src);
      console.log(
        `Copied+Removed: ${m.oldName} -> ${path.relative(repoRoot, dst)}`
      );
    }
  }

  // Remove empty ./domains (ignore non-aggregate leftovers)
  const rest = await fs.readdir(domainsRoot).catch(() => []);
  if (rest.length === 0) {
    await fs.rmdir(domainsRoot);
    console.log('Removed empty ./domains');
  } else {
    console.warn('WARNING: ./domains not empty, check:', rest);
  }

  // Update imports and config paths
  const files = await walkFiles(repoRoot);
  const mapByOld = new Map(
    mappings.map(
      (m) => [`@/domain/${m.oldName}`, `@/domain/${m.newName}`] as const
    )
  );
  for (const file of files) {
    let text = await fs.readFile(file, 'utf8');
    let changed = false;

    // Specific aggregate alias paths first
    for (const [oldP, newP] of mapByOld) {
      if (text.includes(oldP)) {
        text = text.split(oldP).join(newP);
        changed = true;
      }
    }
    // Generic alias fix
    if (text.includes('@/domain/')) {
      text = text.split('@/domain/').join('@/domain/');
      changed = true;
    }
    // Generic relative config/glob fix
    if (text.includes('./domain/')) {
      text = text.split('./domain/').join('./domain/');
      changed = true;
    }
    // Narrative/documentation references
    if (text.includes('`domain/')) {
      text = text.split('`domain/').join('`domain/');
      changed = true;
    }
    if (changed) await fs.writeFile(file, text, 'utf8');
  }

  // Add meta.shared.ts and ensure re-exports
  for (const { newName } of mappings) {
    const aggRoot = path.join(domainRoot, newName);
    const metaPath = path.join(aggRoot, 'meta.shared.ts');
    if (!(await fileExists(metaPath))) {
      const id = newName.split('-')[0]; // dNNN
      const slug = newName.split('-').slice(1).join('-');
      const meta = `export const AGGREGATE_ID = '${id}' as const;\nexport const AGGREGATE_SLUG = '${slug}' as const;\n`;
      await fs.writeFile(metaPath, meta, 'utf8');
      console.log(`Added meta.shared.ts in ${newName}`);
    }

    for (const idx of ['index.ts', 'index.server.ts']) {
      const idxPath = path.join(aggRoot, idx);
      if (!(await fileExists(idxPath))) continue;
      const content = await fs.readFile(idxPath, 'utf8');
      if (
        !content.includes('AGGREGATE_ID') ||
        !content.includes('AGGREGATE_SLUG')
      ) {
        await fs.appendFile(
          idxPath,
          `\nexport { AGGREGATE_ID, AGGREGATE_SLUG } from './meta.shared';\n`
        );
        console.log(`Updated exports in ${newName}/${idx}`);
      }
    }
  }

  if (manual.length) {
    console.warn('\nManual rename required for outliers:');
    for (const m of manual) console.warn(' - ' + m);
  }

  console.log('\nDONE. Review changes, run type-check and tests.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
