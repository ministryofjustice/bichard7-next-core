#!/bin/bash

set -e

IMAGE="s3-web-proxy"

docker build -t $IMAGE .

if [ "$SKIP_GOSS" = "true" ]; then
  echo "Skipping dgoss tests"
else
  dgoss run \
    -e AWS_ACCESS_KEY_ID='' \
		-e AWS_SECRET_ACCESS_KEY='' \
		-e S3_BUCKET_NAME='dummy' \
		-e HTPASSWD=test $IMAGE
fi
