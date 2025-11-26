#!/bin/bash

# Get the owner user ID from the database
OWNER_ID=$(node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

(async () => {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('email', 'owner@test.com')
    .single();

  if (data) {
    console.log(data.id);
  }
})();
")

# Export for tests
export TEST_USER_ID="$OWNER_ID"
export TEST_USER_EMAIL="owner@test.com"

# Run tests
pnpm test:run "$@"
