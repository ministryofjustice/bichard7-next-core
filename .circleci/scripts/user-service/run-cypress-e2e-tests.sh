#!/bin/sh
cd ~/project/packages/user-service

options="--reporter ../../node_modules/cypress-circleci-reporter --reporter-options resultsDir=./cypress/results"

if [[ $MS_EDGE == "true" ]]; then
  options+=" --browser edge"
fi

COMMAND='xargs -I {} npx concurrently --raw --kill-others --success first "npm run start" "npm run cypress:run:file {} '$options'"'

circleci tests glob "cypress/e2e/**/*.cy.js" \
  | circleci tests run \
      --command="$COMMAND" \
      --split-by=timings