#!/bin/bash

set -e

URL=${CONDUCTOR_URL:-http://localhost:5002/api}
USERNAME=${CONDUCTOR_USERNAME:-bichard}
PASSWORD=${CONDUCTOR_PASSWORD:-password}

echo "Creating tasks..."

curl --insecure -X POST \
  -u "${USERNAME}:${PASSWORD}" \
  "${URL}/metadata/taskdefs" \
  -H 'Content-Type: application/json' \
  -d @conductor/tasks.json

echo "Creating workflows..."

WORKFLOWS="$(jq -s -c '.' conductor/workflows/*.json)"

curl --insecure -s -X PUT \
  -u "${USERNAME}:${PASSWORD}" \
  "${URL}/metadata/workflow" \
  -H 'Content-Type: application/json' \
  -d "$WORKFLOWS" | jq

echo "Creating event handlers..."

curl --insecure -s -X POST \
  -u "${USERNAME}:${PASSWORD}" \
  "${URL}/event" \
  -H 'Content-Type: application/json' \
  -d @conductor/event-handlers/handleNewComparisonMessage.json | jq
