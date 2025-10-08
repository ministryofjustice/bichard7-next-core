#!/bin/sh
cd ~/project/packages/user-service

options="--reporter ../../node_modules/cypress-circleci-reporter --reporter-options resultsDir=./cypress/results"

if [[ $MS_EDGE == "true" ]]; then
  options+=" --browser edge"
fi

circleci tests glob "cypress/e2e/**/*.cy.js" | circleci tests run --command="xargs npx cypress run ${options} --spec" --split-by=timings
