SHELL := /bin/bash

UID ?= $(shell id -u)

.PHONY: airflow
.DEFAULT: airflow
airflow:
	AIRFLOW_UID=$(UID) docker-compose -f airflow/docker-compose.yaml up airflow-init
	AIRFLOW_UID=$(UID) docker-compose -f airflow/docker-compose.yaml up -d

.PHONY: destroy
destroy:
	docker-compose -f airflow/docker-compose.yaml down

.PHONY: add-aws-connection
add-aws-connection:
	docker-compose run --rm airflow-cli "airflow connections add 'aws_connection' \
    --conn-type 'aws' \
    --conn-login '${AWS_ACCESS_KEY_ID}' \
    --conn-password '${AWS_SECRET_ACCESS_KEY}'"
