# ✂️ Barbearia AI - Sistema de Recomendação de Cortes

Sistema completo de recomendação de cortes de cabelo e barba usando Inteligência Artificial. O sistema analisa o formato do rosto do cliente e sugere os 3 melhores estilos personalizados.

## 🎯 Funcionalidades

- ✅ Upload de foto do rosto (JPG, JPEG, PNG)
- ✅ Detecção automática do formato do rosto usando OpenAI Vision API
- ✅ Recomendação de 3 melhores estilos baseados no formato facial
- ✅ Opções: Apenas Cabelo, Apenas Barba, ou Cabelo + Barba
- ✅ Sistema de salvamento de estilos favoritos
- ✅ Interface premium com design moderno (preto/dourado/branco)
- ✅ Totalmente responsivo (mobile-first)

## 🛠️ Tecnologias

### Frontend
- **React** 18.2.0
- **Vite** 5.0.8
- **TailwindCSS** 3.3.6
- **Axios** para requisições HTTP

### Backend
- **Node.js** 20.x
- **Express** 4.18.2
- **MongoDB** 7.0
- **OpenAI Vision API** (GPT-4o)
- **Multer** para upload de arquivos
- **Sharp** para processamento de imagens
- **PM2** para gerenciamento de processos

### Infraestrutura
- **Nginx** como reverse proxy
- **Ubuntu** 24.04.3 LTS
- **MongoDB** como banco de dados

## 📋 Pré-requisitos

