#!/usr/bin/env bash

### Customized entrypoint script to allow init_db without start server. It sources the pretty-stable docker-entrypoint.sh script and uses functions defined in that script from the base image.
### - https://github.com/docker-library/postgres/issues/1001
### - https://github.com/docker-library/postgres/pull/496

set -Eeo pipefail

source /usr/local/bin/docker-entrypoint.sh 

docker_setup_env
# setup data directories and permissions (when run as root)
docker_create_db_directories
if [ "$(id -u)" = '0' ]; then
    # then restart script as postgres user
    exec gosu postgres "$BASH_SOURCE" "$@"
fi

# only run initialization on an empty data directory
if [ -z "$DATABASE_ALREADY_EXISTS" ]; then
    docker_verify_minimum_env

    # check dir permissions to reduce likelihood of half-initialized database
    ls /docker-entrypoint-initdb.d/ > /dev/null

    docker_init_database_dir
    pg_setup_hba_conf "$@"

    # PGPASSWORD is required for psql when authentication is required for 'local' connections via pg_hba.conf and is otherwise harmless
    # e.g. when '--auth=md5' or '--auth-local=md5' is used in POSTGRES_INITDB_ARGS
    export PGPASSWORD="${PGPASSWORD:-$POSTGRES_PASSWORD}"
    docker_temp_server_start "$@"

    docker_setup_db
    docker_process_init_files /docker-entrypoint-initdb.d/*

    docker_temp_server_stop
    unset PGPASSWORD

    echo
    echo 'PostgreSQL init process complete; ready for start up.'
    echo
else
    echo
    echo 'PostgreSQL Database directory appears to contain a database; Skipping initialization'
    echo
fi