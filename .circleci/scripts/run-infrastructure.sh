#!/usr/bin/env bash
# Set defaults
USE_API="${USE_API:-false}"

if [ "$USE_API" = "true" ]; then
  export USE_API_CASE_CANARY_RATIO="1"
  export USE_API_CASES_INDEX_CANARY_RATIO="1"
  export USE_API_CASE_RESUBMIT_CANARY_RATIO="1"
else
  export USE_API_CASE_CANARY_RATIO="0"
  export USE_API_CASES_INDEX_CANARY_RATIO="0"
  export USE_API_CASE_RESUBMIT_CANARY_RATIO="0"
fi

USE_API_CASE_ENDPOINT="${USE_API_CASE_ENDPOINT:-false}"
USE_API_CASES_INDEX_ENDPOINT="${USE_API_CASES_INDEX_ENDPOINT:-false}"
USE_API_CASE_RESUBMIT_ENDPOINT="${USE_API_CASE_RESUBMIT_ENDPOINT:-false}"
FORCES_WITH_API_ENABLED="${FORCES_WITH_API_ENABLED:-''}"
FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED="${FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED:-''}"
FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED="${FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED:-''}"

echo `date`
echo $PWD
echo "Skipping images: $1"
echo "Running: $2"
echo ""
echo "Using B7 API: $USE_API"
echo "USE_API_CASE_ENDPOINT: $USE_API_CASE_ENDPOINT"
echo "USE_API_CASES_INDEX_ENDPOINT: $USE_API_CASES_INDEX_ENDPOINT"
echo "USE_API_CASE_RESUBMIT_ENDPOINT: $USE_API_CASE_RESUBMIT_ENDPOINT"
echo ""
echo "USE_API_CASE_CANARY_RATIO: $USE_API_CASE_CANARY_RATIO"
echo "USE_API_CASES_INDEX_CANARY_RATIO: $USE_API_CASES_INDEX_CANARY_RATIO"
echo "USE_API_CASE_RESUBMIT_CANARY_RATIO: $USE_API_CASE_RESUBMIT_CANARY_RATIO"
echo ""
echo "FORCES_WITH_API_ENABLED: $FORCES_WITH_API_ENABLED"
echo "FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED: $FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED"
echo "FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED: $FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED"
echo ""

success=false
max_attempts=3
attempt_num=1

while [ $success = false ] && [ $attempt_num -le $max_attempts ]; do

    SKIP_IMAGES=$1 npm run $2

    if [ $? -eq 0 ]; then
        success=true
    else
        echo ""
        echo "Failed, retrying..."
        sleep 10
        echo "Removing Beanconnect and PNC..."
        docker rm -f bichard-beanconnect-1 bichard-pnc-1
        echo "Also removing Conductor"
        docker rm -f bichard-conductor-1
        sleep 1
        ((attempt_num++))
        echo "Retrying, attempt $attempt_num ..."
    fi
done

if [ $attempt_num -eq 4 ]; then
  echo ""
  echo "Failed to start infrastructure"
  exit 1
fi
