#!/bin/bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
SCRIPT_ARGS=("$@")

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

function read_ssm_parameter_value {
  local ssm_parameter_name=$1
  aws ssm get-parameter \
  --name $ssm_parameter_name \
  --with-decryption \
  --query "Parameter.Value" \
  --output text
}

function write_ssm_parameter_value {
  local ssm_parameter_name=$1
  local ssm_parameter_value=$2
  aws ssm put-parameter \
    --name "$ssm_parameter_name" \
    --value "$ssm_parameter_value" \
    --type "String" \
    --overwrite >/dev/null
}

export SSM_PARAM__LEDS_NIAM_PRIVATE_KEY="/cjse-${WORKSPACE}-bichard-7/leds/niam/private.key"
export SSM_PARAM__LEDS_NIAM_CERTIFICATE="/cjse-${WORKSPACE}-bichard-7/leds/niam/certificate.pem"
export SSM_PARAM__LEDS_NIAM_PARAMETERS="/cjse-${WORKSPACE}-bichard-7/leds/niam/parameters"
export SSM_PARAM__LEDS_NIAM_AUTH_URL="/cjse-${WORKSPACE}-bichard-7/leds/niam/public_api_url"
export SSM_PARAM__LEDS_ALLOWED_OPERATIONS="/cjse-${WORKSPACE}-bichard-7/leds/allowed-operations"

export LEDS_NIAM_PRIVATE_KEY=$(read_ssm_parameter_value "$SSM_PARAM__LEDS_NIAM_PRIVATE_KEY")
export LEDS_NIAM_CERTIFICATE=$(read_ssm_parameter_value "$SSM_PARAM__LEDS_NIAM_CERTIFICATE")
export LEDS_NIAM_PARAMETERS=$(read_ssm_parameter_value "$SSM_PARAM__LEDS_NIAM_PARAMETERS")
export LEDS_NIAM_AUTH_URL=$(read_ssm_parameter_value "$SSM_PARAM__LEDS_NIAM_AUTH_URL")

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

function read_operations {
  # Define accepted argument names (without leading '--')
  local valid_operations=("query" "remand" "disposal-results" "subsequently-varied" "sentence-deferred")
  local valid_operations_string=" ${valid_operations[*]} "

  local cleaned_operations=()

  # Validate and clean each operation passed to the script
  for op in "${SCRIPT_ARGS[@]}"; do
    # Remove leading '--'
    local clean_name="${op#--}"

    if [[ "$clean_name" == "all" ]]; then
      printf -v all_joined "%s," "${valid_operations[@]}"
      echo "${all_joined%,}" # Strip trailing comma
      return 0
    fi

    # Check if the argument exists in the allowed set
    if [[ "$valid_operations_string" =~ [[:space:]]"$clean_name"[[:space:]] ]]; then
      cleaned_operations+=("$clean_name")
    else
      formatted_valid_operations=("${valid_operations[@]/#/--}")
      echo "Error: Invalid operation '$op'" >&2
      echo "Valid operations are: ${formatted_valid_operations[*]}" >&2
      return 1
    fi
  done

  # Join valid operations with commas
  if [ ${#cleaned_operations[@]} -gt 0 ]; then
    printf -v joined "%s," "${cleaned_operations[@]}"
    echo "${joined%,}" # Strip trailing comma
  fi
}