---
name: Expor OrderHub API na Web com Cloudflare Tunnel
overview: Plano completo para configurar o ambiente local e expor a API OrderHub na web usando Cloudflare Tunnel, incluindo preparação de segurança e configurações necessárias.
todos:
  - id: verify-dependencies
    content: Verificar e instalar dependências do sistema (Node.js >=18, Docker, Docker Compose)
    status: pending
  - id: setup-local-env
    content: "Configurar ambiente local: criar .env, iniciar banco de dados, executar migrações"
    status: pending
  - id: test-local
    content: Testar aplicação localmente para garantir funcionamento
    status: pending
  - id: add-cors-security
    content: Adicionar CORS e configurações de segurança (helmet) para exposição pública
    status: pending
  - id: configure-server-bind
    content: Configurar servidor para aceitar conexões externas (bind 0.0.0.0)
    status: pending
  - id: create-cloudflare-token
    content: Criar API token no Cloudflare com permissões necessárias
    status: pending
  - id: create-tunnel
    content: Criar Cloudflare Tunnel via API e obter token do tunnel
    status: pending
  - id: configure-ingress
    content: Configurar ingress rules do tunnel para rotear tráfego para localhost:3333
    status: pending
  - id: setup-dns
    content: Criar registro DNS CNAME apontando para o tunnel (se tiver domínio)
    status: pending
  - id: install-cloudflared
    content: Instalar cloudflared no servidor e configurar como serviço
    status: pending
  - id: verify-tunnel
    content: Verificar status do tunnel e testar acesso público à API
    status: pending
  - id: security-review
    content: Revisar configurações de segurança e considerar melhorias adicionais
    status: pending
isProject: false
---

# Plano Estratégico: Expor OrderHub API na Web

## Análise do Projeto

### Estrutura Atual

- **Tipo**: REST API Node.js/Express com TypeScript
- **Banco de Dados**: PostgreSQL (via Docker Compose)
- **ORM**: Prisma
- **Autenticação**: JWT (JSON Web Tokens)
- **Porta Padrão**: 3333
- **Endpoints**: `/users`, `/sessions`, `/deliveries`, `/delivery-logs`

### Dependências Identificadas

#### Software Necessário:

1. **Node.js** (versão >= 18) - Runtime JavaScript
2. **npm** - Gerenciador de pacotes (vem com Node.js)
3. **Docker** - Para containerizar o PostgreSQL
4. **Docker Compose** - Para orquestrar o container do banco
5. **Git** - Para clonar/gerenciar o código (opcional)

#### Pacotes npm (já no package.json):

- Express.js - Framework web
- Prisma - ORM para PostgreSQL
- JWT - Autenticação
- Zod - Validação de dados
- bcrypt - Hash de senhas
- TypeScript - Linguagem

## Passo 1: Verificação e Instalação de Dependências

### 1.1 Verificar Instalações Existentes

```bash
# Verificar Node.js
node --version  # Deve ser >= 18

# Verificar npm
npm --version

# Verificar Docker
docker --version

# Verificar Docker Compose
docker compose version
```

### 1.2 Instalar Dependências Faltantes

