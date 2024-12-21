#!/bin/bash
set -e

MYSQL_HOST=db
MYSQL_PORT=3306
MYSQL_USER=appuser
MYSQL_PASSWORD=apppassword
TIMEOUT=180  # Tiempo máximo para esperar

echo "Waiting for MySQL to be ready..."
SECONDS=0
until echo "SELECT 1" | mysql --protocol=TCP -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" &>/dev/null; do
  if [ $SECONDS -ge $TIMEOUT ]; then
    echo "Timeout reached while waiting for MySQL. Exiting."
    exit 1
  fi
  echo "MySQL is not ready yet. Retrying..."
  sleep 2
done

echo "MySQL is ready. Applying migrations..."

# Verifica la presencia de dotnet-ef
if ! command -v dotnet-ef &>/dev/null; then
  echo "dotnet-ef is not installed. Installing now..."
  dotnet tool install --global dotnet-ef --version 8.0.11
  export PATH="$PATH:/root/.dotnet/tools"
fi

# Verifica el contenido del directorio
echo "Checking files in /"
ls -la /src/src

# Ejecuta las migraciones
dotnet ef database update --project /src/src/Infrastructure/CleanStore.Infrastructure.csproj --startup-project /src/src/Presentation/CleanStore.Presentation.csproj

echo "Starting the application..."
exec "$@"
