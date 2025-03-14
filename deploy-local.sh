#!/bin/bash

# Exit on error
set -e

echo "Starting local deployment process..."

# Determine the correct directory structure
if [ -d "src" ]; then
  echo "Found src directory at root level"
  ROOT_DIR="."
elif [ -d "personal-website/src" ]; then
  echo "Found src directory in personal-website"
  ROOT_DIR="personal-website"
else
  echo "Error: Could not find src directory"
  exit 1
fi

# Navigate to the root directory
cd "$ROOT_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm ci
fi

# Build the project
echo "Building the project..."
NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS="--max_old_space_size=4096" npm run build -- --no-lint

# Ensure the out directory exists
if [ ! -d "out" ]; then
  echo "Error: Build did not create an 'out' directory"
  exit 1
fi

# Create CNAME file
echo "Creating CNAME file..."
echo "yousefowili.me" > out/CNAME

# Create .nojekyll file
echo "Creating .nojekyll file..."
touch out/.nojekyll

# Copy the files to the root of the repository
echo "Copying files to repository root..."
cp -r out/* ..

# Go back to the repository root
cd ..

# Add all files to git
echo "Adding files to git..."
git add .

# Commit the changes
echo "Committing changes..."
git commit -m "Manual deployment $(date)"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo "Deployment complete! Your site should be live shortly at https://yousefowili.me" 