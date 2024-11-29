#!/bin/bash
cd ~/project/packages/ui

mkdir -p ./tmp && \
>./tmp/tests.txt && \
circleci tests glob "cypress/e2e/**/*.cy.ts" | circleci tests run --command=">./tmp/tests.txt xargs echo" --split-by=timings

[ -s tmp/tests.txt ] || circleci-agent step halt
