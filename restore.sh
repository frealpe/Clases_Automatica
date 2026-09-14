#!/usr/bin/env bash

# ==============================================================================
# Script de Restauración de Base de Datos Local - Unicauca 2026
# Importa el backup especificado (o backup/backup_latest.sql) a PostgreSQL local
# ==============================================================================

set -e # Detener en caso de error

# --- Colores de Salida ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # Sin color

DB_NAME="${DB_NAME:-algebra_lineal_db}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
BACKUP_FILE="${1:-${SCRIPT_DIR}/backup/backup_latest.sql}"

if [ ! -f "${BACKUP_FILE}" ]; then
  echo -e "${RED}✖ Error: El archivo de respaldo '${BACKUP_FILE}' no existe.${NC}"
  exit 1
fi

echo -e "${BLUE}======================================================================${NC}"
echo -e "${BLUE}🔄 INICIANDO RESTAURACIÓN DE BASE DE DATOS LOCAL '${DB_NAME}'${NC}"
echo -e "${BLUE}Archivo a restaurar: ${BACKUP_FILE}${NC}"
echo -e "${BLUE}======================================================================${NC}"

export PGPASSWORD="${DB_PASSWORD}"

echo -e "\n${YELLOW}[1/2] Limpiando el esquema local 'public' en '${DB_NAME}'...${NC}"
if psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" 2>/dev/null; then
  echo -e "${GREEN}✔ Esquema local limpiado correctamente.${NC}"
elif sudo -u postgres psql -d "${DB_NAME}" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" 2>/dev/null; then
  echo -e "${GREEN}✔ Esquema local limpiado correctamente (vía sudo postgres).${NC}"
else
  echo -e "${YELLOW}ℹ Intentando crear base de datos si no existe...${NC}"
  psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -c "CREATE DATABASE ${DB_NAME};" 2>/dev/null || sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME};" 2>/dev/null || true
fi

echo -e "\n${YELLOW}[2/2] Importando datos desde el respaldo en '${DB_NAME}'...${NC}"
if psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -f "${BACKUP_FILE}" > /dev/null 2>&1; then
  echo -e "${GREEN}✔ Importación completada correctamente.${NC}"
elif sudo -u postgres psql -d "${DB_NAME}" -f "${BACKUP_FILE}" > /dev/null 2>&1; then
  echo -e "${GREEN}✔ Importación completada correctamente (vía sudo postgres).${NC}"
else
  echo -e "${RED}✖ Error al importar el archivo en la base de datos PostgreSQL local.${NC}"
  exit 1
fi

echo -e "\n${GREEN}======================================================================${NC}"
echo -e "${GREEN}🎉 RESTAURACIÓN LOCAL FINALIZADA CON ÉXITO${NC}"
echo -e "${GREEN}======================================================================${NC}"
