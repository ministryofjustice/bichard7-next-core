#!/usr/bin/env bash

if [[ ! -d "./node_modules/govuk-frontend" && ! -L "./node_modules/govuk-frontend" ]]; then
  ln -sf ../../../node_modules/govuk-frontend ./node_modules/govuk-frontend
fi

if [[ ! -d "./node_modules/@ministryofjustice" &&  ! -L "./node_modules/@ministryofjustice" ]]; then
  ln -sf ../../../node_modules/@ministryofjustice ./node_modules/@ministryofjustice
fi

if [[ ! -d "./node_modules/cypress" &&  ! -L "./node_modules/cypress" ]]; then
  ln -sf ../../../node_modules/cypress ./node_modules/cypress
fi
