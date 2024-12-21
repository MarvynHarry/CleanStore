# Usa una imagen base con Node.js 18 o superior
FROM node:18 AS base

# Define el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios
COPY package.json package-lock.json* ./ 

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos al contenedor
COPY . .

# Establece las variables de entorno necesarias
ENV NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Construye la aplicación para producción
RUN npm run build

# Exponer el puerto 3000 para Next.js
EXPOSE 3000

# Comando por defecto para iniciar el servidor de Next.js
CMD ["npm", "start"]
