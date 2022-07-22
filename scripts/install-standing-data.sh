#!/bin/bash

VERSIONS=$(npm view @moj-bichard7-developers/bichard7-next-data versions | tr "'" '"')

# Set minimum package version required
declare -i MAJOR=2 MINOR=0 PATCH=20
declare -i FROM_VERSION=MAJOR*10000+MINOR*100+PATCH

ALL_VERSIONS=$(echo $VERSIONS | jq -rj ".[] | { version: ., parsedVersion: (. | split(\".\")) } | .parsedVersion[] |= tonumber | select((.parsedVersion[0] * 10000) + (.parsedVersion[1] * 100) + .parsedVersion[2] >= $FROM_VERSION) | { c: (\" bichard7-next-data-\" + .version + \"@npm:@moj-bichard7-developers/bichard7-next-data@\" + .version) } | .c")
LATEST_VERSION=$(echo $VERSIONS | jq -rj ". | last | { c: (\" bichard7-next-data-latest@npm:@moj-bichard7-developers/bichard7-next-data@\" + .) } | .c")

npm i $ALL_VERSIONS$LATEST_VERSION
