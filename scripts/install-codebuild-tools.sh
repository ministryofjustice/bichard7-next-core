#!/usr/bin/env bash

set -e

## Install goss/trivy
curl -L https://github.com/aelsabbahy/goss/releases/latest/download/goss-linux-amd64 -o /usr/local/bin/goss
chmod +rx /usr/local/bin/goss
curl -L https://github.com/aelsabbahy/goss/releases/latest/download/dgoss -o /usr/local/bin/dgoss
chmod +rx /usr/local/bin/dgoss

export GOSS_PATH="/usr/local/bin/goss"

install_trivy() {
  echo "Pulling trivy binary from s3"
  aws s3 cp \
    s3://"${ARTIFACT_BUCKET}"/trivy/binary/trivy_latest_Linux-64bit.rpm \
    .

  echo "Installing trivy binary"
  rpm -ivh trivy_latest_Linux-64bit.rpm
}

pull_trivy_db() {
  echo "Pulling trivy db from s3..."
  aws s3 cp \
    s3://"${ARTIFACT_BUCKET}"/trivy/db/trivy-offline.db.tgz \
    trivy/db/

  echo "Extracting trivy db to $(pwd)/trivy/db/"
  tar -xvf trivy/db/trivy-offline.db.tgz -C trivy/db/
}

mkdir -p trivy/db
install_trivy
pull_trivy_db
