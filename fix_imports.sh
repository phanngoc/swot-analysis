#!/bin/bash
# This script fixes import paths in UI components

# Define the files to fix
files=("badge.tsx" "button.tsx" "card.tsx" "input.tsx" "textarea.tsx" "select.tsx" "separator.tsx" "tabs.tsx" "label.tsx")

# Loop through each file and fix the import path
for file in "${files[@]}"; do
    filepath="/Users/ngocp/Documents/projects/swot/frontend/app/components/ui/$file"
    if [ -f "$filepath" ]; then
        # Replace the import with the relative path version
        sed -i '' 's|import { cn } from "@/app/lib/utils"|import { cn } from "../../lib/utils"|g' "$filepath"
        echo "Fixed import in $file"
    else
        echo "File not found: $file"
    fi
done

echo "All imports fixed!"
