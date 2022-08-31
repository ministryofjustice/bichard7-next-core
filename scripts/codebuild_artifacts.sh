#!/bin/bash

set -e

function upload_to_s3 {
  local sourceFilename=$1
  local destinationFilename=$2
  local contentType=$3

  if [[ -z "$contentType" ]]; then
    contentType="application/octet-stream"
  fi

  sourceHash=$(openssl dgst -binary -sha256 "$sourceFilename" | openssl base64)
  aws s3 cp "$sourceFilename" \
    "s3://$ARTIFACT_BUCKET/comparison-lambda/$destinationFilename" \
    --content-type "$contentType" \
    --acl bucket-owner-full-control \
    --metadata hash="$sourceHash"
}

############################################
# Lambdas
############################################

cd build

zip compare.zip compare.js bichard7-next-data*
upload_to_s3 compare.zip compare.zip

zip rerunComparison.zip rerunComparison.js
upload_to_s3 rerunComparison.zip rerunComparison.zip

cd -
