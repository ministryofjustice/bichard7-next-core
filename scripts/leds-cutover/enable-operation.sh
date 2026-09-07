#!/bin/bash

. ./lib/common.sh

operations_to_enable=$(read_operations) || exit 1
existing_allowed_operations=$(read_ssm_parameter_value $SSM_PARAM__LEDS_ALLOWED_OPERATIONS) || exit 1

echo "Existing enabled operations: $existing_allowed_operations"
echo "Enabling operations: $operations_to_enable"

merged_operations=()

# Combine SSM values and CLI output into a space-separated list
combined_raw_operations="${existing_allowed_operations//,/ } ${operations_to_enable//,/ }"

for item in $combined_raw_operations; do
  clean_item="${item#--}"
  # Check if item is already in merged_operations list (deduplicate)
  if [[ ! " ${merged_operations[*]} " =~ [[:space:]]"$clean_item"[[:space:]] ]]; then
    merged_operations+=("$clean_item")
  fi
done

# 4. Format final merged result as comma-separated string
if [ ${#merged_operations[@]} -gt 0 ]; then
  printf -v final_result "%s," "${merged_operations[@]}"
  updated_operations="${final_result%,}"
else
  updated_operations=""
fi

write_ssm_parameter_value "$SSM_PARAM__LEDS_ALLOWED_OPERATIONS" "$updated_operations" || exit 1

printf "\n✅ Successfully enabled operation(s): $operations_to_enable\n"
printf "Current enabled operations: $updated_operations\n"
