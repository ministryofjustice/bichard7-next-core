#!/bin/bash

declare -a images=("beanconnect" "pncemulator" "bichard7-liberty" "conductor" "e2etests" "nginx-auth-proxy" "ui" "user-service")
declare -i attempt=0

echo -n "Waiting for images"

while true
do
  found_all=true

  for image in "${images[@]}"
  do
    image_hash=$(docker images -q $image 2> /dev/null)
    if [[ -z "$image_hash" ]]; then
      found_all=false
      break
    fi
  done

  if [[ "$found_all" = "true" ]]; then
    break
  fi

  echo -n "."
  attempt=attempt+1    
  sleep 3

  if [[ attempt -gt 150 ]]; then
    printf "\n\n'$image' image not found."
    exit 1
  fi
done