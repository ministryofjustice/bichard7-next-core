FROM postgres:14

RUN apt-get update && apt-get -y install git build-essential postgresql-server-dev-14 && \
    git clone https://github.com/citusdata/pg_cron.git

WORKDIR /pg_cron

RUN make && make install && \
    rm -rf /pg_cron && \
    apt-get remove -y git build-essential postgresql-server-dev-14 && \
    apt-get autoremove --purge -y && \
    apt-get clean && \
    apt-get purge

# fixes missing locale issue
# initdb: error: invalid locale settings; check LANG and LC_* environment variables
RUN localedef -i en_US -f UTF-8 en_US.UTF-8

WORKDIR /

COPY docker /docker-entrypoint-initdb.d