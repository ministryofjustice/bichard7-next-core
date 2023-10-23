#!/bin/bash

SCRIPT_DIR=$(dirname "$0")

cd ${SCRIPT_DIR}/../common
npm install
cd -

cd ${SCRIPT_DIR}/../core
npm install
cd -
