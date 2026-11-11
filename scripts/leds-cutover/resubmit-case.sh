#!/bin/bash

MESSAGE_ID=$1

if [[ -z "$MESSAGE_ID" ]]; then
    echo "Message ID is required."
    exit 1
fi

