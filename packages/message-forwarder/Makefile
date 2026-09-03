goss: build
	GOSS_SLEEP=15 dgoss run -e DB_HOST=172.17.0.1 "message-forwarder:latest"
	dgoss run \
		-e S3_BUCKET_NAME="test-bucket" \
		-e AWS_ACCESS_KEY_ID="test-key" \
		-e AWS_SECRET_ACCESS_KEY="test-secret" \
		-e AWS_REGION="eu-west-2" \
		"message-forwarder:$(DOCKER_TAG)"