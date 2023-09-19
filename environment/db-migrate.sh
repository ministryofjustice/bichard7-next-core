#!/bin/bash

docker-compose \
    -f environment/docker-compose.yml \
    run --no-deps --rm db-migrate
