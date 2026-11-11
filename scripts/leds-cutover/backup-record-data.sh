#!/bin/bash

MESSAGE_ID=$1

if [[ -z "$MESSAGE_ID" ]]; then
    echo "Message ID is required."
    exit 1
fi

# Postgres backup

. ./lib/db-env.sh reader

ERROR_LIST_BACKUP_FILE="${MESSAGE_ID}_error_list.json"
npx tsx ./lib/backup-pg-rows.ts "br7own.error_list" "message_id = '$MESSAGE_ID'" $ERROR_LIST_BACKUP_FILE

ERROR_ID=$(cat $ERROR_LIST_BACKUP_FILE | jq -r ".rows[0].error_id")

ERROR_LIST_NOTES_BACKUP_FILE="${MESSAGE_ID}_error_list_notes.json"
npx tsx ./lib/backup-pg-rows.ts "br7own.error_list_notes" "error_id = '$ERROR_ID'" $ERROR_LIST_NOTES_BACKUP_FILE

ERROR_LIST_TRIGGERS_BACKUP_FILE="${MESSAGE_ID}_error_list_triggers.json"
npx tsx ./lib/backup-pg-rows.ts "br7own.error_list_triggers" "error_id = '$ERROR_ID'" $ERROR_LIST_TRIGGERS_BACKUP_FILE

# Dynamodb backup

AUDIT_LOG_BACKUP_FILE="${MESSAGE_ID}_audit_log.json"
aws dynamodb execute-statement \
    --statement "SELECT * FROM \"bichard-7-${WORKSPACE}-audit-log\" WHERE \"messageId\" = '$MESSAGE_ID'" \
    > $AUDIT_LOG_BACKUP_FILE
echo "Backed up audit log record to: ${AUDIT_LOG_BACKUP_FILE}"

AUDIT_LOG_EVENTS_BACKUP_FILE="${MESSAGE_ID}_audit_log_events.json"
aws dynamodb execute-statement \
    --statement "SELECT * FROM \"bichard-7-${WORKSPACE}-audit-log-events\".\"messageIdIndex\" WHERE \"_messageId\" = '$MESSAGE_ID'" \
    > $AUDIT_LOG_EVENTS_BACKUP_FILE
echo "Backed up audit log events record to: ${AUDIT_LOG_EVENTS_BACKUP_FILE}"