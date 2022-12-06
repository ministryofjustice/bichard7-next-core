SHELL := /bin/bash

UID ?= $(shell id -u)
PIP_ADDITIONAL_REQUIREMENTS ?= apache-airflow-providers-amazon==2.6.0
AIRFLOW_ENV_VARS ?= _PIP_ADDITIONAL_REQUIREMENTS=$(PIP_ADDITIONAL_REQUIREMENTS) AIRFLOW_UID=$(UID)

.PHONY: airflow
.DEFAULT: airflow
airflow:
	$(AIRFLOW_ENV_VARS) docker-compose -f airflow/docker-compose.yaml up airflow-init
	$(AIRFLOW_ENV_VARS) docker-compose -f airflow/docker-compose.yaml up -d

.PHONY: destroy
destroy:
	docker-compose -f airflow/docker-compose.yaml down

.PHONY: add-aws-connection
add-aws-connection:
	docker-compose -f airflow/docker-compose.yaml run --rm airflow-cli connections delete 'aws_default' 2>/dev/null || true
	@docker-compose -f airflow/docker-compose.yaml run --rm airflow-cli connections add 'aws_default' \
    --conn-type 'aws' \
    --conn-login '${AWS_ACCESS_KEY_ID}' \
    --conn-password '${AWS_SECRET_ACCESS_KEY}' \
		--conn-extra '{"region_name": "eu-west-2", "aws_session_token": "${AWS_SESSION_TOKEN}"}'
