#!/bin/bash

. ./lib/common.sh

ASN=$1

if [[ -z "$ASN" ]]; then
    echo "ASN is missing."
    exit 1
fi

execute_code "./lib/findDisposalsByAsn.ts" "
    const result = await fn('${ASN}');
    logJson(result);
" | jq
