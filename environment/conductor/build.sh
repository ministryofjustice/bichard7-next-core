#!/bin/bash

set -ex

IMAGE="conductor"

if [ -z "$PLATFORM" ]; then
  PLATFORM=$(arch)
fi

docker build --build-arg CONDUCTOR_VERSION=$(cat conductor_version) -t $IMAGE .
