#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import pkg from 'glob';
const { sync: globSync } = pkg;

const SEMANTIC_ALLOWLIST = [
  // Theme semantic tokens powered by CSS variables
  'primary',
  'secondary',
  'muted',
  'accent',
  'destructive',
  'card',
  'background',
  'foreground',
  'border',
  'input',
  'ring',
  // Platform semantic tokens
  'success',
  'warning',
  'error',
  'info',
  'premium',
  // Utility tokens that are not colors
  'offset',
];

const SEMANTIC_ALLOWLIST_PATTERN = SEMANTIC_ALLOWLIST.join('|');

const NON_COLOR_UTILITY_PATTERNS: RegExp[] = [
  // Border widths (including directional variants) are not colors
  /^border-(?:[trblxy]-)?\d+(?:\/\d+)?$/,
  // Ring widths and offsets
  /^ring-(?:offset-)?\d+(?:\/\d+)?$/,
];

const INLINE_COLOR_PATTERNS: RegExp[] = [
  /#[0-9A-Fa-f]{3,6}/g,
  /rgb[a]?\([^)]+\)/g,
  /hsl[a]?\([^)]+\)/g,
  /\b(?:text|bg|border|ring|fill|stroke)-\[(?:#|0x)[^\]]+\]/g,
  // Tailwind color utilities that include opacity modifiers
  new RegExp(
    `\\b(?:text|bg|border|ring|fill|stroke)-(?!vision-)(?!${SEMANTIC_ALLOWLIST_PATTERN})([^\\s]+/\\d+)\\b`,
    'g',
  ),
  // Tailwind palette utilities with numeric steps (e.g., gray-500)
  new RegExp(
    `\\b(?:text|bg|border|ring|fill|stroke)-(?!vision-)(?!${SEMANTIC_ALLOWLIST_PATTERN})([a-z-]+-\\d+)\\b`,
    'g',
  ),
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
            if (NON_COLOR_UTILITY_PATTERNS.some((nonColor) => nonColor.test(value))) {
              return;
            }
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
    console.error(`Total violations: ${violations.length}\n`);
    violations.forEach((v) => {
      console.error(`  ${v.file}:${v.line} — "${v.match}"`);
    });

    const groupedByMatch = violations.reduce<Record<string, number>>((acc, violation) => {
      acc[violation.match] = (acc[violation.match] ?? 0) + 1;
      return acc;
    }, {});

    const groupedSummary = Object.entries(groupedByMatch).sort(([, aCount], [, bCount]) => bCount - aCount);

    console.error('\n📊 Violation Counts by Token:');
    groupedSummary.forEach(([token, count]) => {
      console.error(`  ${token}: ${count}`);
    });

    console.error('\n⚠️  Only Bold Color System tokens are allowed (vision-*)');
    console.error('   Replace inline colors/generic Tailwind tokens with the approved set.\n');
    // Use process.exitCode for proper Node.js termination in TypeScript
    process.exitCode = 1;
    return;
  }

  console.log('✅ Color token validation passed! No inline colors detected.');
}

const stagedOnly = process.argv.includes('--staged') || !process.argv.includes('--all');
validateColors(stagedOnly);
