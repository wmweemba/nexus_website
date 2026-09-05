#!/usr/bin/env node
// Measures the built output against docs/PERFORMANCE-BUDGET.md.
// Run via `npm run budget` (builds first) or standalone after a build.
import { gzipSync } from 'node:zlib';
import { readFileSync, statSync, globSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const BUDGETS = {
  criticalPathGzip: 100 * 1024,
  fontsTotal: 80 * 1024,
};

function findFiles(pattern) {
  try {
    return globSync(pattern, { cwd: DIST }).map((f) => join(DIST, f));
  } catch {
    return [];
  }
}

function gzipSize(path) {
  return gzipSync(readFileSync(path)).length;
}

function fmt(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

let failed = false;

try {
  statSync(DIST);
} catch {
  console.error(`No ${DIST}/ found — run \`npm run build\` first.`);
  process.exit(1);
}

const htmlFiles = findFiles('**/*.html');
const cssFiles = findFiles('**/*.css');
const jsFiles = findFiles('**/*.js');
const fontFiles = findFiles('**/*.woff2');

const criticalFiles = [...cssFiles, ...jsFiles];
const criticalGzip = criticalFiles.reduce((sum, f) => sum + gzipSize(f), 0);
const fontsTotal = fontFiles.reduce((sum, f) => sum + statSync(f).size, 0);

console.log('--- Performance budget check ---');
console.log(`HTML files: ${htmlFiles.length}`);
console.log(`CSS + JS critical path (gzip): ${fmt(criticalGzip)} / budget ${fmt(BUDGETS.criticalPathGzip)}`);
console.log(`JS files in dist: ${jsFiles.length}${jsFiles.length ? ' — ' + jsFiles.join(', ') : ' (none — zero third-party JS holds)'}`);
console.log(`Fonts total: ${fmt(fontsTotal)} / budget ${fmt(BUDGETS.fontsTotal)} (${fontFiles.length} files)`);

if (criticalGzip > BUDGETS.criticalPathGzip) {
  console.error(`FAIL: critical path exceeds ${fmt(BUDGETS.criticalPathGzip)} budget.`);
  failed = true;
}
if (fontsTotal > BUDGETS.fontsTotal) {
  console.error(`FAIL: fonts exceed ${fmt(BUDGETS.fontsTotal)} budget.`);
  failed = true;
}

if (failed) process.exit(1);
console.log('Budget check passed.');
