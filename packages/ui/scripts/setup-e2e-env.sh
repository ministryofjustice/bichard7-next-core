#!/bin/bash

set -e

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

AWS_CLI_PATH="$(which aws)"
aws_credential_check
HOSTED_ZONE=$($AWS_CLI_PATH route53 list-hosted-zones-by-name --query "HostedZones[?contains(Name, 'justice.gov.uk') && contains(Name, '${WORKSPACE}')].Name" --output text | sed 's/\.$//')
DB_HOST=$($AWS_CLI_PATH rds describe-db-clusters --region eu-west-2 --filters Name=db-cluster-id,Values=cjse-${WORKSPACE}-bichard-7-aurora-cluster --query "DBClusters[0].Endpoint" --output text)

if [ "$DB_HOST" = 'null' ]
then
  echo "Error fetching DB host"
  exit 1
fi

AUDIT_LOG_API_ID=$(aws apigateway get-rest-apis --query "items[0].id" --output text)
AUDIT_LOG_API_URL="https://${AUDIT_LOG_API_ID}.execute-api.eu-west-2.amazonaws.com/${WORKSPACE}"
AUDIT_LOG_API_KEY=$(aws apigateway get-api-keys --include-values --query "items[0].value" --output text)

mkdir -p workspaces
rm -f $TEST_ENV_FILE

echo "export DB_HOST=\"${DB_HOST}\"" >> $TEST_ENV_FILE
fetchParam "DB_PASSWORD" "/cjse-${WORKSPACE}-bichard-7/rds/db/password"
echo "export DB_SSL=\"true\"" >> $TEST_ENV_FILE
echo "export DB_SSL_MODE=\"require\"" >> $TEST_ENV_FILE
echo "export AUDIT_LOG_API_URL=\"${AUDIT_LOG_API_URL}\"" >> $TEST_ENV_FILE
echo "export AUDIT_LOG_API_KEY=\"${AUDIT_LOG_API_KEY}\"" >> $TEST_ENV_FILE

echo 'Done'
