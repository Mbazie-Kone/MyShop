FROM mcr.microsoft.com/mssql/server:2022-latest

USER root

# Install sqlcmd
RUN apt-get update && \
    apt-get install -y curl unzip gnupg && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
	ACCEPT_EULA=Y apt-get install -y mssql-tools unixodbc-dev && \
	echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc && \
	apt-get clean

COPY ./initdb /initdb
WORKDIR /initdb

ENTRYPOINT ["/initdb/entrypoint.sh"]
