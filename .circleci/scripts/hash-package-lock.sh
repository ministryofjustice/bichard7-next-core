#!/bin/bash

md5="md5"
if ! command -v $md5 &> /dev/null
then
    md5="md5sum"
fi

$md5 package-lock.json > package-lock.json.md5
$md5 api/package-lock.json > api/package-lock.json.md5
