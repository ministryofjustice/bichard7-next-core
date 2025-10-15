#!/bin/sh
cd ~/project/packages/ui

options="--config baseUrl=https://localhost:4443 --reporter ../../node_modules/cypress-circleci-reporter --reporter-options resultsDir=./cypress/results"

if [[ $MS_EDGE == "true" ]]; then
  options+=" --browser edge"
fi

if [[ $API == "true" ]]; then
  TEST_PATTERN="cypress/e2e/**/*.cy.ts"
else
  TEST_PATTERN="cypress/e2e/**/!(*.api).cy.ts"
fi

echo "Running tests ($TEST_PATTERN)..."

circleci tests glob "$TEST_PATTERN" | circleci tests run --command="xargs npx cypress run ${options} --spec" --split-by=timings