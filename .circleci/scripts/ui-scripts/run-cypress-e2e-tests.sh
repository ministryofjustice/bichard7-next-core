#!/bin/sh
cd ~/project/packages/ui

CYPRESS_OPTS="--config baseUrl=https://localhost:4443 --reporter ../../node_modules/cypress-circleci-reporter --reporter-options resultsDir=./cypress/results"

if [[ $MS_EDGE == "true" ]]; then
  CYPRESS_OPTS+=" --browser edge"
fi

TEST_PATTERN="cypress/e2e/**/*.cy.ts"
CYPRESS_CMD="xargs npx cypress run $CYPRESS_OPTS --spec"

if [[ $API == "true" ]]; then
  echo "Running tests (including API)..."
  circleci tests glob "$TEST_PATTERN" | circleci tests run --command="$CYPRESS_CMD" --split-by=timings
else
  echo "Running tests (excluding API)..."
  circleci tests glob "$TEST_PATTERN" | \
    grep -v '\.api\.cy\.ts$' | \
    circleci tests run --command="$CYPRESS_CMD" --split-by=timings
fi
