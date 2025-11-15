#!/bin/bash

# ============================================
# Script de Instalação - Barbearia AI
# Sistema de recomendação de cortes usando IA
# ============================================

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variáveis
PROJECT_DIR="/opt/barbearia"
REPO_URL="https://github.com/seu-usuario/barbearia.git"  # Ajustar conforme necessário
BACKEND_PORT=5000
FRONTEND_PORT=3000
NGINX_PORT=80
IP_ADDRESS="51.222.31.18"

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERRO]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
    error "Por favor, execute como root (sudo ./install.sh)"
fi

log "============================================"
log "Iniciando instalação do Barbearia AI"
log "============================================"

# ============================================
# 1. Atualizar Ubuntu
# ============================================
log "Atualizando sistema Ubuntu..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y
apt-get install -y curl wget git build-essential

# ============================================
# 2. Instalar Node.js (versão LTS)
# ============================================
log "Instalando Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    log "Node.js $(node --version) instalado"
else
    log "Node.js já está instalado: $(node --version)"
fi

# ============================================
# 3. Instalar PM2 globalmente
# ============================================
log "Instalando PM2..."
npm install -g pm2

# ============================================
# 4. Instalar MongoDB
# ============================================
log "Instalando MongoDB..."
if ! command -v mongod &> /dev/null; then
    wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    apt-get update -y
    apt-get install -y mongodb-org
    systemctl enable mongod
    systemctl start mongod
    log "MongoDB instalado e iniciado"
else
    log "MongoDB já está instalado"
    systemctl start mongod || true
fi

# ============================================
# 5. Instalar Nginx
# ============================================
log "Instalando Nginx..."
apt-get install -y nginx

# Parar processos que possam estar usando as portas
log "Liberando portas..."
pkill -f "node.*server.js" || true
pkill -f "pm2" || true
systemctl stop nginx || true

# Matar processos nas portas se necessário
lsof -ti:${BACKEND_PORT} | xargs kill -9 || true
lsof -ti:${FRONTEND_PORT} | xargs kill -9 || true
lsof -ti:${NGINX_PORT} | xargs kill -9 || true

# ============================================
# 6. Criar diretório do projeto
# ============================================
log "Criando diretório do projeto..."
mkdir -p ${PROJECT_DIR}
cd ${PROJECT_DIR}

# Se o diretório já tiver conteúdo, fazer backup
if [ "$(ls -A ${PROJECT_DIR})" ]; then
    warning "Diretório já existe, fazendo backup..."
    mv ${PROJECT_DIR} ${PROJECT_DIR}.backup.$(date +%Y%m%d_%H%M%S)
    mkdir -p ${PROJECT_DIR}
    cd ${PROJECT_DIR}
fi

# ============================================
# 7. Copiar arquivos do projeto
# ============================================
log "Copiando arquivos do projeto..."
# Assumindo que o script está sendo executado do diretório do projeto
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

if [ -d "${PROJECT_ROOT}/backend" ] && [ -d "${PROJECT_ROOT}/frontend" ]; then
    cp -r ${PROJECT_ROOT}/* ${PROJECT_DIR}/
    log "Arquivos copiados com sucesso"
else
    error "Estrutura do projeto não encontrada. Certifique-se de que backend/ e frontend/ existem."
fi

# ============================================
# 8. Instalar dependências
# ============================================
log "Instalando dependências do backend..."
cd ${PROJECT_DIR}/backend
npm install --production

log "Instalando dependências do frontend..."
cd ${PROJECT_DIR}/frontend
npm install

# ============================================
# 9. Configurar variáveis de ambiente
# ============================================
log "Configurando variáveis de ambiente..."
if [ ! -f ${PROJECT_DIR}/backend/.env ]; then
    cat > ${PROJECT_DIR}/backend/.env << EOF
# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# MongoDB
MONGODB_URI=mongodb://localhost:27017/barbearia

# Server
PORT=${BACKEND_PORT}
NODE_ENV=production

# Frontend
VITE_API_URL=http://${IP_ADDRESS}:${BACKEND_PORT}
EOF
    warning "Arquivo .env criado. POR FAVOR, configure OPENAI_API_KEY antes de usar!"
else
    log "Arquivo .env já existe"
fi

# Criar diretório de uploads
mkdir -p ${PROJECT_DIR}/backend/uploads
chmod 755 ${PROJECT_DIR}/backend/uploads

# ============================================
# 10. Build do frontend
# ============================================
log "Fazendo build do frontend..."
cd ${PROJECT_DIR}/frontend
npm run build

# ============================================
# 11. Configurar Nginx
# ============================================
log "Configurando Nginx..."
cat > /etc/nginx/sites-available/barbearia << EOF
server {
    listen ${NGINX_PORT};
    server_name ${IP_ADDRESS};

    # Frontend
    location / {
        root ${PROJECT_DIR}/frontend/dist;
        try_files \$uri \$uri/ /index.html;
        index index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:${BACKEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        client_max_body_size 10M;
    }

    # Uploads
    location /uploads {
        alias ${PROJECT_DIR}/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Habilitar site
ln -sf /etc/nginx/sites-available/barbearia /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração do Nginx
nginx -t || error "Erro na configuração do Nginx"

# ============================================
# 12. Iniciar serviços
# ============================================
log "Iniciando serviços..."

# Iniciar backend com PM2
cd ${PROJECT_DIR}/backend
pm2 delete barbearia-backend || true
pm2 start server.js --name barbearia-backend
pm2 save
pm2 startup systemd -u root --hp /root || true

# Iniciar Nginx
systemctl enable nginx
systemctl restart nginx

# ============================================
# 13. Configurar firewall (se necessário)
# ============================================
log "Configurando firewall..."
if command -v ufw &> /dev/null; then
    ufw allow ${NGINX_PORT}/tcp
    ufw allow ${BACKEND_PORT}/tcp || true
    ufw --force enable || true
fi

# ============================================
# 14. Verificar status
# ============================================
log "Verificando status dos serviços..."

sleep 3

# Verificar MongoDB
if systemctl is-active --quiet mongod; then
    log "✓ MongoDB está rodando"
else
    warning "MongoDB não está rodando"
fi

# Verificar PM2
if pm2 list | grep -q "barbearia-backend.*online"; then
    log "✓ Backend está rodando"
else
    error "Backend não está rodando. Verifique os logs: pm2 logs barbearia-backend"
fi

# Verificar Nginx
if systemctl is-active --quiet nginx; then
    log "✓ Nginx está rodando"
else
    error "Nginx não está rodando. Verifique: systemctl status nginx"
fi

# ============================================
# Finalização
# ============================================
log "============================================"
log "Instalação concluída com sucesso!"
log "============================================"
log ""
log "Acesse o sistema em:"
log "  http://${IP_ADDRESS}"
log ""
log "Comandos úteis:"
log "  - Ver logs do backend: pm2 logs barbearia-backend"
log "  - Reiniciar backend: pm2 restart barbearia-backend"
log "  - Status do backend: pm2 status"
log "  - Status do Nginx: systemctl status nginx"
log "  - Reiniciar Nginx: systemctl restart nginx"
log ""
warning "IMPORTANTE: Configure OPENAI_API_KEY em ${PROJECT_DIR}/backend/.env"
warning "Depois, reinicie o backend: pm2 restart barbearia-backend"
log ""

