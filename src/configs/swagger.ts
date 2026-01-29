import swaggerJsdoc from 'swagger-jsdoc'
import { env } from '../utils/env'

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
  // Caminhos onde o swagger-jsdoc vai procurar por comentários JSDoc
  apis: [
    './src/routes/*.ts', // Busca em todos os arquivos de rotas
    './src/app.ts', // Caso você adicione documentação no app.ts
  ],
}

// Gera a especificação Swagger a partir dos comentários JSDoc
export const swaggerSpec = swaggerJsdoc(swaggerOptions)