#!/usr/bin/env bash

# ==============================================================================
# Script de Despliegue Automatizado y Seguro - Unicauca 2026
# Servidor de Destino: 176.57.150.155
# ==============================================================================
# Uso:
#   ./deploy.sh                  -> Despliega el Backend NestJS al servidor 176.57.150.155
#   ./deploy.sh --db             -> Despliega el Backend + Copia e importa la BD de desarrollo
#   ./deploy.sh --frontend       -> Despliega Backend + Frontend React (dist)
#   ./deploy.sh --all            -> Despliega Backend, Frontend y Copia la BD de desarrollo
#   ./deploy.sh --db-only        -> Copia e importa únicamente la BD de desarrollo a 176.57.150.155
# ==============================================================================

set -e # Detener en caso de error

# --- Colores de Salida ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # Sin color

# --- Configuración del Servidor Remoto ---
SERVER_IP="${SERVER_IP:-176.57.150.155}"
SERVER_USER="${SERVER_USER:-root}"
SSH_PASSWORD="${SSH_PASSWORD:-proyectoacb2026}"
REMOTE_BACKEND_DIR="${REMOTE_BACKEND_DIR:-/var/www/algebra-backend}"
REMOTE_FRONTEND_DIR="${REMOTE_FRONTEND_DIR:-/var/www/algebra-frontend}"
DB_NAME="${DB_NAME:-algebra_lineal_db}"
DB_USER="${DB_USER:-postgres}"

# --- Helper de Comando SSH / SCP con sshpass si está disponible ---
run_ssh() {
  if command -v sshpass &> /dev/null && [ -n "$SSH_PASSWORD" ]; then
    sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "${SERVER_USER}@${SERVER_IP}" "$@"
  else
    ssh -o StrictHostKeyChecking=no "${SERVER_USER}@${SERVER_IP}" "$@"
  fi
}

run_scp() {
  if command -v sshpass &> /dev/null && [ -n "$SSH_PASSWORD" ]; then
    sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$@"
  else
    scp -o StrictHostKeyChecking=no "$@"
  fi
}

# --- Manejo de Argumentos ---
DEPLOY_DB=false
DEPLOY_FRONTEND=false
DEPLOY_BACKEND=true

for arg in "$@"; do
  case $arg in
    --db)
      DEPLOY_DB=true
      shift
      ;;
    --frontend)
      DEPLOY_FRONTEND=true
      shift
      ;;
    --all)
      DEPLOY_DB=true
      DEPLOY_FRONTEND=true
      shift
      ;;
    --db-only)
      DEPLOY_BACKEND=false
      DEPLOY_DB=true
      shift
      ;;
    --help|-h)
      echo -e "${BLUE}Modo de uso:${NC} ./deploy.sh [opciones]"
      echo "Opciones disponibles:"
      echo "  --db         Envía la copia de la base de datos de desarrollo al servidor."
      echo "  --frontend   Compila y despliega también el Frontend React."
      echo "  --all        Despliega Backend, Frontend y Base de Datos."
      echo "  --db-only    Envía e importa únicamente la Base de Datos sin re-desplegar código."
      exit 0
      ;;
  esac
done

echo -e "${BLUE}======================================================================${NC}"
echo -e "${BLUE}🚀 INICIANDO DESPLIEGUE A SERVIDOR: http://${SERVER_IP}${NC}"
echo -e "${BLUE}======================================================================${NC}"

# ------------------------------------------------------------------------------
# 1. Comprobación de Conectividad SSH
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[1/5] Verificando conexión SSH a ${SERVER_USER}@${SERVER_IP}...${NC}"
if run_ssh "exit"; then
  echo -e "${GREEN}✔ Conexión SSH establecida correctamente con ${SERVER_IP}.${NC}"
else
  echo -e "${RED}✖ Error: No se puede conectar a ${SERVER_USER}@${SERVER_IP} vía SSH.${NC}"
  echo -e "${YELLOW}Asegúrate de tener configurada tu clave SSH o contraseña correcta.${NC}"
  exit 1
fi

# ------------------------------------------------------------------------------
# 2. Compilación del Backend NestJS
# ------------------------------------------------------------------------------
if [ "$DEPLOY_BACKEND" = true ]; then
  echo -e "\n${YELLOW}[2/5] Compilando Backend NestJS (TypeScript -> dist)...${NC}"
  cd Backend
  npm run build
  cd ..
  echo -e "${GREEN}✔ Build de Backend generado exitosamente en Backend/dist.${NC}"
fi

# ------------------------------------------------------------------------------
# 3. Compilación del Frontend (Opcional si se solicita --frontend o --all)
# ------------------------------------------------------------------------------
if [ "$DEPLOY_FRONTEND" = true ]; then
  echo -e "\n${YELLOW}[3/5] Compilando Frontend React (Vite -> dist)...${NC}"
  cd Frontend
  npm run build
  cd ..
  echo -e "${GREEN}✔ Build de Frontend generado exitosamente en Frontend/dist.${NC}"
