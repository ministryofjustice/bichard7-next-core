#!/bin/sh

success=false
max_attempts=1
attempt_num=1

while [ $success = false ] && [ $attempt_num -le $max_attempts ]; do

    echo "Attempting to download: ${CIRCLE_BRANCH}..."
    git clone --depth 1 -b ${CIRCLE_BRANCH} https://github.com/ministryofjustice/bichard7-next-tests.git ~/bichard7-next-tests

    if [ $? -eq 0 ]; then
        success=true
    else
        echo ""
        echo "Not found, defaulting to main branch"
        git clone --depth 1 https://github.com/ministryofjustice/bichard7-next-tests.git ~/bichard7-next-tests
        ((attempt_num++))
    fi
done