- Ubuntu 24.04.3 LTS (ou similar)
- Acesso root/sudo
- Chave API da OpenAI (obtenha em https://platform.openai.com/api-keys)
- Conexão com internet

## 🚀 Instalação Automática

### Opção 1: Script Automatizado (Recomendado)

1. **Clone ou copie o projeto para o servidor:**
```bash
cd /opt
git clone <seu-repositorio> barbearia
# OU copie os arquivos manualmente
```

2. **Torne o script executável:**
```bash
chmod +x scripts/install.sh
```

3. **Execute o script de instalação:**
```bash
sudo ./scripts/install.sh
```

O script irá:
- ✅ Atualizar o sistema Ubuntu
- ✅ Instalar Node.js, MongoDB, Nginx
- ✅ Instalar todas as dependências
- ✅ Configurar Nginx como reverse proxy
- ✅ Iniciar o backend com PM2
- ✅ Fazer build do frontend
- ✅ Configurar firewall

4. **Configure a chave da OpenAI:**
```bash
sudo nano /opt/barbearia/backend/.env
```

Adicione sua chave:
```
OPENAI_API_KEY=sk-sua-chave-aqui
```

5. **Reinicie o backend:**
```bash
sudo pm2 restart barbearia-backend
```

6. **Acesse o sistema:**
```
http://51.222.31.18
```

## 🔧 Instalação Manual

### 1. Instalar Dependências do Sistema

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl wget git build-essential
```

### 2. Instalar Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 3. Instalar MongoDB

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable mongod
sudo systemctl start mongod
```

### 4. Instalar PM2

```bash
sudo npm install -g pm2
```

### 5. Instalar Nginx

```bash
sudo apt install -y nginx
```

### 6. Configurar o Projeto

```bash
# Criar diretório
sudo mkdir -p /opt/barbearia
cd /opt/barbearia

# Copiar arquivos do projeto
# (copie todos os arquivos para este diretório)

# Instalar dependências do backend
cd backend
npm install --production

# Instalar dependências do frontend
cd ../frontend
npm install

# Build do frontend
npm run build
```

### 7. Configurar Variáveis de Ambiente

```bash
cd /opt/barbearia/backend
nano .env
```

Adicione:
```env
OPENAI_API_KEY=sua-chave-aqui
MONGODB_URI=mongodb://localhost:27017/barbearia
PORT=5000
NODE_ENV=production
VITE_API_URL=http://51.222.31.18:5000
```

### 8. Criar Diretório de Uploads

```bash
mkdir -p /opt/barbearia/backend/uploads
chmod 755 /opt/barbearia/backend/uploads
```

### 9. Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/barbearia
```

Cole a configuração de `nginx/barbearia.conf` e ajuste os caminhos se necessário.

```bash
# Habilitar site
sudo ln -s /etc/nginx/sites-available/barbearia /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### 10. Iniciar Backend com PM2

```bash
cd /opt/barbearia/backend
pm2 start server.js --name barbearia-backend
pm2 save
pm2 startup
```

## 📡 API Endpoints

### POST /api/upload
Upload de foto e análise facial.

**Request:**
- `photo`: Arquivo de imagem (multipart/form-data)
- `styleType`: "cabelo", "barba" ou "ambos"

**Response:**
```json
{
  "success": true,
  "originalImage": "/uploads/...",
  "faceShape": "oval",
  "recommendations": [
    {
      "name": "Corte Clássico",
      "imageUrl": "...",
      "description": "...",
      "reason": "..."
    }
  ]
}
```

### GET /api/styles/:faceShape/:styleType
Obter estilos baseados no formato do rosto.

### GET /api/saved
Listar todos os estilos salvos.

### POST /api/saved
Salvar um estilo favorito.

**Body:**
```json
{
  "styleName": "Corte Clássico",
  "styleType": "cabelo",
  "imageUrl": "...",
  "reason": "...",
  "faceShape": "oval",
  "originalImageUrl": "..."
}
```

### DELETE /api/saved/:id
Deletar um estilo salvo.

### GET /api/health
Health check da API.

## 🔧 Comandos Úteis

### Gerenciar Backend (PM2)
```bash
# Ver logs
pm2 logs barbearia-backend

# Reiniciar
pm2 restart barbearia-backend

# Parar
pm2 stop barbearia-backend

# Status
pm2 status

# Monitorar
pm2 monit
```

### Gerenciar Nginx
```bash
# Status
sudo systemctl status nginx

# Reiniciar
sudo systemctl restart nginx

# Ver logs
sudo tail -f /var/log/nginx/error.log
```

### Gerenciar MongoDB
```bash
# Status
sudo systemctl status mongod

# Reiniciar
sudo systemctl restart mongod

# Acessar shell
mongosh
```

## 🐛 Solução de Problemas

### Porta em uso
```bash
# Verificar processo na porta 5000
sudo lsof -i :5000

# Matar processo
sudo kill -9 <PID>
```

### Erro ao compilar dependências
```bash
# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Permissões negadas
```bash
# Corrigir permissões do diretório de uploads
sudo chmod -R 755 /opt/barbearia/backend/uploads
sudo chown -R $USER:$USER /opt/barbearia/backend/uploads
```

### Nginx não inicia
```bash
# Testar configuração
sudo nginx -t

# Ver logs de erro
sudo tail -f /var/log/nginx/error.log
```

### Backend não inicia
```bash
# Ver logs do PM2
pm2 logs barbearia-backend

# Verificar se a porta está livre
sudo netstat -tulpn | grep 5000

# Verificar variáveis de ambiente
cat /opt/barbearia/backend/.env
```

## 🔐 Segurança

- ✅ Validação de tipos de arquivo (apenas JPG, JPEG, PNG)
- ✅ Limite de tamanho de arquivo (10MB)
- ✅ Sanitização de uploads
- ✅ Timeout de requisições
- ✅ Tratamento de erros robusto

## 📝 Estrutura do Projeto

```
barbearia/
├── backend/
│   ├── models/
│   │   └── SavedStyle.js
│   ├── routes/
│   │   ├── upload.js
│   │   ├── styles.js
│   │   └── saved.js
│   ├── services/
│   │   └── aiService.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── UploadSection.jsx
│   │   │   ├── StyleSelection.jsx
│   │   │   ├── Results.jsx
│   │   │   └── SavedStyles.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── dist/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── scripts/
│   └── install.sh
├── nginx/
│   └── barbearia.conf
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🎨 Personalização

### Alterar Porta do Backend
1. Edite `backend/.env`: `PORT=5000`
2. Edite `nginx/barbearia.conf`: `proxy_pass http://localhost:5000;`
3. Reinicie: `pm2 restart barbearia-backend && sudo systemctl restart nginx`

### Trocar Provedor de IA
Edite `backend/services/aiService.js` e substitua a lógica de análise facial.

### Alterar Cores do Design
Edite `frontend/tailwind.config.js` e `frontend/src/index.css`.

## 📄 Licença

MIT License

## 👨‍💻 Suporte

Para problemas ou dúvidas:
1. Verifique os logs: `pm2 logs barbearia-backend`
2. Verifique o status dos serviços
3. Consulte a seção de Solução de Problemas acima

---

**Desenvolvido com ❤️ para barbearias modernas**

