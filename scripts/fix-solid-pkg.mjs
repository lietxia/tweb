// Fix solid-js package.json main/module fields to point to browser builds
// instead of server builds. Required for Vite 8 / Rolldown which uses
// main/module fields over exports conditions during dep pre-bundling.
import {readFileSync, writeFileSync, existsSync} from 'fs';
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

const fixes = [
  // [relative path from root, correct main, correct module]
  ['src/vendor/solid/package.json', './dist/solid.cjs', './dist/solid.js'],
  ['src/vendor/solid/web/package.json', './dist/web.cjs', './dist/web.js'],
  ['src/vendor/solid/store/package.json', './dist/store.cjs', './dist/store.js'],
  ['node_modules/solid-js/package.json', './dist/solid.cjs', './dist/solid.js'],
  ['node_modules/solid-js/web/package.json', './dist/web.cjs', './dist/web.js'],
  ['node_modules/solid-js/store/package.json', './dist/store.cjs', './dist/store.js'],
];

for(const [relPath, main, mod] of fixes) {
  const absPath = resolve(rootDir, relPath);
  if(!existsSync(absPath)) continue;
  const d = JSON.parse(readFileSync(absPath, 'utf8'));
  if(d.main === main && d.module === mod) continue;
  d.main = main;
  d.module = mod;
  writeFileSync(absPath, JSON.stringify(d, null, 2) + '\n');
  console.log(`Fixed ${relPath}: main=${main} module=${mod}`);
}
