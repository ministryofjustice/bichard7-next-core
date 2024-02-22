#!/usr/bin/env bash

set -e

echo `date`

echo "Skipping images: $1"
echo "Running: $2"
echo ""

RETRIES=1
until SKIP_IMAGES=$1 npm run $2
do
    if [[ $RETRIES -gt 3 ]]; then break; fi
    sleep 10
    echo "Removing Beanconnect and PNC..."
    docker rm -f bichard-beanconnect-1 bichard-pnc-1
    sleep 1
    echo "Retrying, attempt $RETRIES ..."
    ((RETRIES++))
done
