#!/bin/bash

# Script to create 2911-design-system-complete.zip
# Contains the complete design system and Storybook configuration

ZIP_NAME="2911-design-system-complete.zip"
TEMP_DIR=$(mktemp -d)

echo "Creating design system zip file..."

# Copy design-system folder
cp -r src/design-system "$TEMP_DIR/"

# Copy .storybook folder
cp -r .storybook "$TEMP_DIR/"

# Copy global.css
mkdir -p "$TEMP_DIR/src"
cp src/global.css "$TEMP_DIR/src/"

# Copy package.json (for reference)
cp package.json "$TEMP_DIR/"

# Copy tsconfig.json (for reference)
cp tsconfig.json "$TEMP_DIR/"

# Copy README files
if [ -f "src/design-system/README.md" ]; then
  cp src/design-system/README.md "$TEMP_DIR/"
fi

# Create zip file
cd "$TEMP_DIR"
zip -r "$OLDPWD/$ZIP_NAME" . > /dev/null
cd "$OLDPWD"

# Cleanup
rm -rf "$TEMP_DIR"

echo "✅ Created $ZIP_NAME"
echo "📦 Contains:"
echo "   - src/design-system/ (all components)"
echo "   - .storybook/ (Storybook configuration)"
echo "   - src/global.css"
echo "   - package.json & tsconfig.json (for reference)"

