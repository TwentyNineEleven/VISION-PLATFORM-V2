#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import glob from 'glob';

const globSync = glob.sync;

/**
 * VISION Platform V2 - Component Validation Script
 *
 * Validates that all components use Glow UI design system components
 * instead of native HTML form elements.
 *
 * Forbidden Elements:
 * - <button> → Use <GlowButton>
 * - <input> → Use <GlowInput> (except type="hidden")
 * - <select> → Use <GlowSelect>
 * - <textarea> → Use <GlowTextarea>
 *
 * Reference: documentation/platform/VISION_PLATFORM_VALIDATION_AGENT_PROMPT.md
 */

interface Violation {
  file: string;
  line: number;
  element: string;
  suggestion: string;
  context: string;
}

interface ComponentPattern {
  pattern: RegExp;
  element: string;
  replacement: string;
  exceptions?: RegExp[];
}

// Component patterns to detect native HTML form elements
const COMPONENT_PATTERNS: ComponentPattern[] = [
  {
    pattern: /<button\s+/gi,
    element: 'button',
    replacement: 'GlowButton',
    exceptions: [
      // Allow button in GlowButton component itself
      /GlowButton\.tsx$/,
      // Allow in test files
      /\.test\.tsx?$/,
      // Allow in story files
      /\.stories\.tsx?$/,
    ],
  },
  {
    pattern: /<input\s+/gi,
    element: 'input',
    replacement: 'GlowInput',
    exceptions: [
      // Allow input type="hidden"
      /type=["']hidden["']/i,
      // Allow in GlowInput component itself
      /GlowInput\.tsx$/,
      // Allow in test files
      /\.test\.tsx?$/,
      // Allow in story files
      /\.stories\.tsx?$/,
    ],
  },
  {
    pattern: /<select\s+/gi,
    element: 'select',
    replacement: 'GlowSelect',
    exceptions: [
      // Allow in GlowSelect component itself
      /GlowSelect\.tsx$/,
      // Allow in test files
      /\.test\.tsx?$/,
      // Allow in story files
      /\.stories\.tsx?$/,
    ],
  },
  {
    pattern: /<textarea\s+/gi,
    element: 'textarea',
    replacement: 'GlowTextarea',
    exceptions: [
      // Allow in GlowTextarea component itself
      /GlowTextarea\.tsx$/,
      // Allow in test files
      /\.test\.tsx?$/,
      // Allow in story files
      /\.stories\.tsx?$/,
    ],
  },
];

/**
 * Gather files to validate
 * If --staged flag is provided, only validate staged files
 * Otherwise, validate all component files in the shell app
 */
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

  // Validate all TypeScript/React files in the shell app
  return globSync(path.join('apps', 'shell', 'src', '**', '*.{ts,tsx}'), {
    ignore: [
      '**/node_modules/**',
      '**/*.test.{ts,tsx}',
      '**/*.stories.{ts,tsx}',
      '**/glow-ui/**', // Exclude Glow UI components themselves
    ],
  });
}

/**
 * Check if a file should be excluded based on component pattern exceptions
 */
function shouldExclude(file: string, line: string, pattern: ComponentPattern): boolean {
  if (!pattern.exceptions) return false;

  return pattern.exceptions.some((exception) => {
    // Check file path exceptions
    if (exception.source.includes('\\.(test|stories)\\.')) {
      return exception.test(file);
    }
    // Check line content exceptions (e.g., type="hidden")
    return exception.test(line);
  });
}

/**
 * Get contextual suggestion for component replacement
 */
