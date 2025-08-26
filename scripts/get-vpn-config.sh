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
if [[ "${SERVICE}x" == "ledsx" ]]; then
  OVPN_FILENAME=~/cjse-${SSM_KEY}-leds-config.ovpn
  VPN_ENDPOINT=$(aws ec2 describe-client-vpn-endpoints | \
        jq -r ".ClientVpnEndpoints[] | select(.Description == \"${SSM_KEY} LEDS VPN\") | .DnsName" | \
        sed -e 's/*/vpn/')
else
  OVPN_FILENAME=~/cjse-${SSM_KEY}-config.ovpn
fi

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
  --output text > $OVPN_FILENAME

echo "Creating VPN Config"
sed -i.bak '/client1.domain.tld.crt/,$d' $OVPN_FILENAME
sed -i '' '/cert \.\/client\.crt/d' $OVPN_FILENAME
sed -i '' '/key \.\/client\.key/d' $OVPN_FILENAME

if [[ ! -z "${VPN_ENDPOINT}" ]]; then
  sed -r -i.bak "s/([\s\S]*remote )(.*)( 443[\s\S]*)/\1${VPN_ENDPOINT}\3/" $OVPN_FILENAME
fi

CERT=$(sed  -n '/-----BEGIN CERTIFICATE-----/,$P' /tmp/${SSM_KEY}-client1.domain.tld.crt)
echo -e "<cert>\n${CERT}\n</cert>" >> $OVPN_FILENAME
KEY=$(cat /tmp/${SSM_KEY}-client1.domain.tld.key)
echo -e "<key>\n${KEY}\n</key>" >> $OVPN_FILENAME

rm -f /tmp/${SSM_KEY}-client1.domain.tld.crt || true
rm -f /tmp/${SSM_KEY}-client1.domain.tld.key || true

echo "Certificate created at $OVPN_FILENAME"
echo "Please import this file into your vpn client to connect to the ${WORKSPACE} environment"
