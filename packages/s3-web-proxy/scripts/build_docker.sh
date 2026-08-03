#!/usr/bin/env bash

set -e

export readonly REPOSITORY_NAME="s3-web-proxy"
export readonly SOURCE_REPOSITORY_NAME="nginx-nodejs-24-2023-supervisord"

export GOSS_ENV="-e AWS_ACCESS_KEY_ID='' -e AWS_SECRET_ACCESS_KEY='' -e S3_BUCKET_NAME='dummy' -e HTPASSWD=test"
/bin/bash ../scripts/build_and_push_image.sh
