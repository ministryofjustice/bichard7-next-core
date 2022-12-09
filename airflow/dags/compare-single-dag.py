from datetime import datetime
from typing import Any, Dict
from airflow.providers.amazon.aws.operators.lambda_function import AwsLambdaInvokeFunctionOperator
from airflow.decorators import dag, task
import json
import os


@dag(schedule_interval=None, start_date=datetime(2021, 1, 1), catchup=False, tags=['example'])
def compare_single():
    # """
    # Operator to invoke compare single lambda
    # """
    AwsLambdaInvokeFunctionOperator(
        task_id='invoke_lambda',
        function_name="bichard-7-emadk6-compare-single",
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
