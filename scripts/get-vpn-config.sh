#!/usr/bin/env bash

set -e

if [[ ! -z "${ASSUME_ROLE_ARN}" ]] && [[ ! -z "${AWS_ACCOUNT_NAME}" ]]; then
	echo "Assuming provided role"
	TEMP_ROLE=$(aws sts assume-role --role-arn "${ASSUME_ROLE_ARN}" --role-session-name "${AWS_ACCOUNT_NAME}")
fi
if [[ ! -z "${CHILD_ACCOUNT_ID}" ]] && [[ ! -z "${ACCOUNT_ID}" ]]; then
	echo "Assuming CI role on ${CHILD_ACCOUNT_ID}"
	TEMP_ROLE=$(aws sts assume-role --role-arn "arn:aws:iam::${CHILD_ACCOUNT_ID}:role/Bichard7-CI-Access" --role-session-name "${ACCOUNT_ID}")
fi

if [[ ! -z "${TEMP_ROLE}" ]]; then
	echo "Setting temporary credentials"
	# This unset is if you are using it locally with aws-vault
	unset AWS_SECURITY_TOKEN
	export AWS_ACCESS_KEY_ID=$(echo $TEMP_ROLE | jq -r .Credentials.AccessKeyId)
	export AWS_SECRET_ACCESS_KEY=$(echo $TEMP_ROLE | jq -r .Credentials.SecretAccessKey)
	export AWS_SESSION_TOKEN="$(echo $TEMP_ROLE | jq -r .Credentials.SessionToken)"
fi
echo "Retrieving VPN Config Files for ${WORKSPACE}"

SSM_KEY=$(echo $WORKSPACE | tr -d '_')
aws ssm get-parameter \
	--name /cjse-bichard7-${SSM_KEY}-base-infra/vpn/user_private_key \
	--with-decryption --query "Parameter.Value" \
	--output text >/tmp/${SSM_KEY}-client1.domain.tld.key

aws ssm get-parameter \
	--name /cjse-bichard7-${SSM_KEY}-base-infra/vpn/user_certificate_body \
	--with-decryption --query "Parameter.Value" \
	--output text >/tmp/${SSM_KEY}-client1.domain.tld.crt

aws ssm get-parameter \
	--name /cjse-bichard7-${SSM_KEY}-base-infra/vpn/config \
	--with-decryption --query "Parameter.Value" \
	--output text >~/cjse-${SSM_KEY}-config.ovpn

echo "Creating VPN Config"
sed -i.bak '/client1.domain.tld.crt/,$d' ~/cjse-${SSM_KEY}-config.ovpn
CERT=$(sed -n '/-----BEGIN CERTIFICATE-----/,$P' /tmp/${SSM_KEY}-client1.domain.tld.crt)
echo -e "<cert>\n${CERT}\n</cert>" >>~/cjse-${SSM_KEY}-config.ovpn
KEY=$(cat /tmp/${SSM_KEY}-client1.domain.tld.key)
echo -e "<key>\n${KEY}\n</key>" >>~/cjse-${SSM_KEY}-config.ovpn

rm -f /tmp/${SSM_KEY}-client1.domain.tld.crt || true
rm -f /tmp/${SSM_KEY}-client1.domain.tld.key || true

echo "Certificate created at ~/cjse-${SSM_KEY}-config.ovpn"
echo "Please import this file into your vpn client to connect to the ${WORKSPACE} environment"
