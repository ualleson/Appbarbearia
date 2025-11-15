# 📦 Guia de Instalação Rápida

## Instalação Automática (Recomendado)

### Passo 1: Preparar o Servidor

Certifique-se de que você tem:
- Ubuntu 24.04.3 LTS
- Acesso root/sudo
- Conexão com internet

### Passo 2: Copiar Arquivos

Copie todos os arquivos do projeto para o servidor. Você pode:
- Usar `scp` para copiar do seu computador
- Usar `git clone` se o projeto estiver em um repositório
- Usar `rsync` para sincronizar

Exemplo:
```bash
# No servidor
cd /opt
git clone <seu-repositorio> barbearia
# OU
scp -r /caminho/local/* usuario@servidor:/opt/barbearia/
```

### Passo 3: Executar Script de Instalação

```bash
cd /opt/barbearia
chmod +x scripts/install.sh
sudo ./scripts/install.sh
```

O script irá instalar tudo automaticamente!

### Passo 4: Configurar OpenAI API Key

```bash
sudo nano /opt/barbearia/backend/.env
```

Adicione sua chave:
```
OPENAI_API_KEY=sk-sua-chave-aqui
```

### Passo 5: Reiniciar Backend

```bash
sudo pm2 restart barbearia-backend
```

### Passo 6: Acessar

Abra no navegador:
```
http://51.222.31.18
```

## Verificação Pós-Instalação

### Verificar Serviços

```bash
# Backend
pm2 status

# Nginx
sudo systemctl status nginx

# MongoDB
sudo systemctl status mongod
```

### Verificar Logs

```bash
# Logs do backend
pm2 logs barbearia-backend

# Logs do Nginx
sudo tail -f /var/log/nginx/error.log
```

## Problemas Comuns

### Erro: Porta já em uso
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

### Erro: Permissões negadas
```bash
sudo chmod -R 755 /opt/barbearia/backend/uploads
sudo chown -R $USER:$USER /opt/barbearia
```

### Erro: Nginx não inicia
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Próximos Passos

1. ✅ Configure a chave da OpenAI
2. ✅ Teste o upload de uma foto
3. ✅ Verifique se as recomendações aparecem
4. ✅ Teste salvar um estilo favorito

---

**Pronto! Seu sistema está funcionando! 🎉**

