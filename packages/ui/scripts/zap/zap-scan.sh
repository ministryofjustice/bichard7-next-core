#!/bin/bash

echo "IS CI? ${IS_CI}"

if [[ "${IS_CI}" == "true" ]]; then
  echo "Preparing ZAP workspace"
  chmod -R 777 $(pwd)/scripts/zap
fi

echo "Running ZAP"

docker run \
  --rm \
  --network="bichard_default" \
  -v $(pwd)/scripts/zap:/zap/wrk:rw \
  -e ZAP_AUTH_TOKEN="${ZAP_AUTH_TOKEN}" \
  -t ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py -I -j \
    -t https://ui:9443/bichard \
    -c /zap/wrk/zap-ignore.config \
    -z "-configfile /zap/wrk/zap.config -config replacer.full_list(0).replacement=${ZAP_AUTH_TOKEN}"
