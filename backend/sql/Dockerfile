# Use an official PostgreSQL image as the base image
FROM postgres:latest

# Environment variables for PostgreSQL
ENV POSTGRES_DB=postgres
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Copy the SQL script to the /docker-entrypoint-initdb.d/ directory
COPY sql-init.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432

# Modify the PostgreSQL configuration to enable authentication
# RUN echo "host all all 0.0.0.0/0 md5" >> /var/lib/postgresql/data/pg_hba.conf
# RUN echo "local all all trust" >> /var/lib/postgresql/data/pg_hba.conf

# Optionally, you can specify a custom entrypoint script if needed
# ENTRYPOINT ["/custom-entrypoint.sh"]

