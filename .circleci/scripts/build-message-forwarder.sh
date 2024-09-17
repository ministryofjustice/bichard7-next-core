#!/usr/bin/env bash

echo `date`
echo $PWD
echo ""

phases=(1 2)

for phase in "${phases[@]}"; do
  success=false
  max_attempts=3
  attempt_num=1

  while [ $success = false ] && [ $attempt_num -le $max_attempts ]; do
    message_forwarder="phase-${phase}-message-forwarder"

    docker compose -f environment/docker-compose.yml build "$message_forwarder"

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
done

if [ $attempt_num -eq 4 ]; then
  echo ""
  echo "Failed to build message-forwarder"
  exit 1
fi
