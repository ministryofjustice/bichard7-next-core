from datetime import datetime
from typing import Any, Dict
from airflow.providers.amazon.aws.sensors.s3 import S3KeySensor
from airflow.decorators import dag, task
import os


@dag(schedule_interval=None, start_date=datetime(2021, 1, 1), catchup=False, tags=['example'])
def compare_single():
    """
    Function to run a single comparison test against Core.
    """
    @task()
    def compare() -> Dict[str, str]:

        return {
            'access_key_id': os.getenv("AWS_ACCESS_KEY_ID"),
            'secret_access_key': os.getenv("AWS_SECRET_ACCESS_KEY"),
        }

    s3_sensor = S3KeySensor(
        task_id='s3_file_check',
        poke_interval=60,
        timeout=180,
        soft_fail=False,
        retries=2,
        bucket_key="s3://bichard-7-emadk5-airflow/*",
        wildcard_match=True,
        bucket_name=None,
        aws_conn_id='aws_default')

    compare()

dag = compare_single()
