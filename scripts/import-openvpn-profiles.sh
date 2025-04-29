#!/bin/bash

OPENVPN_CLIENT="/Applications/OpenVPN Connect/OpenVPN Connect.app/contents/MacOS/OpenVPN Connect"

WORKSPACE=production aws-vault exec qsolution-production -- ./get-vpn-config.sh
"$OPENVPN_CLIENT" --remove-profile="B7 Production"
"$OPENVPN_CLIENT" --import-profile="~/cjse-production-config.ovpn" --name="B7 Production"

WORKSPACE=preprod aws-vault exec qsolution-pre-prod -- ./get-vpn-config.sh
"$OPENVPN_CLIENT" --remove-profile="B7 Preprod"
"$OPENVPN_CLIENT" --import-profile="~/cjse-preprod-config.ovpn" --name="B7 Preprod"

WORKSPACE=uat aws-vault exec bichard7-shared-uat -- ./get-vpn-config.sh
"$OPENVPN_CLIENT" --remove-profile="B7 UAT"
"$OPENVPN_CLIENT" --import-profile="~/cjse-uat-config.ovpn" --name="B7 UAT"

WORKSPACE=leds aws-vault exec bichard7-shared-uat -- ./get-vpn-config.sh
"$OPENVPN_CLIENT" --remove-profile="B7 LEDS"
"$OPENVPN_CLIENT" --import-profile="~/cjse-leds-config.ovpn" --name="B7 LEDS"

WORKSPACE=e2e-test aws-vault exec bichard7-shared-e2e-test -- ./get-vpn-config.sh
"$OPENVPN_CLIENT" --remove-profile="B7 e2e test"
"$OPENVPN_CLIENT" --import-profile="~/cjse-e2e-test-config.ovpn" --name="B7 e2e test"
