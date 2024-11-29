#!/bin/bash

# $1 = The package the tests live in
# $2 = The glob we are looking for eg "features/**/*.feature"

cd ~/project/packages/$1

mkdir -p ./tmp && \
>./tmp/tests.txt && \
circleci tests glob "$2" | circleci tests run --command=">./tmp/tests.txt xargs echo" --split-by=timings

[ -s tmp/tests.txt ] || circleci-agent step halt
