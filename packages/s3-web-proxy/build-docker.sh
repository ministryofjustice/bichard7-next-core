#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$REPO_ROOT"

IMAGE="s3-web-proxy"

docker build -f packages/s3-web-proxy/Dockerfile -t $IMAGE .

if [[ "$SKIP_GOSS" = "true" ]]; then
  echo "Skipping dgoss tests"
else
  dgoss run \
    -e AWS_ACCESS_KEY_ID='' \
		-e AWS_SECRET_ACCESS_KEY='' \
		-e S3_BUCKET_NAME='dummy' \
		-e HTPASSWD=test $IMAGE
fi
