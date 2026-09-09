#! /bin/bash

# All variables used in templates need a default provided here
export CJSE_NGINX_DNS_RESOLVER=${CJSE_NGINX_DNS_RESOLVER:-127.0.0.11}

envsubst '$CJSE_NGINX_DNS_RESOLVER' < /etc/templates/conductor.https.tpl > /etc/nginx/conf.d/conductor.https.conf

if [ "$CJSE_CONDUCTOR_ENABLE_HTTP" = "true" ]
then
  envsubst '$CJSE_NGINX_DNS_RESOLVER' < /etc/templates/conductor.http.tpl > /etc/nginx/conf.d/conductor.http.conf
fi
