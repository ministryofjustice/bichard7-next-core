# Variables
AWS_ACCOUNT_ID = 439237763202
REGION         = eu-west-2
VAULT_PROFILE  = bichard7-shared-uat
IMAGE_NAME     = ecs-metrics-aggregator
TAG            = latest
REGISTRY       = $(AWS_ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com
LAMBDA_NAME    = bichard-7-demo-status-page-lambda

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
	docker build --platform linux/amd64 -t $(IMAGE_NAME):$(TAG) .

# Tag the container image for ECR
tag:
	docker tag $(IMAGE_NAME):$(TAG) $(REGISTRY)/$(IMAGE_NAME):$(TAG)

# Push the container image to ECR
push:
	docker push $(REGISTRY)/$(IMAGE_NAME):$(TAG)

# point the lambda at the correct image version
update-lambda:
	aws-vault exec $(VAULT_PROFILE) -- aws lambda update-function-code \
	    --function-name $(LAMBDA_NAME) --image-uri $(REGISTRY)/$(IMAGE_NAME):$(TAG)

# Build, tag, and push everything in one command
deploy: build tag push update-lambda

# Run locally using temporary credentials via aws-vault
run-local:
	aws-vault exec $(VAULT_PROFILE) -- docker run --rm -it \
		-e AWS_ACCESS_KEY_ID \
		-e AWS_SECRET_ACCESS_KEY \
		-e AWS_SESSION_TOKEN \
		-e AWS_DEFAULT_REGION=$(REGION) \
		$(IMAGE_NAME):$(TAG)
