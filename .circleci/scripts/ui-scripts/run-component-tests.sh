#!/bin/sh
cd ~/project/packages/ui

if [[ $MS_EDGE == "true" ]]; then
  npm run cypress:run:component:docker:ms-edge
else
  npm run cypress:run:component:docker
fi
