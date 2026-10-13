#!/usr/bin/env bash

set -e

export readonly REPOSITORY_NAME="nginx-auth-proxy"
export readonly SOURCE_REPOSITORY_NAME="amazon-linux2023-base"
export readonly GOSS_SLEEP=0
export readonly GOSS_ENV="-e CJSE_NGINX_USERSERVICE_DOMAIN='localhost/elb-status' -e CJSE_NGINX_UI_DOMAIN='localhost/elb-status' -e CJSE_NGINX_APP_DOMAIN='localhost/elb-status' -e CJSE_NGINX_BICHARDBACKEND_DOMAIN='localhost/elb-status' -e CJSE_NGINX_STATICSERVICE_DOMAIN='localhost/elb-status' -e CJSE_NGINX_PROXYSSLVERIFY='off'"

/bin/bash ../scripts/build_and_push_image.sh
