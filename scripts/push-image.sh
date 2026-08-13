#!/usr/bin/env bash

set -exo pipefail

## Build image steps
export readonly REPOSITORY="${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com"
export readonly DOCKER_IMAGE_PREFIX="${REPOSITORY}/${REPOSITORY_NAME}"

## Push image steps
docker tag ${REPOSITORY_NAME}:latest ${DOCKER_IMAGE_PREFIX}:${CODEBUILD_RESOLVED_SOURCE_VERSION}-${CODEBUILD_START_TIME}

aws ecr get-login-password --region eu-west-2 | docker login \
  --username AWS \
  --password-stdin \
  "${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com"

echo "Pushing ${REPOSITORY_NAME} image on `date`"
docker push ${DOCKER_IMAGE_PREFIX}:${CODEBUILD_RESOLVED_SOURCE_VERSION}-${CODEBUILD_START_TIME} | tee /tmp/docker.out
export IMAGE_SHA_HASH=$(cat /tmp/docker.out | grep digest | cut -d':' -f3-4 | cut -d' ' -f2)

if [ "${IS_CD}" = "true" ]; then
  cat <<EOF>/tmp/${REPOSITORY_NAME}.json
  {
    "source-hash" : "${CODEBUILD_RESOLVED_SOURCE_VERSION}",
    "build-time": "${CODEBUILD_START_TIME}",
    "image-hash": "${IMAGE_SHA_HASH}"
  }
EOF
  aws s3 cp --quiet /tmp/${REPOSITORY_NAME}.json s3://${ARTIFACT_BUCKET}/semaphores/${REPOSITORY_NAME}.json
  export "$(echo "${REPOSITORY_NAME}" | tr [:lower:] [:upper:] | tr '-' '_')_HASH"="${IMAGE_SHA_HASH}"
fi
