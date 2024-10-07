#!/bin/bash

set -e

TAGS=$1
CHUNK=${CHUNK:-$(find features -iname '*.feature' | sort | awk "(NR % $TOTAL_CHUNKS == $CHUNK_NUMBER)" | paste -d ' ' -s -)}
NEXTUI=${NEXTUI:-"false"}

if [ "${NEXTUI}x" == "truex" ]; then
  TAGS="${TAGS} and @NextUI"
else
  TAGS="${TAGS} and not @ExcludeOnLegacyUI"
fi

echo "---------------------------------------------"
echo "Running tests using the following parameters:"
echo "Tags: ${TAGS}"
echo "Message entry point: $MESSAGE_ENTRY_POINT"
echo "Next UI: $NEXTUI"
echo "Phase 2 canary ratio: $PHASE2_CORE_CANARY_RATIO"
echo "MS EDGE: $MS_EDGE"
echo "---------------------------------------------"

../../node_modules/.bin/cucumber-js --require steps/index.ts --require-module ts-node/register --retry 5 --no-strict --exit --publish-quiet --format @cucumber/pretty-formatter  --format junit:./cucumber/results/test-results.xml --tags "${TAGS}" $CHUNK
