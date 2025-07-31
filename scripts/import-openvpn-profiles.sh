#!/bin/bash

set -e

OPENVPN_CLIENT="/Applications/OpenVPN Connect/OpenVPN Connect.app/contents/MacOS/OpenVPN Connect"

unset AWS_VAULT
eval $(aws-vault exec bichard7-shared -- env | grep ^AWS_)
PARENT_AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
PARENT_AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
PARENT_AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN

assume_role() {
    local role_arn=$1

    export AWS_ACCESS_KEY_ID=$PARENT_AWS_ACCESS_KEY_ID
    export AWS_SECRET_ACCESS_KEY=$PARENT_AWS_SECRET_ACCESS_KEY
    export AWS_SESSION_TOKEN=$PARENT_AWS_SESSION_TOKEN

    temp_role=$(aws sts assume-role --role-arn "${role_arn}" --role-session-name "import-vpn-profiles-script")
    export AWS_ACCESS_KEY_ID=$(echo $temp_role | jq -r .Credentials.AccessKeyId)
    export AWS_SECRET_ACCESS_KEY=$(echo $temp_role | jq -r .Credentials.SecretAccessKey)
    export AWS_SESSION_TOKEN=$(echo $temp_role | jq -r .Credentials.SessionToken)
}

import_vpn_profile() {
    local aws_profile=$1
    local workspace=$2
    local profile_name=$3
    local role_arn=$(aws configure get profile.$aws_profile.role_arn)

    assume_role $role_arn

    echo "Importing VPN profile: $profile_name"
    WORKSPACE=$workspace ./get-vpn-config.sh 1> /dev/null
    "$OPENVPN_CLIENT" --remove-profile="$profile_name" 1> /dev/null
    "$OPENVPN_CLIENT" --import-profile="~/cjse-$workspace-config.ovpn" --name="$profile_name" 1> /dev/null

    LEDS_VPN_ENDPOINT=$(aws ec2 describe-client-vpn-endpoints | \
        jq -r ".ClientVpnEndpoints[] | select(.Description == \"${workspace} LEDS VPN\") | .DnsName" | \
        sed -e 's/*/vpn/')
    
    if [[ -n "$LEDS_VPN_ENDPOINT" ]]; then
        local leds_profile_name="$profile_name / LEDS VPC"
        echo "Importing VPN profile: $leds_profile_name"
        WORKSPACE=$workspace SERVICE=leds ./get-vpn-config.sh 1> /dev/null
        "$OPENVPN_CLIENT" --remove-profile="$leds_profile_name" 1> /dev/null
        "$OPENVPN_CLIENT" --import-profile="~/cjse-$workspace-leds-config.ovpn" --name="$leds_profile_name" 1> /dev/null
    fi
}

import_vpn_profile qsolution-production production "B7 Production"
import_vpn_profile qsolution-pre-prod preprod "B7 Preprod"
import_vpn_profile bichard7-shared-e2e-test e2e-test "B7 e2e test"
import_vpn_profile bichard7-shared-uat uat "B7 UAT"
import_vpn_profile bichard7-shared-uat leds "B7 LEDS"
