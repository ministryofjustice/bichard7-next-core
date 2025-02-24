#!/bin/sh
cd ~/project/packages/ui

options="--config baseUrl=https://localhost:4443 --reporter ../../node_modules/cypress-circleci-reporter --reporter-options resultsDir=./cypress/results"

if [[ $MS_EDGE == "true" ]]; then
  options+=" --browser edge"
fi


echo "Using API: $USE_API"
echo ""

circleci tests glob "cypress/e2e/**/*.cy.ts" | circleci tests run --command="xargs npx cypress run ${options} --spec" --split-by=timings
