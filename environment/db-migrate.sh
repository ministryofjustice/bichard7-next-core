#!/bin/bash

docker compose \
    --project-name bichard \
    -f environment/docker-compose.yml \
    run --no-deps --rm db-migrate
