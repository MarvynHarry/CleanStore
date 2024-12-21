
# CleanStore

CleanStore es una plataforma de comercio electrónico moderna construida con un enfoque de arquitectura limpia utilizando .NET 8 para el backend y Next.js para el frontend. Este proyecto incluye una API robusta, un frontend responsivo y un conjunto de pruebas unitarias para garantizar la calidad.

## Características

- Backend con .NET 8
- Frontend con Next.js
- Arquitectura limpia con separación de responsabilidades
- Pruebas unitarias para la funcionalidad del backend
- Configuración con Docker para un despliegue sencillo

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes componentes en tu máquina local:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)

## Instrucciones de Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/MarvynHarry/CleanStore.git
cd CleanStore
```

### 2. Construir y Ejecutar el Proyecto con Docker

#### Usando Docker Compose

El proyecto incluye un archivo `docker-compose.yml` para simplificar el proceso de configuración. Sigue estos pasos:

1. Navega al directorio raíz del proyecto.

2. Ejecuta el siguiente comando para construir y arrancar los contenedores:

   ```bash
   docker-compose up --build
   ```

3. Accede a la aplicación:
   - API del backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

### 3. Detener y Eliminar los Contenedores

Para detener los contenedores en ejecución y eliminarlos:

```bash
docker-compose down
```

## Estructura del Proyecto

```
CleanStore/
├── backend/
│   ├── src/
│   │   ├── Application/
│   │   ├── Domain/
│   │   ├── Infrastructure/
│   │   ├── Presentation/
│   │   └── Tests/
├── frontend/
│   └── (aplicación Next.js)
├── docker-compose.yml
└── README.md
```

## Ejecutar Pruebas

Para ejecutar las pruebas unitarias del backend:

1. Navega al directorio `backend/src`:
   ```bash
   cd backend/src
   ```

2. Ejecuta las pruebas:
   ```bash
   dotnet test
   ```

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
