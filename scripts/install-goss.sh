#!/usr/bin/env bash

set -e

curl -L https://github.com/aelsabbahy/goss/releases/latest/download/goss-linux-amd64 -o /usr/local/bin/goss
chmod +rx /usr/local/bin/goss
curl -L https://github.com/aelsabbahy/goss/releases/latest/download/dgoss -o /usr/local/bin/dgoss
chmod +rx /usr/local/bin/dgoss

export GOSS_PATH="/usr/local/bin/goss"
