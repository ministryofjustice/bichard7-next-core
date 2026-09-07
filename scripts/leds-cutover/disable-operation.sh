#!/bin/bash

. ./lib/common.sh

operations_to_disable=$(read_operations) || exit 1
existing_allowed_operations=$(read_ssm_parameter_value $SSM_PARAM__LEDS_ALLOWED_OPERATIONS) || exit 1

echo "Existing enabled operations: $existing_allowed_operations"
echo "Disabling operations: $operations_to_disable"

# Prepare string lookup targets
remove_lookup_str=" ${operations_to_disable//,/ } "
remaining_operations=()

# Filter out items present in the removal list
# Convert comma-separated SSM value into space-separated list for iteration
for item in ${existing_allowed_operations//,/ }; do
  clean_item="${item#--}"
  
  # Check if current SSM item is NOT in the list of operations to remove
  if [[ ! "$remove_lookup_str" =~ [[:space:]]"$clean_item"[[:space:]] ]]; then
    remaining_operations+=("$clean_item")
  fi
done

# Format the filtered list into a comma-separated string
if [ ${#remaining_operations[@]} -gt 0 ]; then
  printf -v final_result "%s," "${remaining_operations[@]}"
  updated_operations="${final_result%,}"
else
  updated_operations=""
fi

write_ssm_parameter_value "$SSM_PARAM__LEDS_ALLOWED_OPERATIONS" "$updated_operations" || exit 1

printf "\n✅ Successfully disabled operation(s): $operations_to_disable\n"
printf "Current enabled operations: $updated_operations\n"
