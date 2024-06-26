import subprocess
import json
import datetime
import time


def toUnixTimeStamp(dateString):
    return int(datetime.datetime.fromisoformat(dateString.replace('Z', '+00:00')).timestamp())


def runQuery(query_string, start_timestamp, end_timestamp, log_group_name):
    query_id_cmd = f'aws logs start-query --log-group-name "{log_group_name}" \
                  --start-time {toUnixTimeStamp(start_timestamp)} --end-time {toUnixTimeStamp(end_timestamp)} --output "text" --query-string \'{query_string}\''
    query_id_output = subprocess.check_output(
        query_id_cmd, shell=True, universal_newlines=True)
    query_id = query_id_output.strip()

    print(f"Running query {query_id}")

    # check the query status until it is complete
    query_status = ''
    while query_status != 'Complete':
        query_status_cmd = f'aws logs get-query-results --query-id {query_id}'
        query_status_output = subprocess.check_output(
            query_status_cmd, shell=True, universal_newlines=True)
        query_status_json = json.loads(query_status_output)
        query_status = query_status_json['status']
        print(".", end="", flush=True)
        time.sleep(1)

    print("\nQuery complete")

    # get the query results
    query_results_cmd = f'aws logs get-query-results --query-id {query_id}'
    query_results_output = subprocess.check_output(
        query_results_cmd, shell=True, universal_newlines=True)
    return json.loads(query_results_output)


def fetchLogs(start_timestamp, end_timestamp, keyword):
    print("Fetch logs")

    query_string = f'''fields @timestamp as timestamp, @message as message
                    | filter @logStream like "bichard7-web"
                    | filter message like "{keyword}"
                    | sort @timestamp desc
                    | limit 10000'''

    return runQuery(query_string, start_timestamp, end_timestamp, "cjse-bichard7-production-base-infra-bichard7")
