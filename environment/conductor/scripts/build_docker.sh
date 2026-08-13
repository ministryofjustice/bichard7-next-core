#!/usr/bin/env bash

set -e

export readonly REPOSITORY_NAME="conductor"
export readonly SOURCE_REPOSITORY_NAME="amazon-linux2023-base"
export readonly DOCKERFILE="environment/conductor/Dockerfile"

bash ../../../scripts/install_goss.sh
bash ../../../scripts/build_and_push_image.sh
