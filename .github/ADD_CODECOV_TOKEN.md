# Add Codecov Token to GitHub Secrets

## Your Codecov Token
```
f595c397-5568-4c77-bee2-a3d0bc275604
```

## Step-by-Step Instructions

### 1. Go to GitHub Repository Settings
Open this URL in your browser:
```
https://github.com/TwentyNineEleven/VISION-PLATFORM-V2/settings/secrets/actions
```

Or navigate manually:
1. Go to: https://github.com/TwentyNineEleven/VISION-PLATFORM-V2
2. Click **Settings** (top right)
3. Click **Secrets and variables** in left sidebar
4. Click **Actions**

### 2. Add New Secret
1. Click the green **New repository secret** button
2. Fill in the form:
   - **Name**: `CODECOV_TOKEN`
   - **Secret**: `f595c397-5568-4c77-bee2-a3d0bc275604`
3. Click **Add secret**

### 3. Verify Secret Was Added
You should see `CODECOV_TOKEN` listed in the repository secrets.

**Note**: You won't be able to view the secret value after creation (for security).

## What This Enables

✅ **Automatic Coverage Upload**: Every time CI runs, coverage reports will be uploaded to Codecov
✅ **Coverage Tracking**: Track coverage trends over time
✅ **PR Comments**: Codecov will comment on PRs with coverage changes
✅ **Coverage Badge**: Generate a badge for your README showing current coverage %

## Testing the Setup

After adding the secret, test it:

```bash
# Create test branch
git checkout -b test/codecov-integration

# Make a small change
echo "# Codecov Test" >> README.md

# Commit and push
git add README.md
git commit -m "test: verify Codecov integration"
git push origin test/codecov-integration
```

Then:
1. Create a PR on GitHub
2. Watch the CI workflow run
3. Check that coverage upload succeeds in the workflow logs
4. Visit https://app.codecov.io/gh/TwentyNineEleven/VISION-PLATFORM-V2 to see your coverage report

## Expected Results

In the GitHub Actions workflow logs, you should see:

```
✓ Upload coverage to Codecov
  Uploading coverage report...
  Coverage report uploaded successfully!
```

On Codecov dashboard, you'll see:
- Overall coverage percentage
- Coverage by file
- Coverage trends over time
- Untested lines highlighted

## Troubleshooting

**Problem**: Upload fails with "Error: 401 Unauthorized"
**Solution**: Verify token is correct and has upload permissions

**Problem**: Upload succeeds but no report on Codecov
**Solution**: Wait a few minutes for processing, then refresh Codecov dashboard

**Problem**: Secret not found error
**Solution**: Verify secret name is exactly `CODECOV_TOKEN` (case-sensitive)

## Next Steps After Setup

1. ✅ Add `CODECOV_TOKEN` to GitHub secrets
2. Test by creating a PR
3. Add coverage badge to README:
   ```markdown
   [![codecov](https://codecov.io/gh/TwentyNineEleven/VISION-PLATFORM-V2/branch/main/graph/badge.svg)](https://codecov.io/gh/TwentyNineEleven/VISION-PLATFORM-V2)
   ```
4. Configure coverage thresholds in Codecov settings
5. Setup Codecov checks to block PRs with decreasing coverage

---

**Quick Link**: [Add Secret Now →](https://github.com/TwentyNineEleven/VISION-PLATFORM-V2/settings/secrets/actions/new)
