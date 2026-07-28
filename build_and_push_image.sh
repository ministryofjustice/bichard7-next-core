#!/usr/bin/env bash

set -ex

## Build image steps
export readonly REPOSITORY="${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com"
export readonly DOCKER_IMAGE_PREFIX="${REPOSITORY}/${REPOSITORY_NAME}"
export readonly SOURCE_IMAGE_PREFIX="${REPOSITORY}/${SOURCE_REPOSITORY_NAME}"
export readonly DOCKER_IMAGE="${REPOSITORY_NAME}:latest"

if [ "$DOCKERFILE" == "" ]; then
  DOCKERFILE="Dockerfile"
fi

echo "Build ${REPOSITORY_NAME} image on `date`"
aws ecr get-login-password --region eu-west-2 | docker login \
  --username AWS \
  --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com

IMAGE_HASH=$(aws ecr describe-images --repository-name ${SOURCE_REPOSITORY_NAME} | jq '.imageDetails|sort_by(.imagePushedAt)[-1].imageDigest' | tr -d '"')

DOCKER_IMAGE_HASH="${SOURCE_IMAGE_PREFIX}@${IMAGE_HASH}"
echo "Building from ${DOCKER_IMAGE_HASH}"

docker build \
  --build-arg "BUILD_IMAGE=${DOCKER_IMAGE_HASH}" \
  ${BUILD_ARGS} \
  -t ${REPOSITORY_NAME} -f ${DOCKERFILE} .

echo "Running goss tests against ${DOCKER_IMAGE}"
/bin/bash ../scripts/run_goss_tests.sh

## Push image steps
docker tag ${REPOSITORY_NAME}:latest ${DOCKER_IMAGE_PREFIX}:${CODEBUILD_RESOLVED_SOURCE_VERSION}-${CODEBUILD_START_TIME}

echo "Pushing ${REPOSITORY_NAME} image on `date`"
docker push ${DOCKER_IMAGE_PREFIX}:${CODEBUILD_RESOLVED_SOURCE_VERSION}-${CODEBUILD_START_TIME}  | tee /tmp/docker.out
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
