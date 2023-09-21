#!/bin/bash

docker-compose \
    --project-name bichard \
    -f environment/docker-compose.yml \
    up --no-deps --wait db-migrate
