from fetchLogs import runQuery


def fetchAuthProxyLogs(start_timestamp, end_timestamp, keyword1, keyword2, keyword3):
    print("Fetch logs")

    query_string = f'''fields @timestamp as timestamp, @message as message
                    | filter @logStream like "nginx-auth-proxy"
                    | filter message like "{keyword1}"
                    | filter message like "{keyword2}"
                    | filter message like "{keyword3}"
                    | sort @timestamp desc
                    | limit 10000'''

    return runQuery(query_string, start_timestamp, end_timestamp, "cjse-bichard7-production-base-infra-nginx-auth-proxy")
