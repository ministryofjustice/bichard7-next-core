#!/bin/bash
command='curl --insecure --silent --fail https://localhost:6443/elb-status';
server_started_status_code=0;
status=-1;

until [[ $status == $server_started_status_code ]]
do
  sleep 1;
  printf "*"
  eval $command;
  status=$?
done
