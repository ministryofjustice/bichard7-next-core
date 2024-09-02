#!/bin/bash

# Warning: this script reverts S3 task files for all failed workflows to their original version
# Make sure that all failed workflows need this doing to them before you run it
# The script is meant to serve as a reference for how to fix it and be useful if you have a lot to do

CONDUCTOR_PASSWORD=$(aws secretsmanager get-secret-value --secret-id cjse-production-bichard-7-conductor-password  --no-cli-pager --query SecretString --output text)
CONDUCTOR_URL='https://conductor.bichard7.service.justice.gov.uk/api/workflow/search?start=0&size=1000&sort=startTime%3ADESC&freeText=%2A&query=status%20IN%20%28FAILED%29'
BUCKET="bichard-7-production-task-data"

curl --silent --insecure -u bichard:$CONDUCTOR_PASSWORD $CONDUCTOR_URL | jq -r '.results[].input' | while read rawS3Path
do
  s3Path=${rawS3Path:16:41}
  echo $s3Path

  firstVersionId=$(aws s3api list-object-versions --bucket $BUCKET  --query 'Versions[-1].VersionId' --prefix $s3Path --output text --no-cli-pager)
  echo "[$firstVersionId]"
  aws s3api get-object --bucket $BUCKET --key $s3Path --version-id $firstVersionId --no-cli-pager /tmp/$s3Path
  aws s3api put-object --bucket $BUCKET --key $s3Path --body /tmp/$s3Path --no-cli-pager
  rm /tmp/$s3Path
done
