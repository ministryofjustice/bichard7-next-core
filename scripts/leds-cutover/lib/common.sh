#!/bin/bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

if [[ -z "$WORKSPACE" ]]; then
    echo "WORKSPACE environment variable is required."
    exit 1
fi

export LEDS_API_HOST="api.leds.police.uk"

if [[ "$WORKSPACE" != "production" ]]; then
    export LEDS_API_HOST="api.test.leds.police.uk"
fi

export ASN_QUERY_PATH="person-services/v1/find-disposals-by-asn"
export LEDS_API_URL="https://${LEDS_API_HOST}"
export ASN_QUERY_URL="${LEDS_API_URL}/${ASN_QUERY_PATH}"

export LEDS_NIAM_PRIVATE_KEY=$(aws ssm get-parameter \
  --name "/cjse-${WORKSPACE}-bichard-7/leds/niam/private.key" \
  --with-decryption \
  --query "Parameter.Value" \
  --output text)

export LEDS_NIAM_CERTIFICATE=$(aws ssm get-parameter \
  --name "/cjse-${WORKSPACE}-bichard-7/leds/niam/certificate.pem" \
  --with-decryption \
  --query "Parameter.Value" \
  --output text)

export LEDS_NIAM_PARAMETERS=$(aws ssm get-parameter \
  --name "/cjse-${WORKSPACE}-bichard-7/leds/niam/parameters" \
  --with-decryption \
  --query "Parameter.Value" \
  --output text)

export LEDS_NIAM_AUTH_URL=$(aws ssm get-parameter \
  --name "/cjse-${WORKSPACE}-bichard-7/leds/niam/public_api_url" \
  --query "Parameter.Value" \
  --output text)

function generate_niam_token {
    npx -y tsx $SCRIPT_DIR/generateNiamAuthToken.ts
}

function execute_code {
  local file=$1
  local code=$2

  local code_to_execute="
  (async () => {
    const fn = require('${file}').default;
    const logJson = (obj) => console.log(JSON.stringify(obj, null, 2));
    ${code}
  })()
  "

  npx -y tsx -e "$code_to_execute"
}