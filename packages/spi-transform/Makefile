# Variables
# AWS_ACCOUNT_ID = 439237763202
# VAULT_PROFILE  = bichard7-shared-uat
REGION         = eu-west-2
IMAGE_NAME     = spi-transform
TAG            = latest
REGISTRY       = $(AWS_ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com

.PHONY: create-repo login build tag push deploy run-local

# Create the ECR repository
create-repo:
	aws-vault exec $(VAULT_PROFILE) -- aws ecr create-repository \
		--repository-name $(IMAGE_NAME) \
		--region $(REGION)

# Authenticate Docker to ECR using aws-vault
login:
	aws-vault exec $(VAULT_PROFILE) -- aws ecr get-login-password --region $(REGION) | \
	    docker login --username AWS --password-stdin $(REGISTRY)

# Build the container for linux/amd64 architecture
build:
	uv lock && \
	docker build --platform linux/amd64 -t $(IMAGE_NAME):$(TAG) .

# Tag the container image for ECR
tag:
	docker tag $(IMAGE_NAME):$(TAG) $(REGISTRY)/$(IMAGE_NAME):$(TAG)

# Push the container image to ECR
push:
	docker push $(REGISTRY)/$(IMAGE_NAME):$(TAG)

# Build, tag, and push everything in one command
deploy: build tag push

# Run locally using temporary credentials via aws-vault
run-local:
	aws-vault exec $(VAULT_PROFILE) -- docker run --rm -it \
		-e AWS_ACCESS_KEY_ID \
		-e AWS_SECRET_ACCESS_KEY \
		-e AWS_SESSION_TOKEN \
		-e AWS_DEFAULT_REGION=$(REGION) \
		$(IMAGE_NAME):$(TAG)

# Start a duckdb interactive shell with preconfigured credentials
# Example query `SELECT * FROM delta_scan('s3://bucket/path/to/table) LIMIT 10;`
query-delta:
	aws-vault exec $(VAULT_PROFILE) -- bash -c '\
			uvx --from duckdb-cli duckdb -cmd "INSTALL delta; LOAD delta; CREATE OR REPLACE SECRET delta_s1 (TYPE s3, PROVIDER credential_chain);"'
