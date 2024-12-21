#!/bin/bash
set -e

echo "Applying database migrations..."
dotnet ef database update --project src/Infrastructure/CleanStore.Infrastructure.csproj --startup-project src/Presentation/CleanStore.Presentation.csproj

echo "Starting the API..."
exec dotnet CleanStore.Presentation.dll
