import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const vendorRoot = resolve(root, 'vendor/beui');
const provenance = JSON.parse(await readFile(resolve(vendorRoot, 'source.json'), 'utf8'));
for (const file of provenance.files) {
  const source = await readFile(resolve(vendorRoot, file.path));
  if (createHash('sha256').update(source).digest('hex') !== file.sha256) {
    throw new Error(`Official beUI source changed: ${file.path}. Keep adaptations in the LanguageSelector adapter.`);
  }
}

const result = await build({
  absWorkingDir: root,
  entryPoints: [resolve(root, 'scripts/beui-entry.ts')],
  alias: { '@': vendorRoot },
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'browser',
  target: 'chrome110',
  jsx: 'automatic',
  external: ['react', 'react/*', 'react-dom', 'react-dom/*'],
  define: { 'process.env.NODE_ENV': '"production"' },
  minify: true,
  legalComments: 'inline',
});

// Figma loads one __html__ string, so embed the official bundle in the existing
// module. Reuse its React singleton instead of shipping a second React runtime.
const bundled = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const begin = '// BEGIN GENERATED BEUI SELECT';
const end = '// END GENERATED BEUI SELECT';
const generated = `${begin}
    // Sources: ${[provenance.registry, ...(provenance.additionalComponents || []).map(component => component.registry)].join(', ')}; rebuild with npm run build:plugin-ui.
    const BeUISelect = (() => {
      const module = { exports: {} };
      const exports = module.exports;
      const require = (name) => {
        if (name === 'react') return React;
        if (name === 'react-dom') return ReactDOMCore;
        if (name === 'react/jsx-runtime') return ReactJSXRuntime;
        throw new Error('Unexpected beUI runtime dependency: ' + name);
      };
      ${bundled}
      return module.exports;
    })();
    ${end}`;
const htmlPath = resolve(root, 'index.html');
const html = await readFile(htmlPath, 'utf8');
const start = html.indexOf(begin);
const finish = html.indexOf(end, start);
if (start < 0 || finish < 0) throw new Error('Missing beUI bundle markers in index.html');
await writeFile(htmlPath, html.slice(0, start) + generated + html.slice(finish + end.length));
console.log(`Embedded official beUI Select (${Math.round(bundled.length / 1024)} KiB); source hashes verified.`);
