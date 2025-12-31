# Guia de Deployment - Lista de Compras

## Deploy no Vercel (Recomendado)

### 1. Preparar Repositório
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Conectar ao Vercel
1. Vá para [vercel.com](https://vercel.com)
2. Click "Add New" > "Project"
3. Selecione seu repositório
4. Configure as variáveis de ambiente

### 3. Variáveis de Ambiente no Vercel

Adicione no dashboard:
```
DATABASE_URL = postgresql://seu-usuario:sua-senha@host/database
NODE_ENV = production
```

### 4. Deploy
Vercel deployará automaticamente a cada push para `main`

## Deploy com Docker

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Build e Run
```bash
docker build -t lista-compras .
docker run -p 3000:3000 lista-compras
```

## Deploy no Heroku

### 1. Instalar Heroku CLI
```bash
npm install -g heroku
heroku login
```

### 2. Criar App
```bash
heroku create seu-app-name
```

### 3. Adicionar PostgreSQL
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

### 4. Configurar Variáveis
```bash
heroku config:set NODE_ENV=production
```

### 5. Deploy
```bash
git push heroku main
```

## Deploy no AWS

### Opção 1: EC2
1. Criar instância EC2
2. SSH para a instância
3. Instalar Node.js e PostgreSQL
4. Clonar repositório
5. Executar `npm install && npm run build && npm start`

### Opção 2: Elastic Beanstalk
1. Instalar AWS EB CLI
2. `eb init` e `eb create`
3. Deploy com `eb deploy`

## Deploy no DigitalOcean

### 1. Criar Droplet
- Selecionar Node.js image
- SSH para o servidor

### 2. Setup
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql-client

# Clone repo
git clone seu-repo
cd seu-repo

# Install e build
npm install
npm run build

# Setup PM2
npm install -g pm2
pm2 start "npm start" --name "lista-compras"
pm2 startup
pm2 save
```

### 3. Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Checklist de Pre-Deployment

- [ ] Testar aplicação localmente: `npm run build && npm start`
- [ ] Verificar variáveis de ambiente em `.env.example`
- [ ] Executar migrações: `npx prisma migrate deploy`
- [ ] Verificar logs: `npm run build` sem erros
- [ ] Testar Socket.io em produção
- [ ] Configurar CORS se necessário
- [ ] Adicionar certificado SSL
- [ ] Configurar backups de banco de dados

## Monitoramento em Produção

### Logs
Verificar logs do aplicativo regularmente.

### Performance
- Usar Lighthouse para auditar performance
- Monitorar com New Relic ou Datadog

### Uptime
- Configurar alertas
- Usar serviços como Uptimerobot

## Troubleshooting

### Erro: Module not found
```bash
npm install
npx prisma generate
```

### Database Connection Error
Verificar `DATABASE_URL` nas variáveis de ambiente

### Socket.io não funciona em produção
- Verificar CORS settings
- Confirmar que WebSocket está habilitado
- Usar polling como fallback

## Scaling

Para alto tráfego:
- Usar Redis para sessions
- Load balancer (nginx/HAProxy)
- Replicação de banco de dados
- CDN para assets estáticos
