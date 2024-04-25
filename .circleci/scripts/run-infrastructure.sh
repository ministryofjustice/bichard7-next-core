#!/usr/bin/env bash

echo `date`
echo $PDW
echo "Skipping images: $1"
echo "Running: $2"
echo ""

success=false
max_attempts=3
attempt_num=1

while [ $success = false ] && [ $attempt_num -le $max_attempts ]; do

    SKIP_IMAGES=$1 npm run $2

    if [ $? -eq 0 ]; then
        success=true
    else
        echo ""
        echo "Failed, retrying..."
        sleep 10
        echo "Removing Beanconnect and PNC..."
        docker rm -f bichard-beanconnect-1 bichard-pnc-1
        sleep 1
        ((attempt_num++))
        echo "Retrying, attempt $attempt_num ..."
    fi
done

if [ $attempt_num -eq 4 ]; then
  echo ""
  echo "Failed to start infrastructre"
  exit 1
fi
