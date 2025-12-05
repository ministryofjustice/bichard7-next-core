#!/bin/sh
cd ~/project/packages/user-service

CYPRESS_OPTS="resultsDir=./cypress/results"

COMMAND="xargs -I {} npx concurrently --raw --kill-others --success first \"npm run start\" \"npx cypress run $CYPRESS_OPTS --spec {}\""

circleci tests glob "cypress/e2e/**/*.cy.js" | circleci tests run --command="$COMMAND" --split-by=timings

