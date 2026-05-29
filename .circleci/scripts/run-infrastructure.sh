#!/usr/bin/env bash
# Set defaults
USE_API="${USE_API:-false}"

if [[ "$USE_API" = "true" || "$USE_API" = "1" ]]; then
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
echo ""

success=false
max_attempts=3
attempt_num=1

if [ "$2" = "all" ]; then
    echo "Booting flaky emulators (PNC and Beanconnect)..."

    while [ "$success" = false ] && [ $attempt_num -le $max_attempts ]; do
        NOWORKER=true SKIP_CONDUCTOR_SETUP=true ./environment/boot.sh pnc beanconnect

        if [ $? -eq 0 ]; then
            success=true
        else
            echo ""
            echo "Failed to boot PNC/Beanconnect, retrying..."
            sleep 5
            echo "Removing Beanconnect and PNC..."
            docker rm -f bichard-beanconnect-1 bichard-pnc-1
            sleep 1
            ((attempt_num++))
            if [ $attempt_num -le $max_attempts ]; then
                echo "Retrying Phase 1, attempt $attempt_num ..."
            fi
        fi
    done

    if [ "$success" = false ]; then
        echo ""
        echo "Failed to start PNC and Beanconnect after $max_attempts attempts."
        exit 1
    fi

    echo "Booting the remaining infrastructure..."
    SKIP_IMAGES="$1" npm run "$2"

    if [ $? -ne 0 ]; then
        echo "Failed to start remaining infrastructure."
        exit 1
    fi
else
    echo "Booting infrastructure"
    SKIP_IMAGES="$1" npm run "$2"
fi