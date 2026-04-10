#!/bin/bash

if [[ "$WORKSPACE" != "leds" ]]; then
    exit 0;
fi

LEDS_API_STATUS=$(curl -k -s -o /dev/null -w "%{http_code}" -X POST $LEDS_API_URL/person-services/v1/find-disposals-by-asn)

if [[ "$LEDS_API_STATUS" != "401" ]]; then
    echo "LEDS API returned $LEDS_API_STATUS. Skipping LEDS e2e tests."
    exit 1
fi
