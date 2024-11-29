#!/bin/bash
cd ~/project/packages/e2e-test

mkdir -p ./tmp && \
>./tmp/tests.txt && \
circleci tests glob "features/**/*.feature" | circleci tests run --command=">./tmp/tests.txt xargs echo" --split-by=timings

[ -s tmp/tests.txt ] || circleci-agent step halt
