#!/bin/sh
cd ~/project/packages/ui

options="--component --reporter ../../node_modules/cypress-circleci-reporter --reporter-options resultsDir=./cypress/results"

if [[ $MS_EDGE == "true" ]]; then
  options+=" --browser edge"
fi

circleci tests glob "cypress/component/**/*.cy.tsx" | circleci tests run --command="xargs npx cypress run ${options} --spec" --verbose
