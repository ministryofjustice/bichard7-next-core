#!/usr/bin/env bash

set -e

export readonly REPOSITORY_NAME="conductor"
export readonly DOCKER_IMAGE="conductor"

bash ../scripts/install_goss.sh
make -C ../ Conductor
bash ../scripts/push_image.sh