function getReplacementSuggestion(element: string, line: string): string {
  const trimmedLine = line.trim();

  switch (element) {
    case 'button':
      return `<GlowButton variant="primary" size="default">...</GlowButton>`;

    case 'input':
      // Check for specific input types
      if (/type=["']email["']/i.test(trimmedLine)) {
        return `<GlowInput type="email" placeholder="..." />`;
      }
      if (/type=["']password["']/i.test(trimmedLine)) {
        return `<GlowInput type="password" placeholder="..." />`;
      }
      if (/type=["']text["']/i.test(trimmedLine)) {
        return `<GlowInput type="text" placeholder="..." />`;
      }
      if (/type=["']number["']/i.test(trimmedLine)) {
        return `<GlowInput type="number" placeholder="..." />`;
      }
      return `<GlowInput type="text" placeholder="..." />`;

    case 'select':
      return `<GlowSelect label="..." onChange={...}>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</GlowSelect>`;

    case 'textarea':
      return `<GlowTextarea placeholder="..." rows={4} />`;

    default:
      return `Use Glow${element.charAt(0).toUpperCase() + element.slice(1)} component`;
  }
}

/**
 * Validate component usage in files
 */
function validateComponents(stagedOnly = false): void {
  const files = gatherFiles(stagedOnly);
  const violations: Violation[] = [];

  console.log(`\n🔍 Validating component usage in ${files.length} file(s)...\n`);

  for (const file of files) {
    if (!fs.existsSync(file)) continue;

    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      COMPONENT_PATTERNS.forEach((pattern) => {
        // Skip if line should be excluded
        if (shouldExclude(file, line, pattern)) {
          return;
        }

        const matches = line.match(pattern.pattern);
        if (matches) {
          violations.push({
            file: path.relative(process.cwd(), file),
            line: index + 1,
            element: pattern.element,
            suggestion: getReplacementSuggestion(pattern.element, line),
            context: line.trim().substring(0, 80),
          });
        }
      });
    });
  }

  // Report results
  if (violations.length > 0) {
    console.error('❌ Component Usage Violations Found:\n');

    // Group violations by file
    const violationsByFile = violations.reduce((acc, v) => {
      if (!acc[v.file]) acc[v.file] = [];
      acc[v.file].push(v);
      return acc;
    }, {} as Record<string, Violation[]>);

    Object.entries(violationsByFile).forEach(([file, fileViolations]) => {
      console.error(`\n📄 ${file}:`);
      fileViolations.forEach((v) => {
        console.error(`  Line ${v.line}: <${v.element}> element detected`);
        console.error(`    Context: ${v.context}${v.context.length === 80 ? '...' : ''}`);
        console.error(`    Replace with: ${v.suggestion}`);
      });
    });

    console.error('\n⚠️  Only Glow UI components are allowed in the VISION Platform.');
    console.error('   Replace native HTML form elements with Glow UI equivalents:\n');
    console.error('   • <button>   → <GlowButton>');
    console.error('   • <input>    → <GlowInput>');
    console.error('   • <select>   → <GlowSelect>');
    console.error('   • <textarea> → <GlowTextarea>\n');
    console.error(`   Reference: apps/shell/src/components/glow-ui/\n`);
    console.error(`   Total violations: ${violations.length}\n`);

    process.exit(1);
  }

  console.log('✅ Component validation passed! All components use Glow UI design system.\n');
}

// Parse command line arguments
const stagedOnly = process.argv.includes('--staged');
const helpRequested = process.argv.includes('--help') || process.argv.includes('-h');

if (helpRequested) {
  console.log(`
VISION Platform V2 - Component Validation Script

Usage:
  pnpm validate:components           Validate all component files
  pnpm validate:components --staged  Validate only staged files (for pre-commit)
  pnpm validate:components --help    Show this help message

Purpose:
  Ensures all components use Glow UI design system components instead of
  native HTML form elements.

Forbidden Elements:
  • <button>   → Use <GlowButton>
  • <input>    → Use <GlowInput> (except type="hidden")
  • <select>   → Use <GlowSelect>
  • <textarea> → Use <GlowTextarea>

Exit Codes:
  0 - All validations passed
  1 - Violations found

Documentation:
  documentation/platform/VISION_PLATFORM_VALIDATION_AGENT_PROMPT.md
`);
  process.exit(0);
}

// Run validation
validateComponents(stagedOnly);
