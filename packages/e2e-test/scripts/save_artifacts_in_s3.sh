#!/bin/bash

set -ex

echo "Storing artifacts"

mkdir -p ./saved_artifacts

if [ -n "$(ls -A ./screenshots 2>/dev/null)" ]
then
  echo "Compressing screenshots"
  for file in ./screenshots/*; do tar -czf ${file}.tar.gz $file; done

  echo "Moving compressed files to artifacts directory"
  mv ./screenshots/*.tar.gz ./saved_artifacts/

  echo "Syncing artifacts"
  aws s3 sync ./saved_artifacts s3://pathtolive-ci-codebuild/${WORKSPACE}-recordings/$(date +"%Y-%m-%dT%H:%M")/

else
  echo "No screenshots found"
fi
