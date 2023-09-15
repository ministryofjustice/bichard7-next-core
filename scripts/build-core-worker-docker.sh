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
    GOSS_SLEEP=5 GOSS_FILE=packages/conductor/goss.yaml dgoss run \
      -e PHASE1_COMPARISON_TABLE_NAME="bichard-7-comparison-log" \
      -e PHASE2_COMPARISON_TABLE_NAME="bichard-7-phase2-comparison-log" \
      -e PHASE3_COMPARISON_TABLE_NAME="bichard-7-phase3-comparison-log" \
      -e TASK_DATA_BUCKET_NAME="conductor-task-data" \
      -e AUDIT_LOG_API_KEY="xxx" \
      -e AUDIT_LOG_API_URL="http://localhost:3011" \
      -e COMPARISON_BUCKET="comparisons" \
      -e MQ_URL="mq" \
      -e MQ_USER="bichard" \
      -e MQ_PASSWORD="password" \
      -e PHASE1_BUCKET_NAME="phase1" \
      -e DYNAMO_REGION="eu-west-2" \
      -e DYNAMO_URL="https://dynamodb.eu-west-2.amazonaws.com" \
      -e S3_REGION="eu-west-2" \
      -e CONDUCTOR_URL="http://conductor:4000/api" \
      "${DOCKER_OUTPUT_TAG}:latest"

    ## Run Trivy scan
    TRIVY_CACHE_DIR=trivy trivy image \
      --exit-code 1 \
      --severity "CRITICAL" \
      --skip-update "${DOCKER_OUTPUT_TAG}:latest" # we have the most recent db pulled locally

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
