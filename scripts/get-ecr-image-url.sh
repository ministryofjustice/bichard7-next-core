#!/usr/bin/env bash

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

echo "Fetching latest ${IMAGE} URL from ECR ..."

REGION=eu-west-2
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)

if [[ -z "${IMAGE_HASH}" ]]; then
    IMAGE_HASH=$(aws ecr describe-images \
      --region "${REGION}" \
      --registry-id "${AWS_ACCOUNT_ID}" \
      --repository-name "${IMAGE}" \
      --query "sort_by(imageDetails, &imagePushedAt)[-1].imageDigest" \
      --output json | tr -d '"' | head -1)
fi

if [[ -z "${IMAGE_HASH}" || "${IMAGE_HASH}" == "None" ]]; then
  echo "Error: No images found in repository '${IMAGE}'" >&2
  exit 1
fi

IMAGE_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${IMAGE}@${IMAGE_HASH}"

echo "${IMAGE_URL}"

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "image_url=${IMAGE_URL}" >> "${GITHUB_OUTPUT}"
fi