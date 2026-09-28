#!/bin/bash

set -e

IMAGE="nginx-auth-proxy"

if [ -z "$PLATFORM" ]; then
  PLATFORM=$(arch)
fi

docker build -t $IMAGE .