fi

# ------------------------------------------------------------------------------
# 4. Transferencia de Código y Despliegue de Servicios
# ------------------------------------------------------------------------------
if [ "$DEPLOY_BACKEND" = true ]; then
  echo -e "\n${YELLOW}[4/5] Transfiriendo archivos del Backend a ${SERVER_IP}:${REMOTE_BACKEND_DIR}...${NC}"
  
  run_ssh "mkdir -p ${REMOTE_BACKEND_DIR} ${REMOTE_BACKEND_DIR}/uploads"

  if command -v rsync &> /dev/null && command -v sshpass &> /dev/null && [ -n "$SSH_PASSWORD" ]; then
    RSYNC_RSH="sshpass -p '$SSH_PASSWORD' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" \
    rsync -avz --delete \
      Backend/dist \
      Backend/package.json \
      Backend/package-lock.json \
      Backend/src/database/schema.sql \
      "${SERVER_USER}@${SERVER_IP}:${REMOTE_BACKEND_DIR}/"
    
    if [ -d "Backend/uploads" ]; then
      RSYNC_RSH="sshpass -p '$SSH_PASSWORD' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" \
      rsync -avz Backend/uploads/ "${SERVER_USER}@${SERVER_IP}:${REMOTE_BACKEND_DIR}/uploads/"
    fi
  else
    run_scp -r Backend/dist Backend/package.json Backend/package-lock.json Backend/src/database/schema.sql "${SERVER_USER}@${SERVER_IP}:${REMOTE_BACKEND_DIR}/"
  fi

  if [ -f "Backend/.env" ]; then
    echo -e "${BLUE}-> Copiando archivo .env al servidor...${NC}"
    run_scp Backend/.env "${SERVER_USER}@${SERVER_IP}:${REMOTE_BACKEND_DIR}/.env"
  fi

  echo -e "${GREEN}✔ Archivos del Backend transferidos exitosamente.${NC}"

  # Instalar dependencias de producción y reiniciar servicio en el servidor
  echo -e "${YELLOW}-> Instalando dependencias y gestionando servicio PM2...${NC}"
  run_ssh "bash -s" << EOF
    export PATH=/usr/bin:/usr/local/bin:\$PATH
    cd ${REMOTE_BACKEND_DIR}
    npm install --legacy-peer-deps --production

    if command -v pm2 &> /dev/null; then
      echo "Reiniciando/Iniciando backend NestJS con PM2..."
      pm2 restart algebra-backend 2>/dev/null || pm2 start dist/main.js --name algebra-backend
      pm2 save
    elif systemctl is-active --quiet algebra-backend; then
      echo "Reiniciando servicio systemd algebra-backend..."
      systemctl restart algebra-backend
    else
      echo "Iniciando proceso node en segundo plano..."
      nohup node dist/main.js > app.log 2>&1 &
    fi
EOF
  echo -e "${GREEN}✔ Servicio Backend ejecutándose correctamente en ${SERVER_IP}.${NC}"
fi

