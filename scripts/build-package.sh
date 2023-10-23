#!/bin/bash

# Remove existing core and common directories
rm -rf ./core
rm -rf ./common

# Build the common package with esBuild
cd packages/common
npm run clean
npm run build

# Generate common package definition files with tsc
echo "Generating types..."
npx -y tsc --emitDeclarationOnly --outDir dist/definitions >/dev/null || true

echo "Moving types..."
cp -R ./dist/definitions/* ./dist
rm -rf ./dist/definitions

cd -

# Build the core package with esBuild
cd packages/core
npm run clean
npm run build
node ../../scripts/fix-imports.js

# Generate core package definition files with tsc
echo "Generating types..."
npx -y tsc --emitDeclarationOnly --outDir dist/definitions >/dev/null || true

echo "Moving types..."
cp -R ./dist/definitions/phase1 ./dist
cp -R ./dist/definitions/types ./dist
rm -rf ./dist/definitions

cd -

cp -R ./packages/common/dist ./common
cp -R ./packages/core/dist ./core
