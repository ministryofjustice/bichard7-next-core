#!/usr/bin/env bash

set -ex

IMAGES=(beanconnect bichard7-liberty conductor nginx-auth-proxy pncemulator ui user-service)

for image in "${IMAGES[@]}"; do
    if [[ "$(docker images -q $image 2> /dev/null)" == "" ]]; then
        echo "Fetching $image..."
        scripts/fetch-docker-image.sh $image
    fi
done

docker-compose --project-name bichard -f environment/docker-compose.yml up -d --wait

npm run conductor-setup
