#!/usr/bin/env bash

set -e

pull_goss_binary() {
  echo "Pulling goss binary"
  aws s3 cp --quiet \
    s3://"${ARTIFACT_BUCKET}"/goss/goss \
    /usr/local/bin/goss
  chmod +rx /usr/local/bin/goss
}

pull_dgoss_binary() {
  echo "Pulling dgoss binary"
  aws s3 cp --quiet \
    s3://"${ARTIFACT_BUCKET}"/dgoss/dgoss \
    /usr/local/bin/dgoss

  chmod +rx /usr/local/bin/dgoss

}

pull_goss_binary
export GOSS_PATH="/usr/local/bin/goss"
pull_dgoss_binary
bash -c "dgoss run ${GOSS_ENV} ${DOCKER_IMAGE}"
