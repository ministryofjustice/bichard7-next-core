#!/bin/bash

set -e

echo "Retrieving environment variables from ${WORKSPACE} in AWS..."

env_check() {
  if [ -z "$WORKSPACE" ]
  then
    echo "WORKSPACE env var has not been set"
    exit 1
  fi
}

env_check

aws_credential_check () {
  if [ -z "$AWS_ACCESS_KEY_ID" ]
  then
     echo "AWS_ACCESS_KEY_ID env var has not been set"
     exit 1
  fi

  if [ -z "$AWS_SECRET_ACCESS_KEY" ]
  then
    echo "AWS_SECRET_ACCESS_KEY env var has not been set"
    exit 1
  fi
}

function fetchParam() {
  ENVNAME=$1
  SSM_PATH=$2

  VALUE="$($AWS_CLI_PATH ssm get-parameter --name $SSM_PATH --with-decryption --query "Parameter.Value" --output "text")"
  echo "export $ENVNAME=\"$VALUE\"" >> $TEST_ENV_FILE
}

mkdir -p e2e-tests/workspaces
TEST_ENV_FILE="workspaces/${WORKSPACE}.env"
rm -f $TEST_ENV_FILE

if [ "$WORKSPACE" = 'local' ]
then
  exit 0
fi

mkdir -p ./screenshots

AWS_CLI_PATH="$(which aws)"
PNC_ELB_NAME=$(echo "cjse-${WORKSPACE}-bichard-7-pnc-emulator" | cut -c1-32)
aws_credential_check
HOSTED_ZONE=$($AWS_CLI_PATH route53 list-hosted-zones-by-name --query "HostedZones[?contains(Name, 'justice.gov.uk') && contains(Name, '${WORKSPACE}')].Name" --output text | sed 's/\.$//')
UI_HOST="proxy.${HOSTED_ZONE}"
USERS_HOST="proxy.${HOSTED_ZONE}"
if [[ "${REAL_PNC}x" != "truex" ]]; then
  PNC_HOST=$($AWS_CLI_PATH elbv2 describe-load-balancers --names ${PNC_ELB_NAME} --query 'LoadBalancers[0].DNSName' --output text)
fi
BROKER_ID=$(aws mq list-brokers --query "BrokerSummaries[?BrokerName=='cjse-${WORKSPACE}-bichard-7-amq'].BrokerId" --output text)
BROKER_ENDPOINTS=$(aws mq describe-broker --broker-id ${BROKER_ID} --query "join(',', BrokerInstances[*].Endpoints[2])" --output text)
BROKER_URL="failover:(${BROKER_ENDPOINTS})"
DB_HOST=$($AWS_CLI_PATH rds describe-db-clusters --region eu-west-2 --filters Name=db-cluster-id,Values=cjse-${WORKSPACE}-bichard-7-aurora-cluster --query "DBClusters[0].Endpoint" --output text)
S3_INCOMING_MESSAGE_BUCKET=$(aws lambda list-functions --query "Functions[?contains(FunctionName, 'transfer-messages') && contains(FunctionName, '-${WORKSPACE}-')].Environment.Variables.EXTERNAL_INCOMING_MESSAGE_BUCKET_NAME" --output text)
S3_REGION="$AWS_REGION"
INCOMING_MESSAGE_HANDLER_REGION="$AWS_REGION"
AUDIT_LOG_DYNAMODB_TABLE="bichard-7-${WORKSPACE}-audit-log"
AUDIT_LOG_DYNAMODB_EVENTS_TABLE="bichard-7-${WORKSPACE}-audit-log-events"
AUDIT_LOG_DYNAMODB_REGION="$AWS_REGION"
AUDIT_LOG_API_ID=$(aws apigateway get-rest-apis --query "items[0].id" --output text)
AUDIT_LOG_API_URL="https://${AUDIT_LOG_API_ID}.execute-api.eu-west-2.amazonaws.com/${WORKSPACE}"
AUDIT_LOG_API_KEY=$(aws apigateway get-api-keys --include-values --query "items[0].value" --output text)
MESSAGE_ENTRY_POINT=s3

