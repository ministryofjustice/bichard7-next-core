#!/usr/bin/env bash

if [ "${HTPASSWD}x" != "x" ]
then
  htpasswd -bc /nginx_auth/.htpasswd bichard ${HTPASSWD}
fi
/usr/sbin/nginx -g "daemon off;"
