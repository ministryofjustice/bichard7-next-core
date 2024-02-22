#!/usr/bin/env bash

set -e

IMAGES=($@)

for image in "${IMAGES[@]}"; do
    if [[ "$CI" == "true" || "$(docker images -q $image 2> /dev/null)" == "" ]]; then
        echo "Fetching $image..."
        scripts/fetch-docker-image.sh $image
    fi
done
