#!/usr/bin/env bash
set -e

IMAGES=(beanconnect pncemulator)

PLATFORM=$(uname -m)
if [ $PLATFORM != "arm64" ]; then
    IMAGES+=(bichard7-liberty conductor e2etests nginx-auth-proxy ui user-service)
fi

for image in "${IMAGES[@]}"; do
    if [[ "$(docker images -q $image 2> /dev/null)" == "" ]]; then
        echo "Fetching $image..."
        scripts/fetch-docker-image.sh $image
    fi
done

docker compose \
    --project-name bichard \
    -f environment/docker-compose.yml \
    -f environment/docker-compose-worker.yml \
    up -d --wait

npm run conductor-setup
