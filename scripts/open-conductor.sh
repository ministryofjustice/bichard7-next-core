#!/bin/bash

if [ -z "${AWS_ACCESS_KEY_ID}" ]
then
    echo "ERROR: Script must be run with aws-vault e.g. aws-vault exec bichard7-shared-e2e-test -- ./scripts/open-conductor.sh"
    exit 1
fi

echo -e "=================================================================================="
echo -e "WARNING: Don't forget to apply dev-sgs and switch VPN profile for the environment!"
echo -e "==================================================================================\n"
echo -e "Getting URL for Conductor...\n"

BICHARD7_HOSTED_ZONE_ID=$(
  aws route53 list-hosted-zones --query "HostedZones[*].{Name: Name, Id: Id}" \
    | jq -r '.[] | select(.Name | contains("bichard7"))' \
    | jq -r '.Id'
)

CONDUCTOR_URL="https://$(
  aws route53 list-resource-record-sets --hosted-zone-id "${BICHARD7_HOSTED_ZONE_ID}" --query "ResourceRecordSets[*].Name" \
    | jq -r '(.[] | select(contains("conductor"))) | .[:-1]'
)"

echo -e "Getting password for Conductor...\n"

CONDUCTOR_PASSWORD_SECRET_ARN=$(
  aws secretsmanager list-secrets --query "SecretList[*].{Name: Name, ARN: ARN}" \
    | jq -r '.[] | select(.Name | contains("conductor"))' \
    | jq -r '.ARN'
)

CONDUCTOR_PASSWORD=$(
  aws secretsmanager get-secret-value --secret-id "${CONDUCTOR_PASSWORD_SECRET_ARN}" \
    | jq -r ".SecretString"
)

echo "${CONDUCTOR_PASSWORD}" | pbcopy

echo -e "Opening Conductor...\n"

echo -e "---\n"

echo "URL: ${CONDUCTOR_URL}"
echo "Username: bichard"
echo "Password: <copied to clipboard>"

open "${CONDUCTOR_URL}"
