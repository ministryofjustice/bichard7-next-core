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

goss:build
	GOSS_SLEEP=5 dgoss run -e DB_HOST=$(DB_HOST) "ui:latest"
	dgoss run \
		-e S3_BUCKET_NAME="test-bucket" \
		-e AWS_ACCESS_KEY_ID="test-key" \
		-e AWS_SECRET_ACCESS_KEY="test-secret" \
		-e AWS_REGION="eu-west-2" \
		"ui:$(DOCKER_TAG)"

setup-e2e-env:
	cd ../.. && ./scripts/setup-e2e-env.sh

generate-codebuild-vpn:
	cd ../.. && ./scripts/generate-codebuild-vpn.sh

.PHONY: destroy
destroy:
	$(DOCKER_COMPOSE) down
