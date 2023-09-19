#!/usr/bin/env bash

# use same db as the one from env
dbname="$POSTGRES_DB"

# create custom config
customconf=/var/lib/postgresql/data/pgdata/pg-cron.conf
echo "" > $customconf
echo "shared_preload_libraries = 'pg_cron'" >> $customconf
echo "cron.database_name = '$dbname'" >> $customconf
chown postgres $customconf
chgrp postgres $customconf

# include custom config from main config
conf=/var/lib/postgresql/data/pgdata/postgresql.conf
echo "include = '$customconf'" >> $conf
