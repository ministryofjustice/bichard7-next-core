#!/bin/sh
cd ~/project/packages/ui

options="--reporter ../../node_modules/cypress-circleci-reporter --reporter-options resultsDir=./cypress/results"

if [[ $MS_EDGE == "true" ]]; then
  npx cypress run --component --browser edge ${options}
else
  npx cypress run --component ${options}
fi
