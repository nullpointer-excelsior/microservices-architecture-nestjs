#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['apps', 'libs'];
const PATTERNS = [
    /forRoutes\(([^)]*)\)/g,
];

const NAMED_WILDCARD = /\{\*[A-Za-z_][A-Za-z0-9_]*\}/;
const UNNAMED_WILDCARD = /['"][^'"]*\*(?![A-Za-z_])[^'"]*['"]/;

function walk(dir, out = []) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const stat = statSync(full);
        if (stat.isDirectory()) {
            if (entry === 'node_modules' || entry === 'dist' || entry.startsWith('.')) continue;
            walk(full, out);
        } else if (full.endsWith('.ts') && !full.endsWith('.spec.ts')) {
            out.push(full);
        }
    }
    return out;
}

const files = ROOTS.flatMap((root) => walk(root));
const findings = [];

for (const file of files) {
    const src = readFileSync(file, 'utf8');
    const lines = src.split(/\r?\n/);
    lines.forEach((line, idx) => {
        if (!/forRoutes\(/.test(line)) return;
        if (UNNAMED_WILDCARD.test(line) && !NAMED_WILDCARD.test(line)) {
            findings.push({ file, line: idx + 1, text: line.trim() });
        }
    });
}

if (findings.length === 0) {
    console.log('No LegacyRouteConverter warnings expected. All forRoutes() use named wildcards.');
    process.exit(0);
}

console.error(`Found ${findings.length} route(s) with unnamed wildcards:`);
for (const f of findings) {
    console.error(`  ${f.file}:${f.line}  ${f.text}`);
}
process.exit(1);
