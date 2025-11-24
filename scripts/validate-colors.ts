#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { sync as globSync } from 'glob';

const INLINE_COLOR_PATTERNS: RegExp[] = [
  /#[0-9A-Fa-f]{3,6}/,
  /rgb[a]?\([^)]+\)/,
  /hsl[a]?\([^)]+\)/,
  /\b(?:text|bg|border|ring|fill|stroke)-\[(?:#|0x)[^\]]+\]/,
  /\b(?:text|bg|border|ring|fill|stroke)-[^\s]+\/\d+\b/,
  /\b(?:text|bg|border|ring|fill|stroke)-(?!vision-)[a-z]+-\d+\b/,
];

function gatherFiles(stagedOnly: boolean): string[] {
  if (stagedOnly) {
    const staged = execSync('git diff --cached --name-only --diff-filter=ACM')
      .toString()
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((file) => path.resolve(process.cwd(), file))
      .filter((file) => /\.(tsx|ts|jsx|js)$/.test(file));

    return staged;
  }

  return globSync(path.join('apps', 'shell', 'src', '**', '*.{ts,tsx}'), {
    ignore: [
      '**/node_modules/**',
      '**/*.test.{ts,tsx}',
      '**/*.stories.{ts,tsx}',
      '**/design-system/theme/**',
      '**/lib/color-mappings.ts',
    ],
  });
}

function validateColors(stagedOnly = false) {
  const files = gatherFiles(stagedOnly);
  const violations: Array<{ file: string; line: number; match: string }> = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      INLINE_COLOR_PATTERNS.forEach((pattern) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach((value) => {
            violations.push({
              file,
              line: index + 1,
              match: value,
            });
          });
        }
      });
    });
  }

  if (violations.length > 0) {
    console.error('\n❌ Color Token Violations Found:\n');
    violations.forEach((v) => {
      console.error(`  ${v.file}:${v.line} — "${v.match}"`);
    });
    console.error('\n⚠️  Only Bold Color System tokens are allowed (vision-*)');
    console.error('   Replace inline colors/generic Tailwind tokens with the approved set.\n');
    process.exit(1);
  }

  console.log('✅ Color token validation passed! No inline colors detected.');
}

const stagedOnly = process.argv.includes('--staged');
validateColors(stagedOnly);
