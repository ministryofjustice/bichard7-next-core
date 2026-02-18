#!/bin/bash

export LEDS_NIAM_PRIVATE_KEY=$(openssl genrsa 2048 2>/dev/null)
export LEDS_NIAM_CERTIFICATE=$(echo "$LEDS_NIAM_PRIVATE_KEY" | openssl req -new -x509 -key /dev/stdin -subj "/CN=localhost" -days 365)
export LEDS_NIAM_PARAMETERS='{"claims":{"aud":"aud","iss":"iss","sub":"sub"},"clientAssertionType":"dummy","clientId":"client-id","grantType":"grant-type","scope":"scope","tlsStrictMode":false}'
