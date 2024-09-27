#!/bin/sh

set -e

echo "Building UI ..."

cd ~/packages/ui
# Build UI
make build
