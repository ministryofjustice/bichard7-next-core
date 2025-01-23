#!/bin/bash

set -e

echo "Connecting to vpn in ${WORKSPACE} on ${AWS_ACCOUNT_NAME} if required"

if [[ "${USE_PEERING}x" != "truex" ]]; then
  make get-vpn-config
  openvpn --config ~/cjse-${WORKSPACE}-config.ovpn --daemon
fi
