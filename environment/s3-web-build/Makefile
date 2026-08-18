SHELL := /bin/bash # Use bash syntax
DOCKER_TAG ?= latest

.PHONY: build install-goss goss

build:
	bash build.sh

# Install goss and dgoss using the script
install-goss:
	sudo bash ../../scripts/install-goss.sh

# Run goss container tests
goss:
	GOSS_FILES_PATH=. GOSS_SLEEP=5 \
	dgoss run \
			-e S3_BUCKET_NAME="test-bucket" \
			-e AWS_ACCESS_KEY_ID="test-key" \
			-e AWS_SECRET_ACCESS_KEY="test-secret" \
			-e AWS_REGION="eu-west-2" \
			"s3-web-proxy:$(DOCKER_TAG)"