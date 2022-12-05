from datetime import datetime
from typing import Any, Dict

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

    compare()

dag = compare_single()
