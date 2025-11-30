# NASA NEO Fullstack

Aplicação fullstack para gerenciamento de Objetos Próximos à Terra (NEOs) com stack React, Node.js/Express, MongoDB, Redis e Nginx como proxy reverso com HTTPS.

## Estrutura
```
nasa-neo-fullstack/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── server.js
│       ├── config/
│       │   ├── db.js
│       │   └── redis.js
│       ├── models/
│       │   ├── User.js
│       │   └── Neo.js
│       ├── routes/
│       │   ├── auth.js
│       │   └── neos.js
│       ├── middlewares/
│       │   ├── auth.js
│       │   ├── security.js
│       │   └── errorHandler.js
│       └── utils/
│           └── token.js
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Search.jsx
│       │   └── Insert.jsx
│       ├── services/api.js
│       └── App.jsx
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Configuração do backend
1. Crie um arquivo `.env` em `backend/` baseado em `.env.example` preenchendo as variáveis:
```
MONGO_URL=mongodb://mongo:27017/neo_db
REDIS_URL=redis://redis:6379
JWT_SECRET=changeme
PORT=3001
```

## Certificados SSL para o Nginx
Crie manualmente a pasta de certificados e gere-os localmente (não são fornecidos no repositório):
```
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx/ssl/server.key -out nginx/ssl/server.crt
```
Os caminhos referenciados pelo Nginx são `/etc/nginx/ssl/server.key` e `/etc/nginx/ssl/server.crt` (mapeie a pasta `nginx/ssl` para dentro do container se desejar usar os certificados gerados).

## Subir o projeto com Docker Compose
Na raiz do projeto:
```
docker compose build
docker compose up
```

## Acesso
- Frontend servido via Nginx em: https://localhost (aceite o aviso de certificado self-signed).
- API reverse proxy em: https://localhost/api

## Autenticação padrão
- Usuário seed: `admin@example.com`
- Senha: `123`

As rotas de NEOs exigem um token JWT obtido via `POST /api/login`.
Para gerar certificados HTTPS, execute:
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx/ssl/server.key -out nginx/ssl/server.crt