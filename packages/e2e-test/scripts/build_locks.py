#!/usr/bin/env python3
#
# Copyright 2020 Carica Labs, LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import sys
import time
import uuid
from datetime import datetime, timedelta

import boto3
import click
from click import INT, BadArgumentUsage
from dateutil import tz


def _epoch_str(dt: datetime) -> str:
    return dt.strftime('%s')


@click.group()
def cli():
    """
    Acquire or release a named mutex stored in a DynamoDB table in the
    default region.

    `UpdateItem` and `DeleteItem` permissions are needed.
    """
    pass


@cli.command(name='acquire')
@click.argument('table')
@click.argument('project')
@click.argument('duration', type=INT)
@click.argument('timeout', type=INT)
def acquire(table, project, duration, timeout):
    """
    Acquire the lock for the specified PROJECT for a limited time.

    An item is stored in the DynamoDB TABLE that indicates that the lock is now
    held until DURATION seconds elapses (or it is manually released).  If the
    lock is held by another process, the command tries to acquire it for
    TIMEOUT seconds before failing.

    Prints a lock token to stdout when acquired.  Pass this token to "release"
    to release the lock before its DURATION elapses.

    Returns 0 on success, non-zero on error.
    """
    if duration <= 0:
        raise BadArgumentUsage('duration must be a positive number')
    if timeout <= 0:
        raise BadArgumentUsage('timeout must be a positive number')

    # Use UTC timestamps for item data
    now = datetime.now(tz=tz.UTC)
    expire_at = now + timedelta(seconds=duration)

    # Use monotonic time for acquisition timeout
    timeout_at = time.monotonic() + timeout

    token = str(uuid.uuid4())

    dynamodb = boto3.client('dynamodb')

    while True:
        if time.monotonic() >= timeout_at:
            print('timeout acquiring lock', file=sys.stderr)
            sys.exit(1)

        try:
            dynamodb.update_item(
                TableName=table,
                Key={'project_name': {'S': project}},
                UpdateExpression='SET expire_at = :expire_at, lock_token = :token',
                ConditionExpression='attribute_not_exists(project_name) OR expire_at < :now',
                ExpressionAttributeValues={
                    ':now': {'N': _epoch_str(now)},
                    ':expire_at': {'N': _epoch_str(expire_at)},
                    ':token': {'S': token},
                })
            # Don't remove this print statement, we need this for the actual lock tokens to work
            print(token)
            sys.exit(0)
        except dynamodb.exceptions.ConditionalCheckFailedException:
            pass

        time.sleep(5)


@cli.command(name='release')
@click.argument('table')
@click.argument('project')
@click.argument('token')
def release(table, project, token):
    """
    Release the lock associated with the specified PROJECT.

    The item in the DynamoDB TABLE is updated to release the lock if it's still held
    by the owner who was issued TOKEN.

    Returns 0 if the lock was released or has expired or is now owned by someone
    else.

    Returns non-zero if the state of the lock is unknown.
    """
    token = token.strip()
    dynamodb = boto3.client('dynamodb')
    try:
        dynamodb.delete_item(
            TableName=table,
            Key={'project_name': {'S': project}},
            ConditionExpression='lock_token = :token',
            ExpressionAttributeValues={
                ':token': {'S': token},
            })
    except dynamodb.exceptions.ConditionalCheckFailedException:
        # Someone else owns the lock now
        pass

    sys.exit(0)


if __name__ == '__main__':
    cli()
