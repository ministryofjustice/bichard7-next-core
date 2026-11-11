#!/usr/bin/env bash
#
# Force a new deployment of an ECS service so new tasks start and
# re-resolve SSM parameters referenced in the task definition.
#
# Usage:
#   ./restart-ecs-service.sh <cluster> <service> [region]
#
# Or with environment variables:
#   ECS_CLUSTER=my-cluster ECS_SERVICE=my-service AWS_REGION=eu-west-2 ./restart-ecs-service.sh

set -euo pipefail

CLUSTER="${1:-${ECS_CLUSTER:-}}"
SERVICE="${2:-${ECS_SERVICE:-}}"
REGION="${3:-${AWS_REGION:-${AWS_DEFAULT_REGION:-}}}"

if [[ -z "$CLUSTER" || -z "$SERVICE" ]]; then
  echo "Usage: $0 <cluster> <service> [region]" >&2
  exit 1
fi

MONITOR_SECONDS="${MONITOR_SECONDS:-60}"
MONITOR_INTERVAL="${MONITOR_INTERVAL:-5}"

REGION_ARGS=()
if [[ -n "$REGION" ]]; then
  REGION_ARGS=(--region "$REGION")
fi

echo "Forcing new deployment: cluster=$CLUSTER service=$SERVICE ${REGION:+region=$REGION}"

aws ecs update-service \
  --cluster "$CLUSTER" \
  --service "$SERVICE" \
  --force-new-deployment \
  "${REGION_ARGS[@]}" \
  --query 'service.deployments[?status==`PRIMARY`].{id:id,taskDefinition:taskDefinition,desired:desiredCount}' \
  --output table

echo "Waiting for the service to become stable (new tasks running, old ones drained)..."

aws ecs wait services-stable \
  --cluster "$CLUSTER" \
  --services "$SERVICE" \
  "${REGION_ARGS[@]}"

echo "Service reported stable. Monitoring task counts for ${MONITOR_SECONDS}s..."

END=$((SECONDS + MONITOR_SECONDS))
while (( SECONDS < END )); do
  # Output: desired running pending deployments
  read -r DESIRED RUNNING PENDING DEPLOYMENTS < <(
    aws ecs describe-services \
      --cluster "$CLUSTER" \
      --services "$SERVICE" \
      "${REGION_ARGS[@]}" \
      --query 'services[0].[desiredCount,runningCount,pendingCount,length(deployments)]' \
      --output text
  )

  echo "$(date +%H:%M:%S) desired=$DESIRED running=$RUNNING pending=$PENDING deployments=$DEPLOYMENTS"

  if [[ "$RUNNING" != "$DESIRED" || "$PENDING" != "0" || "$DEPLOYMENTS" != "1" ]]; then
    echo "ERROR: service is not stable (task counts diverged or extra deployment present)." >&2
    exit 1
  fi

  sleep "$MONITOR_INTERVAL"
done

echo "Done. Service stayed stable for ${MONITOR_SECONDS}s; running tasks started with the current SSM value."