# Transferencia del Frontend si aplica
if [ "$DEPLOY_FRONTEND" = true ]; then
  echo -e "\n${YELLOW}-> Transfiriendo Frontend React a ${SERVER_IP}:${REMOTE_FRONTEND_DIR}...${NC}"
  run_ssh "mkdir -p ${REMOTE_FRONTEND_DIR}"
  if command -v sshpass &> /dev/null && [ -n "$SSH_PASSWORD" ]; then
    RSYNC_RSH="sshpass -p '$SSH_PASSWORD' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" \
    rsync -avz --delete Frontend/dist/ "${SERVER_USER}@${SERVER_IP}:${REMOTE_FRONTEND_DIR}/"
  else
    run_scp -r Frontend/dist/* "${SERVER_USER}@${SERVER_IP}:${REMOTE_FRONTEND_DIR}/"
  fi
  echo -e "${GREEN}✔ Frontend React desplegado exitosamente en ${REMOTE_FRONTEND_DIR}.${NC}"
fi

# ------------------------------------------------------------------------------
# Configuración de Nginx Reverse Proxy (Soporte HTTP 80 y HTTPS 443 sin bloqueo)
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}-> Verificando y aplicando configuración Nginx Reverse Proxy...${NC}"
run_ssh "bash -s" << EOF
  mkdir -p /etc/ssl/certs /etc/ssl/private

  if [ ! -f /etc/ssl/certs/nginx-selfsigned.crt ]; then
    echo "Generando certificado SSL/TLS para ${SERVER_IP}..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout /etc/ssl/private/nginx-selfsigned.key \
      -out /etc/ssl/certs/nginx-selfsigned.crt \
      -subj "/C=CO/ST=Cauca/L=Popayan/O=Unicauca/OU=Automation/CN=${SERVER_IP}" \
      -addext "subjectAltName=IP:${SERVER_IP}" 2>/dev/null || true
  fi

  if command -v nginx &> /dev/null; then
    cat << 'NGINX_CONF' > /etc/nginx/sites-available/default
limit_req_zone \$binary_remote_addr zone=api_limit:10m rate=20r/s;
limit_req_zone \$binary_remote_addr zone=login_limit:10m rate=10r/m;

# 1. Servidor HTTP (Puerto 80)
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    root ${REMOTE_FRONTEND_DIR};
    index index.html;

    server_tokens off;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    client_max_body_size 25M;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/auth/login {
        limit_req zone=login_limit burst=5 nodelay;
        proxy_pass http://127.0.0.1:3000/auth/login;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api/ {
        limit_req zone=api_limit burst=30 nodelay;
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:3000/uploads/;
        add_header X-Content-Type-Options "nosniff" always;
    }

    location /notas/ {
        alias ${REMOTE_FRONTEND_DIR}/notas/;
        add_header X-Content-Type-Options "nosniff" always;
    }

    location /api/notas/ {
        alias ${REMOTE_FRONTEND_DIR}/notas/;
        add_header X-Content-Type-Options "nosniff" always;
    }

    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}

# 2. Servidor HTTPS (Puerto 443) opcional
server {
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name _;

    root ${REMOTE_FRONTEND_DIR};
    index index.html;

    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    server_tokens off;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    client_max_body_size 25M;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/auth/login {
        limit_req zone=login_limit burst=5 nodelay;
        proxy_pass http://127.0.0.1:3000/auth/login;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    location /api/ {
        limit_req zone=api_limit burst=30 nodelay;
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_cache_bypass \$http_upgrade;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:3000/uploads/;
        add_header X-Content-Type-Options "nosniff" always;
    }

    location /notas/ {
        alias ${REMOTE_FRONTEND_DIR}/notas/;
        add_header X-Content-Type-Options "nosniff" always;
    }

    location /api/notas/ {
        alias ${REMOTE_FRONTEND_DIR}/notas/;
        add_header X-Content-Type-Options "nosniff" always;
    }

    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
NGINX_CONF
    ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
    nginx -t && systemctl reload nginx
    echo "✔ Nginx Reverse Proxy configurado correctamente para HTTP y HTTPS."
  fi
EOF

# ------------------------------------------------------------------------------
# 5. Envío y Migración de la Copia de la Base de Datos de Desarrollo
# ------------------------------------------------------------------------------
if [ "$DEPLOY_DB" = true ]; then
  echo -e "\n${YELLOW}[5/5] Preparando y enviando copia de la Base de Datos de Desarrollo...${NC}"
  
  TEMP_DUMP="algebra_lineal_dev_dump.sql"

  if pg_dump -U "${DB_USER}" -d "${DB_NAME}" > "${TEMP_DUMP}" 2>/dev/null; then
    echo -e "${GREEN}✔ Volcado en vivo generado desde la BD local '${DB_NAME}'.${NC}"
    DB_FILE_TO_SEND="${TEMP_DUMP}"
  else
    echo -e "${YELLOW}ℹ Usando 'Backend/src/database/schema.sql' con 104+ preguntas y esquema completo...${NC}"
    DB_FILE_TO_SEND="Backend/src/database/schema.sql"
  fi

  echo -e "${BLUE}-> Enviando copia de BD '${DB_FILE_TO_SEND}' al servidor ${SERVER_IP}...${NC}"
  run_scp "${DB_FILE_TO_SEND}" "${SERVER_USER}@${SERVER_IP}:${REMOTE_BACKEND_DIR}/database_dump.sql"

  echo -e "${YELLOW}-> Importando datos en PostgreSQL en el servidor remoto...${NC}"
  run_ssh "bash -s" << EOF
    sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';" 2>/dev/null || true
    sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME};" 2>/dev/null || true
    sudo -u postgres psql -d ${DB_NAME} -f ${REMOTE_BACKEND_DIR}/database_dump.sql
EOF

  if [ -f "${TEMP_DUMP}" ]; then
    rm -f "${TEMP_DUMP}"
  fi

  echo -e "${GREEN}✔ Copia de la base de datos de desarrollo cargada e importada en ${SERVER_IP}.${NC}"
fi

echo -e "\n${GREEN}======================================================================${NC}"
echo -e "${GREEN}🎉 DESPLIEGUE FINALIZADO EXITOSAMENTE EN: http://${SERVER_IP}${NC}"
echo -e "${GREEN}======================================================================${NC}"
