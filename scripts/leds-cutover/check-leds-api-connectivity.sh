#!/bin/bash

. ./lib/common.sh

echo "Checking LEDS API Connectivity"
echo "Sending a request to ${ASN_QUERY_URL}"

STATUS_CODE=$(curl -X POST -k -s -o /dev/null -w "%{http_code}\n" $ASN_QUERY_URL)

if [[ "$STATUS_CODE" -ge 400 ]] && [[ "$STATUS_CODE" -lt 500 ]]; then
    echo "✅ Received the expected response code from the LEDS API (Status code: $STATUS_CODE)"
    exit 0
elif [[ "$STATUS_CODE" -ge 500 ]] && [[ "$STATUS_CODE" -lt 600 ]]; then
    echo "❌ Received server error response code from the LEDS API (Status code: $STATUS_CODE)"
    echo "⚠️ Investigate the issue before proceeding"
    exit 1
else
    echo "❌ Did NOT receive the expected response code from the LEDS API (Status code: $STATUS_CODE)"
    exit 1
fi
