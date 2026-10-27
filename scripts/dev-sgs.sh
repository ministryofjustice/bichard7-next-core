#!/bin/bash

apply_dev_sgs () {
  CODEBUILD_JOB_NAME=$1
  LEDS_ACCESS=$2
  LEDS_ACCESS_TEXT=""
  if [[ "$LEDS_ACCESS" == "true" ]]; then
    LEDS_ACCESS_TEXT="wtih access to LEDS API"
  fi
  echo "Applying dev sgs to $CODEBUILD_JOB_NAME $LEDS_ACCESS_TEXT"
  BUILD_ID=$(aws-vault exec bichard7-shared -- aws codebuild start-build --no-cli-pager \
    --project-name apply-dev-sgs-to-$CODEBUILD_JOB_NAME \
    --environment-variables-override name=TF_VAR_leds_api_access,value=$LEDS_ACCESS,type=PLAINTEXT | \
    jq ".build.id" -r)
  echo "Build ID: ${BUILD_ID}"

  for i in {1..60}; do
    STATUS=$(aws-vault exec bichard7-shared -- aws codebuild batch-get-builds --ids $BUILD_ID | jq ".builds[0].buildStatus" -r)
    echo $STATUS
    if [ "$STATUS" = "SUCCEEDED" ]
    then
      exit
    fi
    sleep 5
  done

}

LEDS_ACCESS="false"
if [[ "$1" == "--with-leds-access" ]]; then
  LEDS_ACCESS="true"
fi

while true; do
    read -p "Choose an environment (1 = e2e, 2 = preprod, 3 = prod, 4 = uat, 5 = leds): " env
    case $env in
        [1]* ) apply_dev_sgs "e2e-test" "$LEDS_ACCESS"; break;;
        [2]* ) apply_dev_sgs "preprod" "$LEDS_ACCESS"; break;;
        [3]* ) apply_dev_sgs "prod" "$LEDS_ACCESS"; break;;
        [4]* ) apply_dev_sgs "uat" "$LEDS_ACCESS"; break;;
        [5]* ) apply_dev_sgs "leds-test" "$LEDS_ACCESS"; break;;
        * ) echo "Please choose 1, 2, 3, 4 or 5";;
    esac
done  
