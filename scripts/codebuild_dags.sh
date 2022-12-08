#!/bin/bash

set -ex

function upload_to_s3 {
  local sourceFilename=$1
  local destinationFilename=$2
  local extraArgs=$3

  sourceHash=$(openssl dgst -binary -sha256 "$sourceFilename" | openssl base64)
  aws s3 cp $sourceFilename \
    s3://$ARTIFACT_BUCKET/airflow/$CODEBUILD_RESOLVED_SOURCE_VERSION/$destinationFilename \
    --content-type application/octet-stream \
    --acl bucket-owner-full-control \
    --metadata hash=$sourceHash \
    $extraArgs
}

############################################
# DAGs
############################################

upload_to_s3 airflow/requirements.txt requirements.txt
upload_to_s3 airflow/dags/ dags/ --recursive

if [ "${IS_CD}" = "true" ]; then
  cat <<EOF>/tmp/core.json
  {
    "source-hash" : "${CODEBUILD_RESOLVED_SOURCE_VERSION}",
    "build-time": "${CODEBUILD_START_TIME}"
 }
EOF
  aws s3 cp /tmp/core.json s3://${ARTIFACT_BUCKET}/semaphores/core.json
fi
