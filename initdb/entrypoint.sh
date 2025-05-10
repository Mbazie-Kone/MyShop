#!/bin/bash
/opt/mssql/bin/sqlservr &

set +H

echo "Waiting for SQL Server to start..."
sleep 20

db_exists() {
	/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "$SA_PASSWORD" -Q "IF DB_ID('$1') IS NOT NULL PRINT 'YES'" -h -1
}

echo "Executing init scripts..."

# Run init.sql of admin-service only if the admindb database does not exist.
if [ "$(db_exists admindb)" != "YES" ]; then
    echo "Database admindb not found, creating it..."
	for script in /initdb/admin-service/*.sql; do
	    echo "Running $script"
	    /opt/mssql-tools/bin/sqlcmd -S sqlserver -U SA -P "$SA_PASSWORD" -d master -i "$script"
	done
else
    echo "Database admindb already exists, skipping initialization."
fi

# Run init.sql of catalog-service only if the catalogdb database does not exist.
if [ "$(db_exists catalogdb)" != "YES" ]; then
    echo "Database catalogdb not found, creating it..."
	for script in /initdb/catalog-service/*.sql; do
	    echo "Running $script"
	    /opt/mssql-tools/bin/sqlcmd -S sqlserver -U SA -P "$SA_PASSWORD" -d master -i "$script"
	done
else
    echo "Database catalogdb already exists, skipping initialization."
fi

tail -f /dev/null