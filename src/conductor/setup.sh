#!/bin/bash

set -e

echo "Creating tasks..."

curl -X POST \
  http://localhost:8080/api/metadata/taskdefs \
  -H 'Content-Type: application/json' \
  -d @src/conductor/tasks.json

echo "Creating workflows..."

curl -X PUT \
  http://localhost:8080/api/metadata/workflow \
  -H 'Content-Type: application/json' \
  -d @src/conductor/compare-batch-workflow.json

curl -X PUT \
  http://localhost:8080/api/metadata/workflow \
  -H 'Content-Type: application/json' \
  -d @src/conductor/rerun-all-workflow.json
