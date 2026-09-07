#!/usr/bin/env bash

set -euo pipefail

. ./common.sh

export CLUSTER_NAME="cjse-${WORKSPACE}-bichard-7-conductor"
export SERVICE_NAME="cjse-${WORKSPACE}-bichard-7-conductor-core-worker"
export CONTAINER_NAME="cjse-${WORKSPACE}-bichard-7"

export USE_LEDS__VARIABLE_NAME="USE_LEDS"
export USE_LEDS__VARIABLE_VALUE="false"
API_NAME="PNC"

if [[ "${1,,}" == "leds" ]]; then
  export USE_LEDS__VARIABLE_VALUE=true
  API_NAME="LEDS"
fi

export TASK_DEFINITION_FILE="$(mktemp)"
export NEW_TASK_DEFINITION_FILE="$(mktemp)"

trap 'rm -f "$TASK_DEFINITION_FILE" "$NEW_TASK_DEFINITION_FILE"' EXIT

echo "Getting current task definition..."

export TASK_DEFINITION_ARN=$(aws ecs describe-services \
  --cluster "$CLUSTER_NAME" \
  --services "$SERVICE_NAME" \
  --query 'services[0].taskDefinition' \
  --output text)

echo "Current task definition: $TASK_DEFINITION_ARN"

aws ecs describe-task-definition \
  --task-definition "$TASK_DEFINITION_ARN" \
  --query 'taskDefinition' \
  --output json > "$TASK_DEFINITION_FILE"

USE_LEDS__CURRENT_VALUE=$(jq -r \
  --arg container "$CONTAINER_NAME" \
  --arg variable "$USE_LEDS__VARIABLE_NAME" \
  '.containerDefinitions[]
    | select(.name == $container)
    | .environment[]
    | select(.name == $variable)
    | .value' \
  "$TASK_DEFINITION_FILE")

if [[ "$USE_LEDS__CURRENT_VALUE" == "$USE_LEDS__VARIABLE_VALUE" ]]; then
  printf "\n$USE_LEDS__VARIABLE_NAME is already set to $USE_LEDS__VARIABLE_VALUE.\n"
  printf "✅ Already using $API_NAME API. Nothing to do.\n"
  exit 0
fi

echo "Updating $USE_LEDS__VARIABLE_NAME to $USE_LEDS__VARIABLE_VALUE..."

node <<'NODE'
const fs = require('fs');

const {
  TASK_DEFINITION_FILE,
  NEW_TASK_DEFINITION_FILE,
  CONTAINER_NAME,
  USE_LEDS__VARIABLE_NAME,
  USE_LEDS__VARIABLE_VALUE
} = process.env;

const taskDefinition = JSON.parse(
  fs.readFileSync(TASK_DEFINITION_FILE, 'utf8')
);

const container = taskDefinition.containerDefinitions.find(
  ({ name }) => name === CONTAINER_NAME
);

if (!container) {
  throw new Error(`Container "${CONTAINER_NAME}" not found`);
}

const variable = container.environment.find(
  ({ name }) => name === USE_LEDS__VARIABLE_NAME
);

if (!variable) {
  throw new Error(
    `Environment variable "${USE_LEDS__VARIABLE_NAME}" not found`
  );
}

variable.value = USE_LEDS__VARIABLE_VALUE;

delete taskDefinition.taskDefinitionArn;
delete taskDefinition.revision;
delete taskDefinition.status;
delete taskDefinition.requiresAttributes;
delete taskDefinition.compatibilities;
delete taskDefinition.registeredAt;
delete taskDefinition.registeredBy;

fs.writeFileSync(
  NEW_TASK_DEFINITION_FILE,
  JSON.stringify(taskDefinition, null, 2)
);
NODE

echo "Registering new task definition..."

export NEW_TASK_DEFINITION_ARN=$(aws ecs register-task-definition \
  --cli-input-json "file://$NEW_TASK_DEFINITION_FILE" \
  --query 'taskDefinition.taskDefinitionArn' \
  --output text)

echo "New task definition: $NEW_TASK_DEFINITION_ARN"

echo "Updating ECS service..."

aws ecs update-service \
  --cluster "$CLUSTER_NAME" \
  --service "$SERVICE_NAME" \
  --task-definition "$NEW_TASK_DEFINITION_ARN" \
  --query 'service.taskDefinition' \
  --output text

echo "Waiting for service to stabilise..."

aws ecs wait services-stable \
  --cluster "$CLUSTER_NAME" \
  --services "$SERVICE_NAME"

echo "Deployment is stable. Monitoring for 60 seconds..."

for i in {1..6}; do
  sleep 10

  RUNNING_COUNT=$(aws ecs describe-services \
    --cluster "$CLUSTER_NAME" \
    --services "$SERVICE_NAME" \
    --query 'services[0].runningCount' \
    --output text)

  DESIRED_COUNT=$(aws ecs describe-services \
    --cluster "$CLUSTER_NAME" \
    --services "$SERVICE_NAME" \
    --query 'services[0].desiredCount' \
    --output text)

  echo "[$((i * 10))s] Running: $RUNNING_COUNT / $DESIRED_COUNT"

  if [[ "$RUNNING_COUNT" != "$DESIRED_COUNT" ]]; then
    echo "Service is no longer stable."
    exit 1
  fi
done

echo "Service remained stable for 60 seconds."
echo "ECS service successfully updated to $NEW_TASK_DEFINITION_ARN."
printf "\n✅ Switched to ${API_NAME} API\n"