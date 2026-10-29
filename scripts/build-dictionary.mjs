import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const extra = JSON.parse(await readFile(resolve(root, 'ux-dictionary-extra.json'), 'utf8'));
if (!extra || Array.isArray(extra) || typeof extra !== 'object') throw new Error('Invalid extra dictionary');
let count = 0;
for (const [language, entries] of Object.entries(extra)) {
  if (!language.trim() || !entries || Array.isArray(entries) || typeof entries !== 'object') throw new Error('Invalid dictionary language');
  for (const [key, value] of Object.entries(entries)) {
    if (!key.trim() || typeof value !== 'string' || !value.trim()) throw new Error(`Invalid translation: ${language}/${key}`);
    count++;
  }
}
const codePath = resolve(root, 'code.js');
const code = await readFile(codePath, 'utf8');
const begin = '// BEGIN GENERATED EXTRA DICTIONARY';
const end = '// END GENERATED EXTRA DICTIONARY';
const start = code.indexOf(begin);
const finish = code.indexOf(end, start);
if (start < 0 || finish < start) throw new Error('Missing extra dictionary markers');
const generated = `${begin}\n// Generated from ux-dictionary-extra.json; run npm run build:dictionary.\nconst extraUxDictionary = ${JSON.stringify(extra, null, 2)};\nfor (const [language, entries] of Object.entries(extraUxDictionary)) {\n    uxDictionary[language] = Object.assign({}, uxDictionary[language] || {}, entries);\n}\n${end}`;
await writeFile(codePath, code.slice(0, start) + generated + code.slice(finish + end.length));
console.log(`Embedded ${count} extra translations before lookup generation.`);
