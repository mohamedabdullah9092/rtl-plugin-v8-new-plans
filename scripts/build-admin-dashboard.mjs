import { cp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const source = join(root, 'admin-dashboard');
const output = join(root, 'public');

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, {
  recursive: true,
  filter: (path) => !path.includes(`${source}\\.vercel`) && !path.includes(`${source}/.vercel`)
});
