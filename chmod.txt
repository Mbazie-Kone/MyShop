If you're starting the application for the first time, run these two commands (only once) in the root of the project using Git Bash, before executing the command 'docker-compose up --build -d'.

dos2unix ./initdb/entrypoint.sh
chmod +x ./initdb/entrypoint.sh