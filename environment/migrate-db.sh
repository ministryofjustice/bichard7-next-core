#!/bin/bash

LIQUIBASE_PROPERTIES=/liquibase/changelog/liquibase.migrations.properties \
  docker compose \
    --project-name bichard \
    -f environment/docker-compose-migrations.yml \
    run --rm liquibase
