#!/bin/bash

# Remove existing dist folder
rm -rf ./dist

# Build the code with esBuild
node build.package.js

# Generate defintion files with tsc
echo "Generating types..."
npx -y tsc --emitDeclarationOnly --outDir dist/definitions >/dev/null || true

echo "Moving types..."
cp -R ./dist/definitions/* ./dist
rm -rf ./dist/definitions
