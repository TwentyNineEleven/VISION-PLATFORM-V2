#!/bin/bash

# Start Supabase for Testing
# This script starts a local Supabase instance for running tests

set -e

echo "🚀 Starting Supabase for testing..."

# Check if Supabase is already running
if docker ps | grep -q supabase_db; then
  echo "⚠️  Supabase containers already running"
  echo "Getting status..."
  npx supabase status
else
  echo "Starting Supabase..."
  npx supabase start
  
  echo ""
  echo "✅ Supabase started!"
  echo ""
  echo "📋 Status:"
  npx supabase status
  
  echo ""
  echo "📝 Next steps:"
  echo "1. Copy the API URL and anon key from above"
  echo "2. Update vitest.setup.real-db.ts with these values"
  echo "3. Run: pnpm tsx scripts/setup-test-db.ts"
  echo "4. Update vitest.config.ts to use vitest.setup.real-db.ts"
  echo "5. Run tests: pnpm test:run"
fi

