#!/usr/bin/env bash

set -e

if [[ "${NODE_ENV}" != "production" && -z "${CI}" ]]; then
    npx husky install
fi
