#!/bin/bash


if [[ ! -d "packages/e2e-test/screenshots" ]]; then
  echo "Screenshots directory doesn't exist"
  exit 0
fi

for file in packages/e2e-test/screenshots/*
do
  tar -czf ${file}.tar.gz $file
done
