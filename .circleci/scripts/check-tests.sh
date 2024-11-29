#!/bin/bash

# $1 = The package the tests live in
# $2 = The glob we are looking for eg "features/**/*.feature"

# We search for files that been run and failed.
# We put the failed files in `tmp/tests.txt`.
# When a parallel job runs and if it contains tests it will continue.
# If the job doesn't contain any tests, it will stop the job.

cd ~/project/packages/$1

mkdir -p ./tmp && \
>./tmp/tests.txt && \
circleci tests glob "$2" | circleci tests run --command=">./tmp/tests.txt xargs echo" --split-by=timings

[ -s tmp/tests.txt ] || circleci-agent step halt
