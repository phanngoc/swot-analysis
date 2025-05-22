#!/bin/zsh

# This script fixes all import paths in .tsx files to use the correct path aliases
# To be run from the frontend directory

echo "Fixing import paths in all .tsx files..."

# Fix @/app/components paths
find ./app -name "*.tsx" -type f -exec sed -i '' 's|@/app/components|@/components|g' {} \;

# Fix @/app/store paths
find ./app -name "*.tsx" -type f -exec sed -i '' 's|@/app/store|@/store|g' {} \;

# Fix @/app/lib paths
find ./app -name "*.tsx" -type f -exec sed -i '' 's|@/app/lib|@/lib|g' {} \;

echo "All import paths have been fixed!"

# Make the script executable
chmod +x ./fix_imports.sh
