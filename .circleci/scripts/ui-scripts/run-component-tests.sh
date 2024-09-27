#!/bin/sh
cd ~/packages/ui

if [[ $MS_EDGE == "true" ]]; then
  npm run cypress:run:component:docker:ms-edge
else
  npm run cypress:run:component:docker
fi
