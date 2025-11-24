#!/usr/bin/env tsx

/**
 * Database Migration Runner
 *
 * Runs Supabase migrations against a specified database.
 * Used in CI/CD pipelines for automated deployments.
 *
 * Usage:
 *   npx tsx scripts/run-migrations.ts <environment>
 *   npx tsx scripts/run-migrations.ts staging
 *   npx tsx scripts/run-migrations.ts production
 *
 * Environment variables required:
 *   - STAGING_DATABASE_URL or PRODUCTION_DATABASE_URL
 *   - SUPABASE_ACCESS_TOKEN
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface MigrationResult {
  success: boolean;
  output: string;
  error?: string;
}

async function runMigrations(environment: string): Promise<MigrationResult> {
  console.log(`🔄 Running database migrations for ${environment}...`);

  // Get database URL from environment
  const dbUrlKey = `${environment.toUpperCase()}_DATABASE_URL`;
  const dbUrl = process.env[dbUrlKey];

  if (!dbUrl) {
    return {
      success: false,
      output: '',
      error: `Missing environment variable: ${dbUrlKey}`,
    };
  }

  if (!process.env.SUPABASE_ACCESS_TOKEN) {
    return {
      success: false,
      output: '',
      error: 'Missing environment variable: SUPABASE_ACCESS_TOKEN',
    };
  }

  try {
    // Run migrations using Supabase CLI
    const { stdout, stderr } = await execAsync(
      `npx supabase db push --db-url "${dbUrl}"`,
      {
        env: {
          ...process.env,
          SUPABASE_ACCESS_TOKEN: process.env.SUPABASE_ACCESS_TOKEN,
        },
      }
    );

    console.log('✅ Migrations completed successfully');
    console.log(stdout);

    if (stderr) {
      console.warn('⚠️ Warning output:', stderr);
    }

    return {
      success: true,
      output: stdout,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Migration failed:', errorMessage);

    return {
      success: false,
      output: '',
      error: errorMessage,
    };
  }
}

async function verifyConnection(environment: string): Promise<boolean> {
  console.log(`🔍 Verifying database connection for ${environment}...`);

  const dbUrlKey = `${environment.toUpperCase()}_DATABASE_URL`;
  const dbUrl = process.env[dbUrlKey];

  if (!dbUrl) {
    console.error(`❌ Missing environment variable: ${dbUrlKey}`);
    return false;
  }

  try {
    // Simple connection test using psql
    await execAsync(`psql "${dbUrl}" -c "SELECT 1" > /dev/null 2>&1`);
    console.log('✅ Database connection verified');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed');
    return false;
  }
}

async function main() {
  const environment = process.argv[2];

  if (!environment) {
    console.error('❌ Error: Environment argument required');
    console.error('Usage: npx tsx scripts/run-migrations.ts <environment>');
    console.error('Example: npx tsx scripts/run-migrations.ts staging');
    process.exit(1);
  }

  const validEnvironments = ['staging', 'production', 'local'];
  if (!validEnvironments.includes(environment)) {
    console.error(`❌ Error: Invalid environment "${environment}"`);
    console.error(`Valid environments: ${validEnvironments.join(', ')}`);
    process.exit(1);
  }

  console.log('📦 VISION Platform - Database Migration Runner');
  console.log(`Environment: ${environment}`);
  console.log('─'.repeat(50));

  // Verify database connection first
  const connectionOk = await verifyConnection(environment);
  if (!connectionOk) {
    console.error('❌ Cannot proceed without database connection');
    process.exit(1);
  }

  // Run migrations
  const result = await runMigrations(environment);

  if (!result.success) {
    console.error('❌ Migration failed');
    if (result.error) {
      console.error('Error details:', result.error);
    }
    process.exit(1);
  }

  console.log('✅ All migrations completed successfully');
  console.log('─'.repeat(50));
}

main();
