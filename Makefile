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
