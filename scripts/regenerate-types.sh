#!/bin/bash
# Regenerate Supabase TypeScript types after applying migrations

echo "🔄 Regenerating Supabase TypeScript types..."
npx supabase gen types typescript --project-id qhibeqcsixitokxllhom > apps/shell/src/types/supabase.ts

echo "✅ Types regenerated!"
echo ""
echo "📝 Next steps:"
echo "   git add apps/shell/src/types/supabase.ts"
echo "   git commit -m 'chore: Update Supabase types with Community Compass tables'"

