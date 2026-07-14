FROM postgres:14

RUN apt-get update || (cat /var/log/apt/term.log && exit 1)
RUN apt-get -y install postgresql-14-cron && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN echo "shared_preload_libraries='pg_cron'" >> /usr/share/postgresql/postgresql.conf.sample && \
    echo "cron.database_name='bichard'" >> /usr/share/postgresql/postgresql.conf.sample

# fixes missing locale issue
# initdb: error: invalid locale settings; check LANG and LC_* environment variables
RUN localedef -i en_US -f UTF-8 en_US.UTF-8

WORKDIR /

COPY docker /docker-entrypoint-initdb.d

RUN chmod -R 755 /docker-entrypoint-initdb.d

USER postgres
