#!/usr/bin/env bash

set -e

SCRIPTS_DIR=$(dirname "$0")
REPO_ROOT=$(dirname "$SCRIPTS_DIR")

ASSETS_SOURCE="${REPO_ROOT}/node_modules/govuk-frontend/dist/govuk/assets"
ASSETS_DESTINATION="${REPO_ROOT}/public/"

if [ ! -d $ASSETS_SOURCE ]; then
    echo "GOVUK assets couldn't be found - have you run 'npm install'?" >&2
    exit 1
fi

cp -Rv $ASSETS_SOURCE/* $ASSETS_DESTINATION
