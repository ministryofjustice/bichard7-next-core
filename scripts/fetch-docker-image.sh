#!/usr/bin/env bash

set -e

IMAGE=$1
TAG=$2
IMAGE_HASH=$3

if [[ -z "${IMAGE}" ]]; then
    echo "No image specified." >&2
    echo "Usage: $0 <image> [tag]" >&2
    exit 1
fi

if [[ -z "${TAG}" ]]; then
    TAG=$IMAGE
fi

echo "Fetching ${IMAGE} Docker image on `date`"

REGION=eu-west-2
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)

if [[ -z "${IMAGE_HASH}" ]]; then
    IMAGE_HASH=$(aws ecr describe-images --repository-name ${IMAGE} --query "sort_by(imageDetails, &imagePushedAt)[-1].imageDigest" --output json | tr -d '"' | head -1)
fi

aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

docker pull ${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/${IMAGE}@${IMAGE_HASH}
docker tag ${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/${IMAGE}@${IMAGE_HASH} ${TAG}
