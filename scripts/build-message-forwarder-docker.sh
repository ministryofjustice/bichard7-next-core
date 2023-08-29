#!/usr/bin/env bash

set -e

readonly DOCKER_BUILD_IMAGE="nodejs"
readonly DOCKER_OUTPUT_TAG="message-forwarder"

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

  docker build --build-arg "BUILD_IMAGE=${DOCKER_IMAGE_HASH}" -t ${DOCKER_OUTPUT_TAG}:latest -f packages/message-forwarder/Dockerfile .

  if [[ -n "${CODEBUILD_RESOLVED_SOURCE_VERSION}" && -n "${CODEBUILD_START_TIME}" ]]; then
    
    ## Run goss tests
    GOSS_SLEEP=5 GOSS_FILE=packages/message-forwarder/goss.yaml dgoss run \
      -e MQ_URL="mq" \
      -e MQ_USER="bichard" \
      -e MQ_PASSWORD="password" \
      "${DOCKER_OUTPUT_TAG}:latest"

    ## Run Trivy scan
    TRIVY_CACHE_DIR=trivy trivy image \
      --exit-code 1 \
      --severity "CRITICAL" \
      --skip-update "${DOCKER_OUTPUT_TAG}:latest"

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
      export API_HASH="${IMAGE_SHA_HASH}"
    fi
  fi
}

if [[ "$(has_local_image)" -gt 0 ]]; then
  echo "Building local image"
  docker build -f packages/api/Dockerfile -t ${DOCKER_OUTPUT_TAG}:latest  .
else
  pull_and_build_from_aws
fi
