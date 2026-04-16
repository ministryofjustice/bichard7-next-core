#!/bin/bash

if [[ "$WORKSPACE" == "e2e-test" || "$USE_LEDS" != "true" ]]; then
    exit 0;
fi

for i in {1..5}
do
    echo -n "."

    LEDS_API_STATUS=$(curl -k -s -o /dev/null -w "%{http_code}" -X POST "$LEDS_API_URL/person-services/v1/find-disposals-by-asn")

    if [[ "$LEDS_API_STATUS" != "401" ]]; then
        echo "LEDS API returned $LEDS_API_STATUS. Skipping LEDS e2e tests."
        exit 1
    fi

    if [ $i -lt 5 ]; then
        sleep 1
    fi
done

echo " LEDS API is running and stable."