#!/usr/bin/env bash

set -ev

TEMP_ROLE=$(aws sts assume-role --role-session-name "next" --role-arn "${ASSUME_ROLE_ARN}")
export AWS_ACCESS_KEY_ID=$(echo $TEMP_ROLE | jq -r .Credentials.AccessKeyId)
export AWS_SECRET_ACCESS_KEY=$(echo $TEMP_ROLE | jq -r .Credentials.SecretAccessKey)
export AWS_SESSION_TOKEN=$(echo $TEMP_ROLE | jq -r .Credentials.SessionToken)

aws ssm get-parameter \
  --name /cjse-bichard7-${WORKSPACE}-base-infra/vpn/user_private_key \
  --with-decryption --query "Parameter.Value" --output text > ~/client1.domain.tld.key
aws ssm get-parameter \
  --name /cjse-bichard7-${WORKSPACE}-base-infra/vpn/user_certificate_body \
  --with-decryption --query "Parameter.Value" --output text > ~/client1.domain.tld.crt
aws ssm get-parameter \
  --name /cjse-bichard7-${WORKSPACE}-base-infra/vpn/certificate_chain \
  --with-decryption --query "Parameter.Value" --output text > ~/ca.crt
aws ssm get-parameter \
  --name /cjse-bichard7-${WORKSPACE}-base-infra/vpn/config \
  --with-decryption --query "Parameter.Value" --output text > ~/cjse-${WORKSPACE}-config.ovpn

sed -i '/client1.domain.tld.crt/Q' ~/cjse-${WORKSPACE}-config.ovpn
CERT=$(sed  -n '/-----BEGIN CERTIFICATE-----/,$P' ~/client1.domain.tld.crt)
echo -e "<cert>\n${CERT}\n</cert>" >> ~/cjse-${WORKSPACE}-config.ovpn
KEY=$(cat ~/client1.domain.tld.key)
echo -e "<key>\n${KEY}\n</key>" >> ~/cjse-${WORKSPACE}-config.ovpn
