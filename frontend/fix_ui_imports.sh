#!/bin/zsh

# This script fixes import paths in UI components

# Directory containing the UI components
UI_DIR="/Users/ngocp/Documents/projects/swot/frontend/app/components/ui"

# Loop through each file in the UI directory
for file in "$UI_DIR"/*.tsx; do
  if [ -f "$file" ]; then
    echo "Processing $file"
    # Replace @/app/lib/utils with ../../lib/utils
    sed -i '' 's|@/app/lib/utils|../../lib/utils|g' "$file"
  fi
done

echo "All imports have been fixed!"
