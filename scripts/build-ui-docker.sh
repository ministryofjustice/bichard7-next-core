#!/usr/bin/env bash

set -ex

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

  echo "Building ui docker image on `date`"

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
    docker build --build-arg "BUILD_IMAGE=${DOCKER_IMAGE_HASH}" --platform=linux/arm64 -t ui .
else
    echo "Building regular image"
    docker build --build-arg "BUILD_IMAGE=${DOCKER_IMAGE_HASH}" -t ui .
fi

  if [[ -n "${CODEBUILD_RESOLVED_SOURCE_VERSION}" && -n "${CODEBUILD_START_TIME}" ]]; then
      ## Install goss
      curl -L https://github.com/goss-org/goss/releases/latest/download/goss-linux-amd64 -o /usr/local/bin/goss
      chmod +rx /usr/local/bin/goss
      curl -L https://github.com/goss-org/goss/releases/latest/download/dgoss -o /usr/local/bin/dgoss
      chmod +rx /usr/local/bin/dgoss

      export GOSS_PATH="/usr/local/bin/goss"

      ## Run goss tests
      # DB_CONTAINER=docker ps -aqf "name=bichard7-next_pg"
      # DB_HOST=docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $DB_CONTAINER
      GOSS_SLEEP=15 dgoss run "ui:latest"

      docker tag \
          ui:latest \
          ${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/ui:${CODEBUILD_RESOLVED_SOURCE_VERSION}-${CODEBUILD_START_TIME}

      echo "Push docker image on `date`"
      docker push \
          ${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/ui:${CODEBUILD_RESOLVED_SOURCE_VERSION}-${CODEBUILD_START_TIME} | tee /tmp/docker.out
      export IMAGE_SHA_HASH=$(cat /tmp/docker.out | grep digest | cut -d':' -f3-4 | cut -d' ' -f2)

      if [ "${IS_CD}" = "true" ]; then
        cat <<EOF>/tmp/ui.json
          {
            "source-hash" : "${CODEBUILD_RESOLVED_SOURCE_VERSION}",
            "build-time": "${CODEBUILD_START_TIME}",
            "image-hash": "${IMAGE_SHA_HASH}"
          }
EOF
        aws s3 cp /tmp/ui.json s3://${ARTIFACT_BUCKET}/semaphores/ui.json
        export UI_HASH="${IMAGE_SHA_HASH}"
      fi
  fi
}
if [[ "$(has_local_image)" -gt 0 ]]; then
  if [ $(arch) = "arm64" ]
  then
      echo "Building for ARM"
      docker build -f packages/ui/Dockerfile --platform=linux/arm64 -t ui:latest .
  else
      echo "Building regular image"
      docker build -f packages/ui/Dockerfile -t ui:latest .
  fi
else
  pull_and_build_from_aws
fi
