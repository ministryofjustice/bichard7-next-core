#!/usr/bin/env bash

set -euo pipefail

. ./common.sh

export CLUSTER_NAME="cjse-${WORKSPACE}-bichard-7-conductor"
export SERVICE_NAME="cjse-${WORKSPACE}-bichard-7-conductor-core-worker"
export CONTAINER_NAME="cjse-${WORKSPACE}-bichard-7"

export USE_LEDS__VARIABLE_VALUE="false"
API_NAME="PNC"

if [[ "${1,,}" == "leds" ]]; then
  export USE_LEDS__VARIABLE_VALUE="true"
  API_NAME="LEDS"
fi

echo "Updating '$SSM_PARAM__POLICE_API_USE_LEDS' SSM parameter value to '$USE_LEDS__VARIABLE_VALUE'..."

write_ssm_parameter_value "$SSM_PARAM__POLICE_API_USE_LEDS" "$USE_LEDS__VARIABLE_VALUE" || exit 1

echo "Restarting $SERVICE_NAME ECS service..."

./restart-ecs-service.sh $CLUSTER_NAME $SERVICE_NAME

printf "\n✅ Switched to ${API_NAME} API\n"
