# Documentação do Deploy - OrderHub API

Este documento contém todo o histórico e comandos utilizados para expor a API OrderHub na web usando Cloudflare Tunnel.

**Data do Deploy:** 29 de Janeiro de 2026

---

## 📋 Índice

1. [Resumo do Processo](#resumo-do-processo)
2. [Configuração do Ambiente Local](#configuração-do-ambiente-local)
3. [Modificações no Código](#modificações-no-código)
4. [Configuração do Cloudflare Tunnel](#configuração-do-cloudflare-tunnel)
5. [Variáveis e IDs](#variáveis-e-ids)
6. [Comandos Executados](#comandos-executados)
7. [Estrutura Final](#estrutura-final)

---

## Resumo do Processo

Este processo envolveu:
- Preparação da aplicação para aceitar requisições externas (CORS e bind 0.0.0.0)
- Criação de um Cloudflare Tunnel
- Configuração de ingress rules
- Criação de registro DNS (CNAME)

**URL Final:** `https://api.petrisolucoes.com.br`

---

## Configuração do Ambiente Local

### 1. Arquivo `.env` Criado

Localização: `/home/server-alfredo/code/oop-rest-api-OrderHub/.env`

```env
DATABASE_URL='postgresql://postgres:postgres@localhost:5432/OrderHub-api'
JWT_SECRET='auth2026!@#$%^&*()'
PORT=3333
```

### 2. Dependências Instaladas

Foram adicionadas as seguintes dependências ao projeto:

```json
{
  "cors": "^2.8.6",
  "helmet": "^8.1.0",
  "@types/cors": "^2.8.19"
}
```

**Comando executado:**
```bash
npm install cors helmet
npm install --save-dev @types/cors
```

### 3. Banco de Dados

O PostgreSQL está rodando via Docker Compose:

```bash
docker compose up -d
```

**Configuração do docker-compose.yml:**
- Image: `bitnami/postgresql:latest`
- Porta: `5432:5432`
- Database: `OrderHub-api`
- User: `postgres`
- Password: `postgres`

---

## Modificações no Código

### 1. Arquivo `src/app.ts`

**Adicionado:**
- Import do `cors`
- Import do `helmet`
- Middleware `app.use(cors())`
- Middleware `app.use(helmet())`

**Código final:**
```typescript
import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import { errorHandler } from './middlewares/error-handler'
import { routes } from './routes'
import dotenv from 'dotenv'
import helmet from 'helmet'

dotenv.config()

const app = express()

app.use(cors())

app.use(helmet())

app.use(express.json())

app.use(routes)

app.use(errorHandler)

export { app }
```

### 2. Arquivo `src/server.ts`

**Modificado:**
- Alterado o bind do servidor de `localhost` para `0.0.0.0` para aceitar conexões externas

**Código final:**
```typescript
import { app } from './app'
import { env } from './utils/env'

const PORT = env.PORT

// app.listen(PORT, () => console.log(`server running on ${PORT} port`))
app.listen(PORT, '0.0.0.0', () => console.log(`server running on ${PORT} port`))
```

**Motivo:** O bind `0.0.0.0` permite que o servidor aceite conexões de qualquer interface de rede, necessário para o Cloudflare Tunnel funcionar.

---

## Configuração do Cloudflare Tunnel

### 1. Variáveis de Ambiente do Cloudflare

Foram criadas as seguintes variáveis de ambiente no terminal:

```bash
# API Token do Cloudflare
export CLOUDFLARE_API_TOKEN="S1a7LZv7TMohSB9PdYul-UeMbTz4zjuYXpvVdZn4"

# Account ID do Cloudflare
export ACCOUNT_ID="496e6306987d27e89492d543f4159cd3"

# Tunnel ID (obtido após criar o tunnel)
export TUNNEL_ID="2f6dce1a-51f7-4764-887a-370df79f9cf6"

# Zone ID (para criar registro DNS)
export ZONE_ID="c87726a6fd846c2af32e2ea3c725b8df"
```

### 2. IDs e Tokens Importantes

| Item | Valor | Descrição |
|------|-------|-----------|
| **Account ID** | `496e6306987d27e89492d543f4159cd3` | ID da conta Cloudflare |
| **Tunnel ID** | `2f6dce1a-51f7-4764-887a-370df79f9cf6` | ID único do tunnel criado |
| **Tunnel Name** | `order-hub` | Nome do tunnel |
| **Zone ID** | `c87726a6fd846c2af32e2ea3c725b8df` | ID da zona DNS do domínio |
| **DNS Record ID** | `b0588b5168fdc8951a71d86e6aa49401` | ID do registro CNAME criado |
| **Domain** | `petrisolucoes.com.br` | Domínio configurado |
| **Subdomain** | `api.petrisolucoes.com.br` | Subdomínio final da API |

### 3. Tunnel Token

**Token do Tunnel** (salvo em local seguro):
```
eyJhIjoiNDk2ZTYzMDY5ODdkMjdlODk0OTJkNTQzZjQxNTljZDMiLCJ0IjoiMmY2ZGNlMWEtNTFmNy00NzY0LTg4N2EtMzcwZGY3OWY5Y2Y2IiwicyI6IkVPOGhoVWEvblQ2ZlFhU3g4aEF0aW00ZW0ybE5uNmRDYjNScXNtNGFzR1lmSG0zQVNxZVVaMm05NmlKajQzRVlMdXBub0tPZ0ZVYWxld3ZkZmgxY3BRPT0ifQ==
```

**Tunnel Secret**:
```
EO8hhUa/nT6fQaSx8hAtim4em2lNn6dCb3Rqsm4asGYfHm3ASqeUZ2m96iJj43EYLupnoKOgFUalewvdfh1cpQ==
```

---

## Comandos Executados

### Passo 1: Tentativas de Criação do Tunnel (com erros de autenticação)

```bash
export CLOUDFLARE_API_TOKEN="phbhPXdAaqhUqgk2a7JnWLriyNhKcYvmK39v_PIF"
export ACCOUNT_ID="496e6306987d27e89492d543f4159cd3"

curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/cfd_tunnel" \
  --request POST \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --json '{
    "name": "orderhub-tunnel",
    "config_src": "cloudflare"
  }'
# Resultado: {"success":false,"errors":[{"code":10000,"message":"Authentication error"}]}
```

### Passo 2: Criação Bem-Sucedida do Tunnel

```bash
export CLOUDFLARE_API_TOKEN="S1a7LZv7TMohSB9PdYul-UeMbTz4zjuYXpvVdZn4"
export ACCOUNT_ID="496e6306987d27e89492d543f4159cd3"

curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/cfd_tunnel" \
  --request POST \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --json '{
    "name": "order-hub",
    "config_src": "cloudflare"
  }'
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "errors": [],
  "messages": [],
  "result": {
    "id": "2f6dce1a-51f7-4764-887a-370df79f9cf6",
    "name": "order-hub",
    "token": "eyJhIjoiNDk2ZTYzMDY5ODdkMjdlODk0OTJkNTQzZjQxNTljZDMiLCJ0IjoiMmY2ZGNlMWEtNTFmNy00NzY0LTg4N2EtMzcwZGY3OWY5Y2Y2IiwicyI6IkVPOGhoVWEvblQ2ZlFhU3g4aEF0aW00ZW0ybE5uNmRDYjNScXNtNGFzR1lmSG0zQVNxZVVaMm05NmlKajQzRVlMdXBub0tPZ0ZVYWxld3ZkZmgxY3BRPT0ifQ==",
    "status": "inactive",
    ...
  }
}
```

### Passo 3: Configuração do Ingress (Primeira Tentativa)

```bash
export TUNNEL_ID="2f6dce1a-51f7-4764-887a-370df79f9cf6"

curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/cfd_tunnel/$TUNNEL_ID/configurations" \
  --request PUT \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --json '{
    "config": {
        "ingress": [
            {
                "hostname": "api.seudominio.com",
                "service": "http://localhost:3333",
                "originRequest": {}
            },
            {
                "service": "http_status:404"
            }
        ]
    }
  }'
```

### Passo 4: Configuração Final do Ingress (com domínio correto)

```bash
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/cfd_tunnel/$TUNNEL_ID/configurations" \
  --request PUT \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --json '{
    "config": {
        "ingress": [
            {
                "hostname": "petrisolucoes.com.br",
                "service": "http://localhost:3333",
                "originRequest": {}
            },
            {
                "service": "http_status:404"
            }
        ]
    }
  }'
```

**Resposta:**
```json
{
  "success": true,
  "result": {
    "tunnel_id": "2f6dce1a-51f7-4764-887a-370df79f9cf6",
    "version": 2,
    "config": {
      "ingress": [
        {
          "service": "http://localhost:3333",
          "hostname": "petrisolucoes.com.br",
          "originRequest": {}
        },
        {
          "service": "http_status:404"
        }
      ]
    }
  }
}
```

### Passo 5: Criação do Registro DNS (CNAME)

```bash
export ZONE_ID="c87726a6fd846c2af32e2ea3c725b8df"

curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  --request POST \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --json '{
    "type": "CNAME",
    "proxied": true,
    "name": "api",
    "content": "'$TUNNEL_ID'.cfargotunnel.com"
  }'
```

**Resposta de Sucesso:**
```json
{
  "result": {
    "id": "b0588b5168fdc8951a71d86e6aa49401",
    "name": "api.petrisolucoes.com.br",
    "type": "CNAME",
    "content": "2f6dce1a-51f7-4764-887a-370df79f9cf6.cfargotunnel.com",
    "proxied": true,
    "ttl": 1
  },
  "success": true
}
```

---

## Estrutura Final

### URLs Configuradas

- **API Local:** `http://localhost:3333`
- **API Pública:** `https://api.petrisolucoes.com.br`
- **Tunnel Endpoint:** `2f6dce1a-51f7-4764-887a-370df79f9cf6.cfargotunnel.com`

### Configuração do Ingress Rules

```
petrisolucoes.com.br → http://localhost:3333
(default) → http_status:404
```

### Registro DNS Criado

- **Tipo:** CNAME
- **Nome:** `api`
- **Conteúdo:** `2f6dce1a-51f7-4764-887a-370df79f9cf6.cfargotunnel.com`
- **Proxied:** `true` (SSL/TLS automático via Cloudflare)

---

## Próximos Passos

### Para Ativar o Tunnel

1. **Instalar cloudflared** (se ainda não instalado):
   ```bash
   # Ubuntu/Debian
   wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared-linux-amd64.deb
   ```

2. **Executar o tunnel como serviço**:
   ```bash
   export TUNNEL_TOKEN="eyJhIjoiNDk2ZTYzMDY5ODdkMjdlODk0OTJkNTQzZjQxNTljZDMiLCJ0IjoiMmY2ZGNlMWEtNTFmNy00NzY0LTg4N2EtMzcwZGY3OWY5Y2Y2IiwicyI6IkVPOGhoVWEvblQ2ZlFhU3g4aEF0aW00ZW0ybE5uNmRDYjNScXNtNGFzR1lmSG0zQVNxZVVaMm05NmlKajQzRVlMdXBub0tPZ0ZVYWxld3ZkZmgxY3BRPT0ifQ=="
   
   sudo cloudflared service install $TUNNEL_TOKEN
   sudo systemctl start cloudflared
   sudo systemctl enable cloudflared
   ```

3. **Verificar status do tunnel**:
   ```bash
   sudo systemctl status cloudflared
   ```

4. **Verificar status via API**:
   ```bash
   curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/cfd_tunnel/$TUNNEL_ID" \
     --request GET \
     --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
   ```

### Testar a API Pública

Depois de iniciar o tunnel e garantir que a aplicação está rodando:

```bash
curl https://api.petrisolucoes.com.br/users
```

---

## Troubleshooting

### Problemas Encontrados e Soluções

1. **Erro de Autenticação no Cloudflare**
   - **Problema:** Tokens iniciais não funcionavam
   - **Solução:** Criado novo token com permissões corretas no dashboard Cloudflare

2. **CORS não funcionava inicialmente**
   - **Problema:** Faltava o `import cors from 'cors'`
   - **Solução:** Adicionado import no `src/app.ts`

3. **Servidor não aceitava conexões externas**
   - **Problema:** Bind padrão era apenas `localhost`
   - **Solução:** Alterado para `0.0.0.0` no `src/server.ts`

---

## Informações de Segurança

⚠️ **IMPORTANTE:** 

- O arquivo `.env` contém informações sensíveis e está no `.gitignore`
- Os tokens do Cloudflare devem ser mantidos em segurança
- O `JWT_SECRET` deve ser uma chave forte em produção
- O tunnel token deve ser protegido

### Recomendações:

1. Usar variáveis de ambiente para produção
2. Rotacionar tokens periodicamente
3. Monitorar logs de acesso
4. Implementar rate limiting
5. Usar HTTPS sempre (já configurado via Cloudflare)

---

## Referências

- [Documentação Cloudflare Tunnel - API](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/get-started/create-remote-tunnel-api/)
- [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [Prisma Documentation](https://www.prisma.io/docs)

---

**Última atualização:** 29 de Janeiro de 2026
**Status:** Tunnel criado e configurado, aguardando instalação do cloudflared para ativação
