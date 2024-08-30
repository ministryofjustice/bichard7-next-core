# Resolve specific triggers

## Summary
This script is for resolving specific triggers for specific court cases in Bichard.
It marks triggers as resolved, updates the court case if needed, and generates relevant audit log events.

The script keeps track of the court cases that have been processed. In case of rerunning the script for the same IDs, it ignores the IDs that have already been processed.

This script runs in a Postgres transaction. It updates the Postgres database first and then the DynamoDB table for audit log events. If there is a runtime exception, changes to the Postgres database will be rolled back.

## Prerequisite

This script has references to both the `bichard7-next-audit-logging` and `bichard7-next-ui` code.
You need to make sure that you have cloned the `bichard7-next-audit-logging`.

## Run the script

The following shell command runs the script. Please see below for details about the environment variables.

```sh
$   WORKSPACE="replace-with-workspace-name" \
    CASES_TO_RESOLVE_FILE="/court-case-ids-to-resolve.json" \
    TRIGGER_CODES="TRPR0002,TRPR0012" \
    TRIGGER_NOTE="Resolved by system user as requested" \
    RESOLVER_USERNAME="System" \
    BATCH_SIZE=1000 \
    aws-vault exec replace-with-aws-acount -- \
    npx ts-node -T ./scripts/utility/resolve-triggers/index.ts
```

## Environment Variables

| Variable name | Description | Example |
| ------------- | ----------- | ------- |
| `WORKSPACE` | Name of the workspace in the AWS account. Used to find the resources. | `production`  |
| `TRIGGER_CODES` | List of triggers to resolve | `TRPR0002,TRPR0012`  |
| `TRIGGER_NOTE`  | Used to add a note to court case notes and audit log event  | `Resolved by System as requested by XYZ force`  |
| `CASES_TO_RESOLVE_FILE` | JSON array file containing court case IDs. ID is the `error_id` in `error_list` table  | `["230043","34588"]`  |
| `RESOLVER_USERNAME` | Triggers are resolved by this username. Default value is `System` | `john.smith`  |
| `BATCH_SIZE`  | Number of court case IDs to process. The default value is 10, meaning that only 10 IDs from `CASES_TO_RESOLVE_FILE` will be processed. Set to `0` for processing all IDs. | `100` |