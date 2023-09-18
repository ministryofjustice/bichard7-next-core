#!/bin/bash

LIQUIBASE_PROPERTIES=/liquibase/changelog/liquibase.seeds.properties \
  docker compose \
    --project-name bichard \
    -f environment/docker-compose-migrations.yml \
    run --rm liquibase
