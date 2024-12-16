#!/bin/bash

TAGS=$1

NEXTUI=${NEXTUI:-"false"}
MS_EDGE=${MS_EDGE:-"false"}

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
echo "Phase 3 canary ratio: $PHASE3_CORE_CANARY_RATIO"
echo "MS EDGE: $MS_EDGE"
echo "---------------------------------------------"

CMD="../../node_modules/.bin/cucumber-js --require steps/index.ts --require-module ts-node/register --retry 5 --no-strict --exit --publish-quiet --format @cucumber/pretty-formatter  --format junit:./test-results/results/report.xml --tags '${TAGS}'"

which circleci > /dev/null
if [ $? -eq 0 ]; then
  circleci tests glob "features/**/*.feature" | circleci tests run --command="xargs ${CMD}" --split-by=timings
else
  CHUNK=${CHUNK:-$(find features -iname '*.feature' | sort | awk "(NR % $TOTAL_CHUNKS == $CHUNK_NUMBER)" | paste -d ' ' -s -)}

  CMD+=" ${CHUNK}"

  eval "$CMD"
fi

cucumber_exit_code=$?

node ./scripts/add-filename-to-test-results-report.js

exit "$cucumber_exit_code"
