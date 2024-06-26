import boto3


def fetchLoginLogs(start_timestamp, end_timestamp):
    dynamodb = boto3.client('dynamodb')
    table_name = 'bichard-7-production-audit-log-events'
    index_name = 'eventCodeIndex'
    key_condition_expression = 'eventCode = :code and #ts BETWEEN :start_time AND :end_time'
    expression_attribute_names = {'#ts': 'timestamp'}
    expression_attribute_values = {
        ':code': {'S': 'user.logged-in'},
        ':start_time': {'S': start_timestamp},
        ':end_time': {'S': end_timestamp}
    }

    return dynamodb.query(
        TableName=table_name,
        IndexName=index_name,
        KeyConditionExpression=key_condition_expression,
        ExpressionAttributeNames=expression_attribute_names,
        ExpressionAttributeValues=expression_attribute_values
    )
