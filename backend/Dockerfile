# Imagen base para el entorno final
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

# Imagen para construir el proyecto
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar solución y proyectos
COPY CleanStore.sln . 
COPY src/ src/

# Restaurar dependencias
RUN dotnet restore "src/Presentation/CleanStore.Presentation.csproj"

# Compilar y publicar el proyecto
RUN dotnet build "src/Presentation/CleanStore.Presentation.csproj" -c Release -o /app/build
RUN dotnet publish "src/Presentation/CleanStore.Presentation.csproj" -c Release -o /app/publish

# Etapa final
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS final
WORKDIR /app

# Copiar la publicación y el código fuente
COPY --from=build /app/publish .
COPY --from=build /src /src

# Instalar herramientas y cliente MySQL
RUN apt-get update && apt-get install -y default-mysql-client
RUN dotnet tool install --global dotnet-ef --version 8.0.11
ENV PATH="$PATH:/root/.dotnet/tools"

# Copiar el script de espera
COPY wait-for-mysql.sh /app/wait-for-mysql.sh
RUN chmod +x /app/wait-for-mysql.sh

# Ejecutar migraciones y luego iniciar la aplicación
ENTRYPOINT ["/bin/bash", "-c", "/app/wait-for-mysql.sh && dotnet CleanStore.Presentation.dll"]
