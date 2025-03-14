#!/bin/bash
set -e

echo "Building Next.js site..."
# Build from the root directory where package.json is located
npm run build

echo "Copying build output to repository root..."
# Copy from the out directory to the repository root
cp -r out/* .
echo "yousefowili.me" > CNAME
touch .nojekyll

echo "Committing and pushing changes..."
git add .
git commit -m "Deploy site $(date)"
git push origin main

echo "Deployment complete!" 