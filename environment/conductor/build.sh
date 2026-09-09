#!/bin/bash

set -ex

IMAGE="conductor"

if [ -z "$PLATFORM" ]; then
  PLATFORM=$(arch)
fi

docker build -t $IMAGE .
