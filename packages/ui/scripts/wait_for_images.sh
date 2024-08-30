#!/bin/bash

array=("$@")
for i in "${array[@]}"
do
  image=`docker image ls | grep -w -c $i`;
  echo "Waiting for $i image"

  until [ "$image" -ne "0" ]
  do
    sleep 1;
    printf "*"
    image=`docker image ls | grep -w -c $i`;
  done
done

exit 0;
