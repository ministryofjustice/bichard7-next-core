#!/bin/bash

if [[ ! -d "packages/e2e-test/screenshots" ]]; then
  echo "Screenshots directory doesn't exist"
  exit 0
fi

mkdir ./saved_artifacts

mv packages/e2e-test/screenshots/*.tar.gz ./saved_artifacts/
