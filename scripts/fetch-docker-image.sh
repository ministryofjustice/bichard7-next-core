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

echo `date`
echo "Fetching latest ${IMAGE} image from ECR ..."
REGION=eu-west-2
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)

if [[ -z "${IMAGE_HASH}" ]]; then
    IMAGE_HASH=$(aws ecr describe-images --repository-name ${IMAGE} --query "sort_by(imageDetails, &imagePushedAt)[-1].imageDigest" --output json | tr -d '"' | head -1)
fi

aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

success=false
max_attempts=3
attempt_num=1

while [ $success = false ] && [ $attempt_num -le $max_attempts ]; do

    docker pull ${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/${IMAGE}@${IMAGE_HASH} -q

    if [ $? -eq 0 ]; then
        success=true
    else
        echo ""
        echo "Failed, retrying..."
        sleep 10
        ((attempt_num++))
        echo "Retrying, attempt $attempt_num ..."
    fi
done

docker tag ${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/${IMAGE}@${IMAGE_HASH} ${TAG} 1>/dev/null
