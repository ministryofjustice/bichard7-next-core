#!/usr/bin/env bash

set -e

readonly DOCKER_BUILD_IMAGE="nodejs-20-2023"
readonly DOCKER_OUTPUT_TAG="core-worker"

function has_local_image() {
  IMAGES=$(docker images --filter=reference="${DOCKER_BUILD_IMAGE}:*" -q | wc -l)
  echo "${IMAGES}"
}

function pull_and_build_from_aws() {
  FETCHED_AWS_ACCOUNT_ID=$(
    aws sts get-caller-identity \
      --query 'Account' \
      --output text \
      2>/dev/null
  )

  AWS_STATUS=$?
  if [[ $AWS_STATUS -ne 0 ]]; then
    echo "Unable to authenticate with AWS - are you running this with aws-vault?" >&2
    exit $AWS_STATUS
  fi

  set -e

  echo "Building ${DOCKER_OUTPUT_TAG} docker image on $(date)"

  if [[ -z "${AWS_ACCOUNT_ID}" ]]; then
    AWS_ACCOUNT_ID=$FETCHED_AWS_ACCOUNT_ID
  fi

  aws ecr get-login-password --region eu-west-2 | docker login \
    --username AWS \
    --password-stdin \
    "${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com"

  # Get our latest staged nodejs image
  IMAGE_HASH=$(aws ecr describe-images --repository-name "${DOCKER_BUILD_IMAGE}" | jq '.imageDetails|sort_by(.imagePushedAt)[-1].imageDigest' | tr -d '"')

  DOCKER_IMAGE_HASH="${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/${DOCKER_BUILD_IMAGE}@${IMAGE_HASH}"

  docker build --build-arg "BUILD_IMAGE=${DOCKER_IMAGE_HASH}" -t ${DOCKER_OUTPUT_TAG}:latest -f packages/conductor/Dockerfile .

  if [[ -n "${CODEBUILD_RESOLVED_SOURCE_VERSION}" && -n "${CODEBUILD_START_TIME}" ]]; then

    ## Run goss tests
    GOSS_FILES_PATH=packages/conductor dgoss run \
      -e TASK_DATA_BUCKET_NAME="conductor-task-data" \
      -e AUDIT_LOG_API_KEY="xxx" \
      -e AUDIT_LOG_API_URL="http://localhost:3011" \
      -e MQ_URL="mq" \
      -e MQ_AUTH='{"username": "${DEFAULT_USER}", "password": "${DEFAULT_PASSWORD}"}' \
      -e INCOMING_BUCKET_NAME="incoming-messages" \
      -e S3_REGION="eu-west-2" \
      -e CONDUCTOR_URL="http://conductor:4000/api" \
      -e TASK_DATA_BUCKET_NAME="conductor-task-data" \
      "${DOCKER_OUTPUT_TAG}:latest"

    docker tag \
      ${DOCKER_OUTPUT_TAG}:latest \
      ${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/${DOCKER_OUTPUT_TAG}:${CODEBUILD_RESOLVED_SOURCE_VERSION}-${CODEBUILD_START_TIME}

    echo "Push docker image on $(date)"
    docker push \
      ${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/${DOCKER_OUTPUT_TAG}:${CODEBUILD_RESOLVED_SOURCE_VERSION}-${CODEBUILD_START_TIME} | tee /tmp/docker.out
    export IMAGE_SHA_HASH=$(cat /tmp/docker.out | grep digest | cut -d':' -f3-4 | cut -d' ' -f2)

    if [ "${IS_CD}" = "true" ]; then
      cat <<EOF >/tmp/${DOCKER_OUTPUT_TAG}.json
        {
          "source-hash" : "${CODEBUILD_RESOLVED_SOURCE_VERSION}",
          "build-time": "${CODEBUILD_START_TIME}",
          "image-hash": "${IMAGE_SHA_HASH}"
        }
EOF
      aws s3 cp /tmp/${DOCKER_OUTPUT_TAG}.json s3://${ARTIFACT_BUCKET}/semaphores/${DOCKER_OUTPUT_TAG}.json
      export CORE_WORKER_HASH="${IMAGE_SHA_HASH}"
    fi
  fi
}

if [[ "$(has_local_image)" -gt 0 ]]; then
  if [ $(arch) = "arm64" ]; then
    echo "Building for ARM"
    docker build -f packages/conductor/Dockerfile --platform=linux/amd64 -t ${DOCKER_OUTPUT_TAG}:latest .
  else
    echo "Building regular image"
    docker build -f packages/conductor/Dockerfile -t ${DOCKER_OUTPUT_TAG}:latest .
  fi
else
  pull_and_build_from_aws
fi
