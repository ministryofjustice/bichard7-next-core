#!/bin/bash

/liquibase/docker-entrypoint.sh \
  --logLevel info --defaultsFile=${LIQUIBASE_PROPERTIES_FILE} update && \
  touch ~/completed && \
  if [[ \"${EXIT_AFTER_SCRIPT}x\" == \"truex\" ]]; then echo 'Exiting...'; else tail -f /dev/null; fi
