#!/bin/bash

. ./lib/common.sh

printf "Generating NIAM token:\n\n"

AUTH_TOKEN=$(execute_code "./lib/generateNiamAuthToken.ts" "const token = await fn(); console.log(token);")

echo "${AUTH_TOKEN}"

printf "\nToken details:\n"
echo "$AUTH_TOKEN" | cut -d'.' -f2 | base64 -d 2>/dev/null | jq .
