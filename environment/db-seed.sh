#!/bin/bash

EXIT_AFTER_SCRIPT=true docker-compose \
    --project-name bichard \
    -f environment/docker-compose.yml \
    run --no-deps db-seed --rm db-seed
