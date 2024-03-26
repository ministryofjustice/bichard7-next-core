#!/usr/bin/env bash

set -e

export PGPASSWORD=${PGPASSWORD:-password}
dbname="bichard"
schema="br7own"
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

host="host.docker.internal"
if [ "${DB_HOST}" != "" ]
then
  host=$DB_HOST
fi

echo "Connecting to Postgres on $host"

function run_psql {
  docker run --rm -e PGPASSWORD -v ${PWD}/${folder}:/data -v ${SCRIPT_DIR}/..:/scripts jbergknoff/postgresql-client -U bichard -h $host -d $dbname -v "ON_ERROR_STOP=1" -f "$1"
}

run_psql "/scripts/force_code/test.sql"
