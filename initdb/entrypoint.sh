#!/bin/bash
/opt/mssql/bin/sqlservr &

echo "Waiting for SQL Server to start..."
sleep 20

echo "Executing init scripts..."

for script in /initdb/admin-service/*.sql; do
	echo "Running $script"
	/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -p $SA_PASSWORD -i $script
done

for script in /initdb/catalog-service/*.sql; do
	echo "Running $script"
	/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -p $SA_PASSWORD -i $script
done

wait