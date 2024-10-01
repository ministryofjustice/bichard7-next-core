#!/bin/sh
cd ~/project/packages/ui

TEST_FILES="$(circleci tests glob "/home/circleci/project/packages/ui/cypress/e2e/**/*.cy.ts" | circleci tests split --split-by=timings)"

options="--config baseUrl=https://localhost:4443 --spec ${TEST_FILES//$'\n'/','} --reporter cypress-circleci-reporter --reporter-options resultsDir=./cypress/results"
echo "test"
if [[ $MS_EDGE == "true" ]]; then
  npx cypress run --browser edge ${options}
else
  npx cypress run ${options}
fi
