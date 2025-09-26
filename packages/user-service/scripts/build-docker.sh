#!/usr/bin/env bash

set -e

NOCACHE=${NOCACHE:-"false"}

readonly DOCKER_REFERENCE="nginx-nodejs-20-2023-supervisord"

function has_local_image() {
  IMAGES=$(docker images --filter=reference="${DOCKER_REFERENCE}:*" -q | wc -l)
  echo "${IMAGES}"
}

function pull_and_build_from_aws() {
  FETCHED_AWS_ACCOUNT_ID=$(aws sts get-caller-identity \
      --query 'Account' \
      --output text \
      2> /dev/null
  )

  AWS_STATUS=$?
  if [[ $AWS_STATUS -ne 0 ]]; then
      echo "Unable to authenticate with AWS - are you running this with aws-vault?" >&2
      exit $AWS_STATUS
  fi

  set -e

  echo "Building user-service docker image on `date`"

  if [[ -z "${AWS_ACCOUNT_ID}" ]]; then
      AWS_ACCOUNT_ID=$FETCHED_AWS_ACCOUNT_ID
  fi

  aws ecr get-login-password --region eu-west-2 | docker login \
      --username AWS \
      --password-stdin \
      "${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com"

  # Get our latest staged nodejs image
  IMAGE_HASH=$(aws ecr describe-images --repository-name "${DOCKER_REFERENCE}" | jq '.imageDetails|sort_by(.imagePushedAt)[-1].imageDigest' | tr -d '"')

  DOCKER_IMAGE_HASH="${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/${DOCKER_REFERENCE}@${IMAGE_HASH}"

  if [ $(arch) = "arm64" ]
  then
    echo "Building for ARM"
    docker build --no-cache=$NOCACHE --build-arg "BUILD_IMAGE=${DOCKER_IMAGE_HASH}" --platform=linux/arm64 -t user-service .
  else
    echo "Building regular image"
    docker build --no-cache=$NOCACHE --build-arg "BUILD_IMAGE=${DOCKER_IMAGE_HASH}" -t user-service .
  fi

  echo "Build complete"

  if [[ -n "${CODEBUILD_RESOLVED_SOURCE_VERSION}" && -n "${CODEBUILD_START_TIME}" ]]; then

      ## Install goss
      curl -L https://github.com/aelsabbahy/goss/releases/latest/download/goss-linux-amd64 -o /usr/local/bin/goss
      chmod +rx /usr/local/bin/goss
      curl -L https://github.com/aelsabbahy/goss/releases/latest/download/dgoss -o /usr/local/bin/dgoss
      chmod +rx /usr/local/bin/dgoss

      export GOSS_PATH="/usr/local/bin/goss"

      ## Run goss tests
      GOSS_SLEEP=15 dgoss run -e DB_HOST=172.17.0.1 "user-service:latest"
      docker tag \
          user-service:latest \
          ${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/user-service:${CODEBUILD_RESOLVED_SOURCE_VERSION}-${CODEBUILD_START_TIME}

      echo "Push docker image on `date`"
      docker push \
          ${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/user-service:${CODEBUILD_RESOLVED_SOURCE_VERSION}-${CODEBUILD_START_TIME} | tee /tmp/docker.out
      export IMAGE_SHA_HASH=$(cat /tmp/docker.out | grep digest | cut -d':' -f3-4 | cut -d' ' -f2)

      if [ "${IS_CD}" = "true" ]; then
        cat <<EOF>/tmp/user-service.json
        {
          "source-hash" : "${CODEBUILD_RESOLVED_SOURCE_VERSION}",
          "build-time": "${CODEBUILD_START_TIME}",
          "image-hash": "${IMAGE_SHA_HASH}"
        }
EOF
        aws s3 cp /tmp/user-service.json s3://${ARTIFACT_BUCKET}/semaphores/user-service.json
        export USER_SERVICE_HASH="${IMAGE_SHA_HASH}"
      fi
  fi
}

if [[ "$(has_local_image)" -gt 0 ]]; then
  echo "Found local image"
  if [ $(arch) = "arm64" ]
  then
      echo "Building for ARM"
      docker build --no-cache=$NOCACHE --platform=linux/arm64 -t user-service:latest .
  else
      echo "Building regular image"
      docker build --no-cache=$NOCACHE --no-cache=$NOCACHE -t user-service:latest .
  fi
else
  pull_and_build_from_aws
fi
