#!/bin/sh
cd ~/project/packages/user-service

CYPRESS_OPTS="--reporter ../../node_modules/cypress-circleci-reporter --reporter-options resultsDir=./cypress/results"

if [[ $MS_EDGE == "1" ]]; then
  echo "Using Microsoft Edge"
  CYPRESS_OPTS+=" --browser edge"
fi

COMMAND="xargs -I {} npx concurrently --raw --kill-others --success first \"npm run start\" \"npx cypress run $CYPRESS_OPTS --spec {}\""

circleci tests glob "cypress/e2e/**/*.cy.js" | circleci tests run --command="$COMMAND" --split-by=timings