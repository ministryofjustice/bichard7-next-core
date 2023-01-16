#!/bin/bash

set -e

echo "Creating tasks..."

curl --insecure -X POST \
  https://localhost:5001/api/metadata/taskdefs \
  -H 'Content-Type: application/json' \
  -d @conductor/tasks.json

echo "Creating workflows..."

WORKFLOWS="$(jq -s -c '.' conductor/workflows/*.json)"

curl --insecure -s -X PUT \
  https://localhost:5001/api/metadata/workflow \
  -H 'Content-Type: application/json' \
  -d "$WORKFLOWS" | jq
