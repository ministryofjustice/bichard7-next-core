#!/usr/bin/env bash

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

$SCRIPT_DIR/archive_met_police_records/test.sh
$SCRIPT_DIR/archive_resolved_records/test.sh
$SCRIPT_DIR/archive_error_records/test.sh