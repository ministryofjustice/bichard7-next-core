.PHONY: $(MAKECMDGOALS)

build:
	cd ../.. && ./scripts/build-user-service-docker.sh

run:
	docker run -p 3443:443 -e DB_HOST=172.17.0.1 user-service

goss: build
	GOSS_SLEEP=15 dgoss run -e DB_HOST=172.17.0.1 "user-service:latest"
	dgoss run \
		-e S3_BUCKET_NAME="test-bucket" \
		-e AWS_ACCESS_KEY_ID="test-key" \
		-e AWS_SECRET_ACCESS_KEY="test-secret" \
		-e AWS_REGION="eu-west-2" \
		"user-service:$(DOCKER_TAG)"
