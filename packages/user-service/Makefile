.PHONY: $(MAKECMDGOALS)

build:
	cd ../.. && ./scripts/build-user-service-docker.sh

run:
	docker run -p 3443:443 -e DB_HOST=172.17.0.1 user-service

goss:
	GOSS_SLEEP=15 dgoss run -e DB_HOST=172.17.0.1 "user-service:latest"
