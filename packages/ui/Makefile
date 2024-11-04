.PHONY: $(MAKECMDGOALS)

UID ?= $(shell id -u)
DB_CONTAINER = $(shell docker ps -aqf "name=bichard7-next_pg")
DB_HOST = $(shell docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(DB_CONTAINER))
DOCKER_COMPOSE = env UID=$(UID) docker-compose

export DOCKER_COMPOSE

build:
	cd ../.. && ./scripts/build-ui-docker.sh

run:
	docker run -p 4080:443 -e DB_HOST=$(DB_HOST) ui

goss:
	GOSS_SLEEP=5 dgoss run -e DB_HOST=$(DB_HOST) "ui:latest"

setup-e2e-env:
	cd ../.. && ./scripts/setup-e2e-env.sh

generate-codebuild-vpn:
	cd ../.. && ./scripts/generate-codebuild-vpn.sh

.PHONY: destroy
destroy:
	$(DOCKER_COMPOSE) down
