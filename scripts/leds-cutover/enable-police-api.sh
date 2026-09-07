#!/bin/bash

echo "Enabling Police API (PNC and LEDS)..."
write_ssm_parameter_value "$SSM_PARAM__POLICE_API_ACCESS" "enabled" || exit 1

printf "\n✅ Enabled Police API (PNC and LEDS)\n"
