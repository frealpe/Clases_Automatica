# Clases_Automatica

Repositorio con el ecosistema de software multimateria para la Universidad del Cauca (2026).

## Estructura del Proyecto

- **`Backend/`**: Servidor API REST desarrollado en **NestJS** y **PostgreSQL** para autenticación JWT, gestión de banco de preguntas, semanas y evaluaciones.
- **`Frontend/`**: Aplicación Web para administración y docentes desarrollada en **React (Vite)**, **Zustand** y **SASS/Tailwind**.
- **`Movil/`**: Aplicación móvil para estudiantes desarrollada en **Expo / React Native**.
- **`deploy.sh`**: Script de despliegue automatizado en bash para compilar, migrar la base de datos y desplegar el servicio en servidor de producción.
- **`backup.sh`**: Script para extraer un respaldo en vivo de PostgreSQL desde el servidor de producción.
- **`restore.sh`**: Script para restaurar un respaldo SQL en la base de datos PostgreSQL local (`algebra_lineal_db`).

## Comandos Rápido

- **Despliegue a producción**: `./deploy.sh --all`
- **Descargar backup desde producción**: `./backup.sh`
- **Restaurar backup en BD local**: `./restore.sh`