- **Node.js**: Baixar de [nodejs.org](https://nodejs.org/) (versão LTS recomendada)
- **Docker**: Instalar seguindo [docs.docker.com](https://docs.docker.com/get-docker/)
- **Docker Compose**: Geralmente vem com Docker Desktop

### 1.3 Instalar Dependências do Projeto

```bash
npm install
```

## Passo 2: Configuração do Ambiente Local

### 2.1 Criar Arquivo .env

Criar arquivo `.env` na raiz do projeto com:

```env
DATABASE_URL='postgresql://postgres:postgres@localhost:5432/OrderHub-api'
JWT_SECRET='sua_chave_secreta_super_segura_aqui_use_uma_string_longa_e_aleatoria'
PORT=3333
```

**Importante**: 

- `JWT_SECRET` deve ser uma string longa e aleatória (mínimo 32 caracteres)
- Use um gerador de senhas ou: `openssl rand -base64 32`

### 2.2 Iniciar Banco de Dados

```bash
docker compose up -d
```

Isso inicia o PostgreSQL em background na porta 5432.

### 2.3 Executar Migrações do Banco

```bash
npx prisma migrate dev
```

Isso cria as tabelas no banco de dados.

### 2.4 Testar Aplicação Localmente

```bash
npm run dev
```

A API deve estar rodando em `http://localhost:3333`

### 2.5 Verificar Funcionamento

Testar endpoint de saúde ou criar um usuário:

```bash
curl http://localhost:3333/users -X POST -H "Content-Type: application/json" -d '{"name":"Teste","email":"teste@teste.com","password":"123456"}'
```

## Passo 3: Preparações para Exposição Pública

### 3.1 Adicionar CORS (Cross-Origin Resource Sharing)

A API precisa aceitar requisições de outros domínios. Adicionar pacote `cors`:

```bash
npm install cors
npm install --save-dev @types/cors
```

Modificar `src/app.ts` para incluir CORS:

```typescript
import cors from 'cors'
// ... outros imports

app.use(cors()) // Permitir todas origens (ou configurar específicas)
```

### 3.2 Configurar Servidor para Aceitar Conexões Externas

Modificar `src/server.ts` para bind em `0.0.0.0`:

```typescript
app.listen(PORT, '0.0.0.0', () => console.log(`server running on ${PORT} port`))
```

### 3.3 (Opcional) Adicionar Segurança com Helmet

```bash
npm install helmet
```

Adicionar em `src/app.ts`:

```typescript
import helmet from 'helmet'
app.use(helmet())
```

## Passo 4: Configuração do Cloudflare Tunnel

### 4.1 Criar Conta Cloudflare (se necessário)

- Acessar [cloudflare.com](https://www.cloudflare.com/)
- Criar conta gratuita
- Adicionar domínio (ou usar subdomínio de teste)

### 4.2 Criar API Token no Cloudflare

1. Acessar: [Cloudflare Dashboard > My Profile > API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Clicar em "Create Token"
3. Usar template "Edit zone DNS" ou criar custom com permissões:
  - **Account** > **Cloudflare Tunnel** > **Edit**
  - **Zone** > **DNS** > **Edit**
4. Copiar o token gerado (salvar em local seguro)

### 4.3 Obter IDs Necessários

```bash
# Obter Account ID
# No dashboard Cloudflare, na sidebar direita da página inicial

# Obter Zone ID (se tiver domínio)
# No dashboard, selecionar domínio > Overview > Zone ID na sidebar direita
```

### 4.4 Criar Tunnel via API

```bash
export CLOUDFLARE_API_TOKEN="seu_token_aqui"
export ACCOUNT_ID="seu_account_id_aqui"

curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/cfd_tunnel" \
  --request POST \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --json '{
    "name": "orderhub-tunnel",
    "config_src": "cloudflare"
  }'
```

**Salvar**:

- `id` do tunnel (ex: `c1744f8b-faa1-48a4-9e5c-02ac921467fa`)
- `token` do tunnel (ex: `eyJhIjoiNWFiNGU5Z...`)

### 4.5 Configurar Ingress Rules (Roteamento)

```bash
export TUNNEL_ID="id_do_tunnel_obtido_acima"

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

**Nota**: Se não tiver domínio próprio, pode usar um subdomínio temporário ou configurar depois.

### 4.6 Criar Registro DNS (se tiver domínio)

```bash
export ZONE_ID="zone_id_do_seu_dominio"

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

### 4.7 Instalar cloudflared

**Linux**:

```bash
# Ubuntu/Debian
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Ou via package manager
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x cloudflared
sudo mv cloudflared /usr/local/bin/
```

### 4.8 Executar Tunnel como Serviço

```bash
export TUNNEL_TOKEN="token_obtido_no_passo_4.4"

sudo cloudflared service install $TUNNEL_TOKEN
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

**Verificar status**:

```bash
sudo systemctl status cloudflared
```

### 4.9 Verificar Tunnel Ativo

```bash
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/cfd_tunnel/$TUNNEL_ID" \
  --request GET \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

Procurar por `"status": "healthy"` e `connections` com 4 conexões ativas.

## Passo 5: Verificações e Passos Adicionais

### 5.1 Testar API Pública

Após configurar DNS, testar:

```bash
curl https://api.seudominio.com/users
```

### 5.2 Configurar Firewall (se necessário)

- Garantir que porta 3333 está acessível localmente (não precisa abrir no firewall público)
- Cloudflare Tunnel faz conexão outbound, não precisa abrir portas

### 5.3 Considerações de Segurança

- JWT_SECRET forte e único
- CORS configurado adequadamente
- Rate limiting (considerar adicionar)
- Logs de acesso
- Backup do banco de dados

### 5.4 Monitoramento

- Verificar logs do cloudflared: `journalctl -u cloudflared -f`
- Verificar logs da aplicação
- Monitorar uso no dashboard Cloudflare

### 5.5 Variáveis de Ambiente para Produção

Considerar usar variáveis diferentes:

- `DATABASE_URL` de produção (se migrar banco)
- `JWT_SECRET` diferente do desenvolvimento
- `NODE_ENV=production`

## Arquivos que Serão Modificados

1. **src/app.ts** - Adicionar CORS e Helmet
2. **src/server.ts** - Bind em 0.0.0.0
3. **package.json** - Adicionar dependências cors e helmet
4. **.env** - Criar arquivo com variáveis de ambiente

## Comandos Resumidos por Etapa

### Setup Inicial

```bash
npm install
docker compose up -d
npx prisma migrate dev
```

### Configuração

```bash
# Criar .env com variáveis necessárias
npm install cors helmet
npm install --save-dev @types/cors
```

### Cloudflare

```bash
# Instalar cloudflared
# Criar tunnel via API
# Configurar ingress
# Instalar como serviço
sudo cloudflared service install <TOKEN>
```

## Próximos Passos Após Exposição

1. Testar todos os endpoints
2. Configurar Cloudflare Access (opcional, para proteger endpoints)
3. Configurar SSL/TLS (automático com Cloudflare)
4. Monitorar performance e logs
5. Considerar CI/CD para deploy automático
