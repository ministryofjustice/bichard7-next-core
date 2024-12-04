#!/bin/bash

ATTEMPTS=2
WORKSPACES=($(cat package.json | jq -r ".workspaces[]"))

for package in "${WORKSPACES[@]}"; do
  for i in $(seq 1 $ATTEMPTS); do
    eval npm run lint -w "$package"

    SUCCESS=$?
    if [ $SUCCESS -eq 0 ]; then
      break
    fi

    if [ $i -eq $ATTEMPTS ]; then
      echo ""
      echo "Tried to rerun lint and failed"
      exit 1
    fi

    echo ""
    echo "Attempting to lint $package again"

    sleep 2
  done
done
