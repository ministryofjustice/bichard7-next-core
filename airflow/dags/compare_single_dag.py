from datetime import datetime
from airflow.providers.amazon.aws.operators.lambda_function import AwsLambdaInvokeFunctionOperator
from airflow.decorators import dag
import json
import os

COMPARE_SINGLE_LAMBDA_NAME = os.getenv(
    "AIRFLOW__CORE__VAR_COMPARE_SINGLE_LAMBDA_NAME")


@dag(schedule_interval=None, start_date=datetime(2021, 1, 1), catchup=False, tags=['example'])
def compare_single():
    # """
    # Operator to invoke compare single lambda
    # """
    AwsLambdaInvokeFunctionOperator(
        task_id='invoke_lambda',
        function_name = COMPARE_SINGLE_LAMBDA_NAME,
        payload=json.dumps({
            "detail": {
                "object": {
                    "key": "{{ dag_run.conf['objectKey'] }}",

                },
                "bucket": {
                    "name": "bichard-7-emadk6-processing-validation"
                }
            }
        }),
    )


dag = compare_single()
