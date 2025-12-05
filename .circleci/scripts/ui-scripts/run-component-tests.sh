#!/bin/sh
cd ~/project/packages/ui

options="--component"

circleci tests glob "cypress/component/**/*.cy.tsx" | tr [:space:] "," | sed 's/,$//g' | circleci tests run --command="xargs npx cypress run ${options} --spec"
