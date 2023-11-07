#! /bin/bash
set -e

S3_PATH=$1
LOCAL_PATH="${S3_PATH/s3:\/\/bichard-7-production-processing-validation//tmp/comparison}"
SUMMARY_FILE="${LOCAL_PATH/.json/.summary.txt}"
AUDIT_LOG_FILE="${LOCAL_PATH/.json/.auditlog.json}"
PNC_LOG_FILE="${LOCAL_PATH/.json/.pnclog.json}"
API_KEY=$(aws ssm get-parameter --name /cjse-production-bichard-7/audit-logging/api-key --with-decryption --query "Parameter.Value" --output text)

npm run compare:summarise $S3_PATH

CORRELATION_ID=$(grep -E 'Correlation ID:' $SUMMARY_FILE  | cut -d ":" -f 2 | tr -d " ")
curl -s -H "X-Api-Key: ${API_KEY}" https://xylflxxbue.execute-api.eu-west-2.amazonaws.com/production/messages/${CORRELATION_ID} | jq .[0] > $AUDIT_LOG_FILE
code $AUDIT_LOG_FILE

jq -r '.events[].attributes."PNC Request Message" | select(. != null)' $AUDIT_LOG_FILE > $PNC_LOG_FILE
code $PNC_LOG_FILE

npm run compare -- -c -x -f $S3_PATH
