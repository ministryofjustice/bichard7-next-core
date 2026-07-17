#!/usr/bin/env bash

curl 169.254.170.2$AWS_CONTAINER_CREDENTIALS_RELATIVE_URI > /tmp/credentials

TIME=$(date "+%D at %T")

echo "Cycling credentials ${TIME}"

cat <<EOT > ~/.aws/credentials
[default]
aws_access_key_id=$(cat /tmp/credentials | jq ."AccessKeyId")
aws_secret_access_key=$(cat /tmp/credentials | jq ."SecretAccessKey")
aws_session_token=$(cat /tmp/credentials | jq ."Token")
EOT

export AWS_ACCESS_KEY_ID=$(cat /tmp/credentials | jq ."AccessKeyId")
export AWS_SECRET_ACCESS_KEY=$(cat /tmp/credentials | jq ."SecretAccessKey")
export AWS_SESSION_TOKEN=$(cat /tmp/credentials | jq ."Token")
rm -rf /tmp/credentials

envsubst '${NGINX_SERVER_NAME} ${S3_BUCKET_NAME} ${AWS_ACCESS_KEY_ID} ${AWS_SECRET_ACCESS_KEY}' < /etc/nginx/nginx.conf.tpl > /etc/nginx/nginx.conf
nginx -s reload
