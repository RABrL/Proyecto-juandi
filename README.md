# Proyecto para ingeniera de software

Esta es una aplicación web para la gestión de una billetera virtual, en la cual se pueden realizar las siguientes operaciones:

- Crear una cuenta
- Iniciar sesión
- Recargar saldo
- Transferir saldo
- Consultar saldo
- Consultar movimientos

## Tecnologías usadas

- Express.js
- React.js
- MYSQL
- Docker
- Docker-compose
- Sequelize
- Astro

## Como iniciar

Para correr este proyecto localmente, necesitas tener instalado docker y docker-compose. también necesitas crear un archivo .env con tus variables para ver que variables ver el archivo *.env.example*

Para clonar el repositorio, ejecuta el siguiente comando en tu terminal

    git clone https://github.com/RABrL/Proyecto-juandi.git

Luego, ejecuta los siguientes comandos para iniciar el proyecto

- Entra a la carpeta del proyecto

      cd Proyecto-juandi

- Inicia el contenedor de docker

      docker-compose up -d

- Entra a la carpeta del backend

      cd backend

- Instala las dependencias
  
      npm install

- Inicializa la base de datos
  
      npm run migrate

- Inicia el servidor
  
      npm run dev

- Entra a la carpeta del frontend

      cd ../frontend

- Instala las dependencias
    
      npm install

- Inicia el servidor
    
      npm run start



Y con eso ya tienes el proyecto corriendo localmente en el puerto :4321

