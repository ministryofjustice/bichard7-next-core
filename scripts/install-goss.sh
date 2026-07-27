#!/usr/bin/env bash

set -e

GOSS_VERSION="v0.4.9"

## Install goss
curl -L https://github.com/aelsabbahy/goss/releases/download/$GOSS_VERSION/goss-linux-amd64 -o /usr/local/bin/goss
chmod +rx /usr/local/bin/goss
curl -L https://github.com/aelsabbahy/goss/releases/download/$GOSS_VERSION/dgoss -o /usr/local/bin/dgoss
chmod +rx /usr/local/bin/dgoss

export GOSS_PATH="/usr/local/bin/goss"
