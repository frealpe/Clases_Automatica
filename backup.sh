#!/usr/bin/env bash

# ==============================================================================
# Script de Respaldo de Base de Datos - Unicauca 2026
# Conecta por SSH a 176.57.150.155 y descarga un dump completo de PostgreSQL
# ==============================================================================

set -e # Detener en caso de error

# --- Colores de Salida ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # Sin color

# --- Configuración del Servidor Remoto y BD ---
SERVER_IP="${SERVER_IP:-176.57.150.155}"
SERVER_USER="${SERVER_USER:-root}"
SSH_PASSWORD="${SSH_PASSWORD:-proyectoacb2026}"
DB_NAME="${DB_NAME:-algebra_lineal_db}"

# --- Directorio Local de Backup ---
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
BACKUP_DIR="${SCRIPT_DIR}/backup"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="${BACKUP_DIR}/algebra_lineal_db_${TIMESTAMP}.sql"
LATEST_LINK="${BACKUP_DIR}/backup_latest.sql"

mkdir -p "${BACKUP_DIR}"

echo -e "${BLUE}======================================================================${NC}"
echo -e "${BLUE}📦 INICIANDO RESPALDO DE BASE DE DATOS '${DB_NAME}'${NC}"
echo -e "${BLUE}Servidor: ${SERVER_USER}@${SERVER_IP}${NC}"
echo -e "${BLUE}======================================================================${NC}"

# --- Helper SSH ---
run_ssh_dump() {
  if command -v sshpass &> /dev/null && [ -n "$SSH_PASSWORD" ]; then
    sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "${SERVER_USER}@${SERVER_IP}" "sudo -u postgres pg_dump ${DB_NAME}"
  else
    ssh -o StrictHostKeyChecking=no "${SERVER_USER}@${SERVER_IP}" "sudo -u postgres pg_dump ${DB_NAME}"
  fi
}

echo -e "\n${YELLOW}[1/3] Conectando a ${SERVER_IP} y generando dump de PostgreSQL...${NC}"

if run_ssh_dump > "${BACKUP_FILE}"; then
  if [ -s "${BACKUP_FILE}" ]; then
    FILE_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    echo -e "${GREEN}✔ Respaldo completado exitosamente.${NC}"
    echo -e "${GREEN}  Archivo generado: ${BACKUP_FILE} (${FILE_SIZE})${NC}"
    
    # Copia de acceso rápido del respaldo más reciente
    cp "${BACKUP_FILE}" "${LATEST_LINK}"
    echo -e "${GREEN}  Copia de acceso rápido actualizada: ${LATEST_LINK}${NC}"
  else
    echo -e "${RED}✖ Error: El archivo de respaldo generado está vacío.${NC}"
    rm -f "${BACKUP_FILE}"
    exit 1
  fi
else
  echo -e "${RED}✖ Error al conectar por SSH o extraer el respaldo de la base de datos.${NC}"
  rm -f "${BACKUP_FILE}"
  exit 1
fi

echo -e "\n${GREEN}======================================================================${NC}"
echo -e "${GREEN}🎉 BACKUP DE SEGURIDAD FINALIZADO CON ÉXITO${NC}"
echo -e "${GREEN}======================================================================${NC}"
