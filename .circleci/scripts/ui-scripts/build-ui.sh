#!/bin/sh

set -e

echo "Building UI ..."

source ~/packages/ui
# Build UI
make build
