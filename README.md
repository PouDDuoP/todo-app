# 🚀 Todo App

-----

## 📝 Descripción General

**Todo App** es una aplicación web simple y eficiente diseñada para gestionar tus tareas diarias. Permite a los usuarios añadir, visualizar, actualizar y eliminar tareas fácilmente. Este proyecto es ideal para entender los fundamentos del desarrollo web de principio a fin, abarcando tanto el **backend** (lógica del servidor y base de datos) como el **frontend** (interfaz de usuario).

-----

## ✨ Características Principales

  * **Creación de Tareas:** Añade nuevas tareas a tu lista.
  * **Visualización de Tareas:** Muestra todas las tareas pendientes.
  * **Actualización de Tareas:** Marca tareas como completadas o edita su descripción.
  * **Eliminación de Tareas:** Borra tareas que ya no necesitas.
  * **Persistencia de Datos:** Las tareas se almacenan en una base de datos para que no se pierdan al cerrar la aplicación.
  * **Diseño Responsivo:** La interfaz se adapta bien a diferentes tamaños de pantalla (escritorio y móvil).

-----

## 🛠️ Tecnologías Utilizadas

Este proyecto está construido con un stack de tecnologías robusto y ampliamente utilizado:

  * **Backend:**
      * **Node.js:** Entorno de ejecución de JavaScript en el servidor.
      * **Express.js:** Framework web para Node.js, utilizado para construir la API RESTful.
      * **Sequelize ORM:** Un ORM (Object-Relational Mapper) para Node.js, que facilita la interacción con la base de datos PostgreSQL.
  * **Frontend:**
      * **HTML5, CSS3, JavaScript (Vanilla):** Fundamentos del desarrollo web para la estructura, estilo y lógica del lado del cliente.
      * **Bootstrap:** Framework CSS para un diseño responsivo y estético.
  * **Base de Datos:**
      * **PostgreSQL:** Un potente sistema de gestión de bases de datos relacional, ideal para almacenar las tareas de forma fiable.
  * **Herramientas de Desarrollo y Despliegue:**
      * **Docker & Docker Compose:** Utilizado para contenerizar la aplicación y la base de datos, garantizando un entorno de desarrollo consistente y simplificando el despliegue.

-----

## 🚀 Instalación y Ejecución Local

Sigue estos pasos para poner en marcha la `Todo App` en tu máquina local:

### Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:

  * **Node.js** (versión 14.x o superior recomendada)
  * **npm** (viene con Node.js) o **Yarn**
  * **Docker** y **Docker Compose**

### Pasos

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/PouDDuoP/todo-app.git
    cd todo-app
    ```

2.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto (al mismo nivel que `package.json`). Aquí deberás definir las credenciales y configuraciones para la base de datos.

    ```env
    # Variables de la aplicación
    PORT=3000

    # Variables de la base de datos (PostgreSQL)
    DB_HOST=db
    DB_USER=todorepositorio
    DB_PASSWORD=contrasenia
    DB_NAME=tododb
    DB_PORT=5432
    ```

    **Importante:** Ajusta `DB_USER`, `DB_PASSWORD` y `DB_NAME` a los valores que desees para tu base de datos local.

3.  **Inicia la base de datos con Docker Compose:**

    ```bash
    docker-compose up -d --build
    ```

    Este comando creará y levantará el contenedor de PostgreSQL en segundo plano. Permite unos segundos para que la base de datos se inicialice completamente antes de pasar al siguiente paso.

4.  **Instala las dependencias del proyecto:**

    ```bash
    npm install
    # o si usas Yarn
    yarn install
    ```

5.  **Ejecuta las migraciones de la base de datos:**
    Necesitas aplicar las migraciones de Sequelize para crear las tablas necesarias en tu base de datos `tododb`.

    ```bash
    npx sequelize db:migrate
    ```

6.  **Inicia la aplicación:**

    ```bash
    npm start
    # o para desarrollo con reinicio automático (si tienes nodemon configurado)
    npm run dev
    ```

    La aplicación estará disponible en tu navegador en `http://localhost:3000` (o el puerto que hayas configurado en tu archivo `.env`).

-----

## 📞 Contacto

Si tienes alguna pregunta o sugerencia sobre el proyecto, no dudes en contactarme:

  * **GitHub:** [PouDDuoP](https://www.google.com/search?q=https://github.com/PouDDuoP)
  * **LinkedIn:** [kevin-alvarado-graterol](https://www.linkedin.com/in/kevin-alvarado-graterol/)

-----
