#!/bin/bash

if [ -z "$CODEBUILD_BUILD_ID" ]; then
    echo "ERROR: This script is restricted to the CodeBuild environment."
    echo "Aborting to protect local /etc/hosts file."
    exit 1
fi

REGION="eu-west-2"
API_GATEWAY_PREFIX="bichard-7-${WORKSPACE}-"
API_GATEWAY_VPCE_NAME="cjse-bichard7-${WORKSPACE}-base-infra-execute-api"
LEDS_ZONE_NAME="leds.police.uk"
LEDS_API_GATEWAY_VPCE_NAME="bichard-7-${WORKSPACE}-leds-api"

get_ips_by_name() {
    local NAME_TAG="$1"
    local VPCE_ID=$(aws ec2 describe-vpc-endpoints \
        --filters "Name=tag:Name,Values=$NAME_TAG" \
        --query "VpcEndpoints[0].VpcEndpointId" \
        --output text)
    
    if [ "$VPCE_ID" != "None" ]; then
        aws ec2 describe-network-interfaces \
            --filters "Name=description,Values=*$VPCE_ID*" \
            --query "NetworkInterfaces[].PrivateIpAddress" \
            --output text
    fi
}

API_IPS=$(get_ips_by_name "$API_GATEWAY_VPCE_NAME")
API_IDS=$(aws apigateway get-rest-apis --query "items[?starts_with(name, '$API_GATEWAY_PREFIX')].id" --output text)
API_VPCE_ID=$(aws ec2 describe-vpc-endpoints \
    --filters "Name=tag:Name,Values=$API_GATEWAY_VPCE_NAME" \
    --query "VpcEndpoints[0].VpcEndpointId" \
    --output text)

for API_ID in $API_IDS; do
    REGIONAL_HOSTNAME="${API_ID}.execute-api.${REGION}.amazonaws.com"
    VPCE_HOSTNAME="${API_ID}-${API_VPCE_ID}.execute-api.${REGION}.amazonaws.com"

    for IP in $API_IPS; do
        echo "$IP $REGIONAL_HOSTNAME" | tee -a /etc/hosts
        echo "$IP $VPCE_HOSTNAME" | tee -a /etc/hosts
    done
done

LEDS_ZONE_ID=$(aws route53 list-hosted-zones-by-name \
    --dns-name "$LEDS_ZONE_NAME" \
    --query "HostedZones[0].Id" --output text | cut -d'/' -f3)
LEDS_CNAMES=$(aws route53 list-resource-record-sets \
    --hosted-zone-id "$LEDS_ZONE_ID" \
    --query "ResourceRecordSets[?Type=='CNAME'].Name" \
    --output text | sed 's/\.$//g')
R53_IPS=$(get_ips_by_name "$LEDS_API_GATEWAY_VPCE_NAME")

for CNAME in $LEDS_CNAMES; do
    for IP in $R53_IPS; do
        echo "$IP $CNAME" | tee -a /etc/hosts
    done
done
