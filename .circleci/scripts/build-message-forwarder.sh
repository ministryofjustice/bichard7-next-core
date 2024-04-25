#!/usr/bin/env bash

echo `date`
echo $PWD
echo ""

success=false
max_attempts=3
attempt_num=1

while [ $success = false ] && [ $attempt_num -le $max_attempts ]; do

    docker compose -f environment/docker-compose.yml build message-forwarder

    if [ $? -eq 0 ]; then
        success=true
    else
        echo ""
        echo "Failed, retrying..."
        sleep 10
        ((attempt_num++))
        echo "Retrying, attempt $attempt_num ..."
    fi
done

if [ $attempt_num -eq 4 ]; then
  echo ""
  echo "Failed to build message-forwarder"
  exit 1
fi
