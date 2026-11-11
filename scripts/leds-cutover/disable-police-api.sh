#!/bin/bash

echo "Disabling Police API (PNC and LEDS)..."
write_ssm_parameter_value "$SSM_PARAM__POLICE_API_ACCESS" "disabled" || exit 1

ECS_CLUSTER=cjse-$WORKSPACE-bichard-7-conductor
ECS_SERVICE=cjse-$WORKSPACE-bichard-7-conductor-core-worker
./lib/restart-ecs-service.sh $ECS_CLUSTER $ECS_SERVICE

printf "\n✅ Disabled Police API (PNC and LEDS)\n"
