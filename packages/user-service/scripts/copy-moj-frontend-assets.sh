#!/usr/bin/env bash

set -e

SCRIPTS_DIR=$(dirname "$0")
REPO_ROOT=$(dirname "$SCRIPTS_DIR")

MOJ_ASSETS_SOURCE="${REPO_ROOT}/node_modules/@ministryofjustice/frontend/moj/assets/*"
MOJ_ASSETS_DESTINATION="${REPO_ROOT}/public/moj_assets"

if [ ! -d $MOJ_ASSETS_SOURCE ]; then
    echo "MOJ assets couldn't be found - have you run 'npm install'?" >&2
    exit 1
fi

rm -rf $MOJ_ASSETS_DESTINATION
mkdir -p $MOJ_ASSETS_DESTINATION
cp -Rv $MOJ_ASSETS_SOURCE $MOJ_ASSETS_DESTINATION