if [ "$UI_HOST" = 'null' ] || [ "$UI_HOST" = '' ]
then
  echo "Error fetching UI host"
  exit 1
fi

if [ "$USERS_HOST" = 'null' ] || [ "$USERS_HOST" = '' ]
then
  echo "Error fetching User Service host"
  exit 1
fi

if [ "$MQ_IP" = 'null' ]
then
  echo "Error fetching MQ IP"
  exit 1
fi

if [ "$DB_HOST" = 'null' ]
then
  echo "Error fetching DB host"
  exit 1
fi

mkdir -p workspaces
rm -f $TEST_ENV_FILE

echo "export DB_HOST=\"${DB_HOST}\"" >> $TEST_ENV_FILE
echo "export UI_HOST=\"${UI_HOST}\"" >> $TEST_ENV_FILE
echo "export UI_PORT=\"443\"" >> $TEST_ENV_FILE
echo "export UI_SCHEME=\"https\"" >> $TEST_ENV_FILE
echo "export USERS_SCHEME=\"https\"" >> $TEST_ENV_FILE
echo "export USERS_HOST=\"${USERS_HOST}\"" >> $TEST_ENV_FILE
echo "export USERS_PORT=\"80\"" >> $TEST_ENV_FILE
if [[ "${REAL_PNC}x" != "truex" ]]; then
  echo "export PNC_HOST=\"${PNC_HOST}\"" >> $TEST_ENV_FILE
fi
echo "export MQ_URL=\"${BROKER_URL}\"" >> $TEST_ENV_FILE
fetchParam "DB_PASSWORD" "/cjse-${WORKSPACE}-bichard-7/rds/db/password"
fetchParam "MQ_PASSWORD" "/cjse-${WORKSPACE}-bichard-7/mq/password"
fetchParam "TOKEN_SECRET" "/cjse-${WORKSPACE}-bichard-7/jwt-secret"
echo "export MQ_USER=\"bichard\"" >> $TEST_ENV_FILE
echo "export AWS_URL=\"none\"" >> $TEST_ENV_FILE
echo "export S3_INCOMING_MESSAGE_BUCKET=\"${S3_INCOMING_MESSAGE_BUCKET}\"" >> $TEST_ENV_FILE
echo "export S3_REGION=\"${S3_REGION}\"" >> $TEST_ENV_FILE
echo "export INCOMING_MESSAGE_HANDLER_REGION=\"${INCOMING_MESSAGE_HANDLER_REGION}\"" >> $TEST_ENV_FILE
echo "export AUDIT_LOG_DYNAMODB_TABLE=\"${AUDIT_LOG_DYNAMODB_TABLE}\"" >> $TEST_ENV_FILE
echo "export AUDIT_LOG_DYNAMODB_EVENTS_TABLE=\"${AUDIT_LOG_DYNAMODB_EVENTS_TABLE}\"" >> $TEST_ENV_FILE
echo "export AUDIT_LOG_DYNAMODB_REGION=\"${AUDIT_LOG_DYNAMODB_REGION}\"" >> $TEST_ENV_FILE
echo "export AUDIT_LOG_API_URL=\"${AUDIT_LOG_API_URL}\"" >> $TEST_ENV_FILE
echo "export AUDIT_LOG_API_KEY=\"${AUDIT_LOG_API_KEY}\"" >> $TEST_ENV_FILE
echo "export MESSAGE_ENTRY_POINT=\"${MESSAGE_ENTRY_POINT}\"" >> $TEST_ENV_FILE
echo "export DB_SSL=\"true\"" >> $TEST_ENV_FILE
echo "export DB_SSL_MODE=\"require\"" >> $TEST_ENV_FILE
if [[ "${REAL_PNC}x" == "truex" ]]; then
  echo "export PNC_PORT=\"102\"" >> $TEST_ENV_FILE
fi
echo "Done - created ${TEST_ENV_FILE}"
