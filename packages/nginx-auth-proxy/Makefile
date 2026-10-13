SHELL := /bin/bash # Use bash syntax
image = nginx-auth-proxy

.PHONY: build-and-test
build-and-test: build unit-test-nginx goss

.PHONY: build-and-test-no-goss
build-and-test-no-goss: build unit-test-nginx

.PHONY: build-and-run
build-and-run: build run-test-nginx

.PHONY: build
build:
	bash build.sh

.PHONY: goss
goss:
	set -e; \
	if [[ "${SKIP_GOSS}x" == "truex" ]]; then \
	  echo "Skipping dgoss tests"; \
	else \
		dgoss run \
			-e CJSE_NGINX_USERSERVICE_DOMAIN="localhost/elb-status" \
			-e CJSE_NGINX_UI_DOMAIN="localhost/elb-status" \
			-e CJSE_NGINX_APP_DOMAIN="localhost/elb-status" \
			-e CJSE_NGINX_BICHARDBACKEND_DOMAIN="localhost/elb-status" \
			-e CJSE_NGINX_STATICSERVICE_DOMAIN="localhost/elb-status" \
			-e CJSE_NGINX_PROXYSSLVERIFY="off" \
			$(image); \
	fi

.PHONY: run-test-nginx
run-test-nginx:
	./test/test-nginx-setup.sh

.PHONY: build-test
build-test:
	cd ./test && ./build.sh

.PHONY: wait-for-nginx
wait-for-nginx:
	./scripts/wait-for-nginx.sh

.PHONY: unit-test-nginx
unit-test-nginx: build-test run-test-nginx wait-for-nginx
	docker run --rm --name nginx-auth-test -p 60001:60001 -p 60002:60002 -p 60003:60003 -p 60004:60004 -p 60005:60005 -p 60006:60006 -e TEST_HOSTS=https://172.17.0.1:6443,http://172.17.0.1:7080 nginx-auth-test
