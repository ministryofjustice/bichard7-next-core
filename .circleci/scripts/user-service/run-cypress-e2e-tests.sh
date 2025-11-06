#!/bin/sh
cd ~/project/packages/user-service

export NEXT_PUBLIC_INCORRECT_DELAY=0

CYPRESS_OPTS="--reporter ../../node_modules/cypress-circleci-reporter --reporter-options resultsDir=./cypress/results"

COMMAND="xargs -I {} npx concurrently --raw --kill-others --success first \"npm run start\" \"npx cypress run $CYPRESS_OPTS --spec {}\""

circleci tests glob "cypress/e2e/**/*.cy.js" | circleci tests run --command="$COMMAND" --split-by=timings