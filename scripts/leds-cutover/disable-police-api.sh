#!/bin/bash

echo "Disabling Police API (PNC and LEDS)..."
write_ssm_parameter_value "$SSM_PARAM__POLICE_API_ACCESS" "disabled" || exit 1

printf "\n✅ Disabled Police API (PNC and LEDS)\n"
