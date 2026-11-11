#!/bin/bash

if [[ -z "$WORKSPACE" ]]; then
    echo "WORKSPACE environment variable is required."
    exit 1
fi

CLUSTER_ID=cjse-${WORKSPACE}-bichard-7-aurora-cluster
read -r WRITER READER PORT <<<"$(aws rds describe-db-clusters \
  --db-cluster-identifier "$CLUSTER_ID" --region "eu-west-2" \
  --query 'DBClusters[0].[Endpoint,ReaderEndpoint,Port]' --output text)"

export DB_HOST=$READER
if [[ "$1" == "writer" ]]; then
    export DB_HOST=$WRITER
fi

export DB_PORT=$PORT

export DB_PASSWORD=$(aws ssm get-parameter --name "/cjse-${WORKSPACE}-bichard-7/rds/db/password" --with-decryption \
  --query Parameter.Value --output text)

export DB_USER=$(aws ssm get-parameter --name "/cjse-${WORKSPACE}-bichard-7/rds/db/user" --with-decryption \
  --query Parameter.Value --output text)
  export DB_NAME=bichard
