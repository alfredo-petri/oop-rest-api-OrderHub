import path from 'path'
import swaggerJsdoc from 'swagger-jsdoc'
import { env } from '../utils/env'
import { swaggerSchemas } from '../docs/swagger'

// Configuração das opções do Swagger
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OrderHub API',
      version: '1.0.0',
      description: 'OrderHub is a scalable and secure RESTful API for managing customer orders. The system allows sellers to manage orders and update their status, while buyers can place and monitor their orders in real-time. Designed following Object-Oriented Programming principles.',
      contact: {
        name: 'Alfredo Augusto Petri',
        url: 'https://github.com/alfredo-petri/oop-rest-api-OrderHub',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Servidor de desenvolvimento local',
      },
      {
        url: process.env.PROD_SERVER_URL,
        description: 'Servidor de produção',
      },
    ],
    components: {
      // Mescla os securitySchemes e tags com os schemas
      ...swaggerSchemas.components,
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT obtido no endpoint de login (/sessions). Formato: Bearer {token}',
        },
      },
    },
    tags: [
      {
        name: 'Users',
        description: 'Operações relacionadas a usuários (criação de contas)',
      },
      {
        name: 'Sessions',
        description: 'Operações de autenticação (login e obtenção de token JWT)',
      },
      {
        name: 'Deliveries',
        description: 'Operações relacionadas a entregas/pedidos',
      },
      {
        name: 'Delivery Logs',
        description: 'Operações relacionadas aos logs de rastreamento de entregas',
      },
    ],
  },
  // Preenchido abaixo por getApisPaths() para não depender de process.cwd()
  apis: [],
}

// Resolve apis a partir do diretório deste arquivo: em build/ usa ../../src/routes; em src/ usa ../routes.
// Assim a spec não depende de process.cwd() (ex.: servidor do tunnel com cwd diferente).
function getApisPaths(): string[] {
  const dir = typeof __dirname !== 'undefined' ? __dirname : process.cwd() + path.sep + 'src' + path.sep + 'configs'
  const isBuild = dir.includes(path.sep + 'build' + path.sep)
  const routesDir = isBuild ? path.join(dir, '..', '..', 'src', 'routes') : path.join(dir, '..', 'routes')
  const appPath = isBuild ? path.join(dir, '..', '..', 'src', 'app.ts') : path.join(dir, '..', 'app.ts')
  return [
    path.join(routesDir, '*.ts'),
    path.join(routesDir, 'delivery-logs-routes.ts'),
    appPath,
  ]
}
;(swaggerOptions as { apis: string[] }).apis = getApisPaths()

// Gera a especificação Swagger a partir dos comentários JSDoc
export const swaggerSpec = swaggerJsdoc(swaggerOptions)