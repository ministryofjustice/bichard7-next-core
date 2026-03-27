#!/bin/bash

##
## For LEDS mock API:
## source ./environment/leds-environment-variable.sh
##
## For real LEDS API:
## eval $(WORKSPACE=<workspace> aws-vault exec <profile> -- ./environment/leds-environment-variable.sh --print)
##

if [[ "$WORKSPACE" == "production" ]]; then
    echo "Production workspace is not allowed"
    exit 1
fi

get_ecs_var() {
    local var_name=$1
    local cluster_name="cjse-${WORKSPACE}-bichard-7-conductor"
    local service_name="cjse-${WORKSPACE}-bichard-7-conductor-core-worker"
    
    if [[ -z "$var_name" ]]; then
        return 1
    fi

    local task_def_arn=$(aws ecs describe-services \
        --cluster "$cluster_name" \
        --services "$service_name" \
        --query "services[0].taskDefinition" \
        --output text)

    if [[ "$task_def_arn" == "None" || -z "$task_def_arn" ]]; then
        return 1
    fi

    local value=$(aws ecs describe-task-definition \
        --task-definition "$task_def_arn" \
        --query "taskDefinition.containerDefinitions[].environment[?name=='$var_name'].value" \
        --output text)

    if [[ -z "$value" || "$value" == "None" ]]; then
        return 1
    else
        echo "$value"
    fi
}

get_ssm_value() {
    local param_name="$1"
    local value
    
    value=$(aws ssm get-parameter \
        --name "$param_name" \
        --with-decryption \
        --query "Parameter.Value" \
        --output text 2>/dev/null)

    if [[ $? -ne 0 || -z "$value" ]]; then
        echo "Error: Failed to retrieve SSM parameter: $param_name" >&2
        exit 1
    fi

    echo "$value"
}

function get_niam_api_gateway_destination {
    local NIAM_API_NAME="bichard-7-${WORKSPACE}-niam-api"
    local NIAM_API_ID=$(aws apigateway get-rest-apis --query "items[?name=='$NIAM_API_NAME'].id" --output text)
    local RESOURCE_ID=$(aws apigateway get-resources --rest-api-id "$NIAM_API_ID" \
        --query "items[?path=='/'].id" --output text)
    
    aws apigateway get-integration \
        --rest-api-id "$NIAM_API_ID" \
        --resource-id "$RESOURCE_ID" \
        --http-method "POST" \
        --query "uri" --output text

}

get_leds_vpc_endpoint_dns() {
    local ENDPOINT_NAME="bichard-7-${WORKSPACE}-leds-api"
    local DNS_NAME=$(aws ec2 describe-vpc-endpoints \
        --filters "Name=tag:Name,Values=$ENDPOINT_NAME" \
        --query "VpcEndpoints[0].DnsEntries[0].DnsName" \
        --output text 2>/dev/null)

    if [ -z "$DNS_NAME" ] || [ "$DNS_NAME" == "None" ]; then
        DNS_NAME=$(aws ec2 describe-vpc-endpoints \
            --filters "Name=service-name,Values=$ENDPOINT_NAME" \
            --query "VpcEndpoints[0].DnsEntries[0].DnsName" \
            --output text 2>/dev/null)
    fi

    if [ ! -z "$DNS_NAME" ] && [ "$DNS_NAME" != "None" ]; then
        echo "$DNS_NAME"
        return 0
    else
        return 1
    fi
}

if [[ -n "$WORKSPACE" && "$WORKSPACE" != "e2e-test" ]]; then
    IS_AWS_ENV=true
    if [[ "$CI" == "true" ]]; then
        export LEDS_API_URL="https://$(get_leds_vpc_endpoint_dns)"
        export LEDS_NIAM_AUTH_URL=$(get_niam_api_gateway_destination)
    else
        export LEDS_API_URL=$(get_ecs_var "LEDS_API_URL")
        export LEDS_NIAM_AUTH_URL=$(get_ecs_var "LEDS_NIAM_AUTH_URL")
    fi
    export LEDS_NIAM_PRIVATE_KEY=$(get_ssm_value "/cjse-${WORKSPACE}-bichard-7/leds/niam/private.key")
    export LEDS_NIAM_CERTIFICATE=$(get_ssm_value "/cjse-${WORKSPACE}-bichard-7/leds/niam/certificate.pem")
    export LEDS_NIAM_PARAMETERS=$(get_ssm_value "/cjse-${WORKSPACE}-bichard-7/leds/niam/parameters")
else
    unset LEDS_API_URL
    unset LEDS_NIAM_AUTH_URL
    export LEDS_NIAM_PRIVATE_KEY=$(openssl genrsa 2048 2>/dev/null)
    export LEDS_NIAM_CERTIFICATE=$(echo "$LEDS_NIAM_PRIVATE_KEY" | openssl req -new -x509 -key /dev/stdin -subj "/CN=localhost" -days 365)
    export LEDS_NIAM_PARAMETERS='{"claims":{"aud":"aud","iss":"iss","sub":"sub"},"clientAssertionType":"dummy","clientId":"client-id","grantType":"grant-type","scope":"scope","tlsStrictMode":false}'
fi

if [ "$1" = "--print" ]; then
    if [ "$IS_AWS_ENV" == "true" ]; then
        printf "export LEDS_API_URL=%q\n" "$LEDS_API_URL"
        printf "export LEDS_NIAM_AUTH_URL=%q\n" "$LEDS_NIAM_AUTH_URL"
    else
        printf "unset LEDS_API_URL\n"
        printf "unset LEDS_NIAM_AUTH_URL\n"
    fi
    printf "export LEDS_NIAM_PRIVATE_KEY=%q\n" "$LEDS_NIAM_PRIVATE_KEY"
    printf "export LEDS_NIAM_CERTIFICATE=%q\n" "$LEDS_NIAM_CERTIFICATE"
    printf "export LEDS_NIAM_PARAMETERS=%q\n" "$LEDS_NIAM_PARAMETERS"
fi
