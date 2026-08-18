# Clases_Automatica

Repositorio con el ecosistema de software multimateria para la Universidad del Cauca (2026).

## Estructura del Proyecto

- **`Backend/`**: Servidor API REST desarrollado en **NestJS** y **PostgreSQL** para autenticación JWT, gestión de banco de preguntas, semanas y evaluaciones.
- **`Frontend/`**: Aplicación Web para administración y docentes desarrollada en **React (Vite)**, **Zustand** y **SASS/Tailwind**.
- **`Movil/`**: Aplicación móvil para estudiantes desarrollada en **Expo / React Native**.
- **`deploy.sh`**: Script de despliegue automatizado en bash para compilar, migrar la base de datos y desplegar el servicio en servidor de producción.

## Despliegue Rápido

Para desplegar el Backend, Frontend y sincronizar la base de datos PostgreSQL en el servidor remoto:

```bash
./deploy.sh --all
```
