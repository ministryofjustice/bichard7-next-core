chmod 777 ./scripts/zap

docker run \
  --rm \
  --network="bichard_default" \
  -v $(pwd)/scripts/zap:/zap/wrk:rw \
  -t ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py -I -j \
    -t https://ui:9443/bichard \
    -c /zap/wrk/zap-ignore.config \
    -z "-configfile /zap/wrk/zap.config"
