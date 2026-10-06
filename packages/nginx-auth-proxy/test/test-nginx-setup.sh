#!/bin/bash

set -e

IMAGE="nginx-auth-proxy"

docker rm -f test-nginx-server || true

docker run -e CJSE_NGINX_APP_DOMAIN=172.17.0.1:60001 \
	-e CJSE_NGINX_USERSERVICE_DOMAIN=172.17.0.1:60002 \
	-e CJSE_NGINX_UI_DOMAIN=172.17.0.1:60006 \
	-e CJSE_NGINX_STATICSERVICE_DOMAIN=172.17.0.1:60004 \
	-e CJSE_NGINX_BICHARDBACKEND_DOMAIN=172.17.0.1:60005 \
	-e CJSE_NGINX_PROXYSSLVERIFY="off" \
	-p 6443:8443 -d \
	-p 7080:8080 -d \
	--name test-nginx-server \
	$IMAGE
