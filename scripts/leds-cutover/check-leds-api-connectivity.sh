#!/bin/bash

. ./lib/common.sh

echo "Checking LEDS API Connectivity"
echo "Sending a request to ${LEDS_STATUS_URL}"

STATUS_CODE=$(curl -k -s -o /dev/null -w "%{http_code}\n" $LEDS_STATUS_URL)

if [[ "$STATUS_CODE" -ge 200 ]] && [[ "$STATUS_CODE" -lt 500 ]]; then
    echo "✅ Received the expected response code from the LEDS API (Status code: $STATUS_CODE)"
    exit 0
elif [[ "$STATUS_CODE" -ge 500 ]] && [[ "$STATUS_CODE" -lt 600 ]]; then
    echo "❌ Received server error response code from the LEDS API (Status code: $STATUS_CODE)"
    echo "⚠️ Investigate the issue before proceeding"
    echo "Have you applied dev sgs to access LEDS API?"
    echo "b7 dev-sgs --with-leds-access"
    exit 1
else
    echo "❌ Did NOT receive the expected response code from the LEDS API (Status code: $STATUS_CODE)"
    echo "Have you applied dev sgs to access LEDS API?"
    echo "b7 dev-sgs --with-leds-access"
    exit 1
fi
