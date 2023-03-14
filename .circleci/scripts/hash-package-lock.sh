#!/bin/bash

md5="md5"
if ! command -v $md5 &> /dev/null
then
    md5="md5sum"
fi

$md5 ./core/package-lock.json > ./core/package-lock.json.md5
