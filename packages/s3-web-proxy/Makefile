SHELL := /bin/bash # Use bash syntax
.PHONY: build install-goss test-goss

build:
	bash build.sh

# Install goss and dgoss using the script
install goss:
	sudo bash ../../scripts/install-goss.sh

# Run goss container tests
test goss:
	GOSS_FILE=packages/s3-web-proxy/goss.yaml GOSS_SLEEP=5 \
	dgoss run -e S3_BUCKET_NAME="test-bucket" "s3-web-proxy:$(DOCKER_TAG)"