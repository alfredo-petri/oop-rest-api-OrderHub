/**
 * Schemas e componentes reutilizáveis para documentação Swagger
 * 
 * Este arquivo define todos os schemas de dados, enums e componentes
 * que serão referenciados na documentação das rotas.
 */

export const swaggerSchemas = {
    components: {
      schemas: {
        // ============================================
        // ENUMS
        // ============================================
        UserRole: {
          type: 'string',
          enum: ['customer', 'sale'],
          description: 'Papel do usuário no sistema',
          example: 'customer',
        },
        DeliveryStatus: {
          type: 'string',
          enum: ['acepted', 'production', 'shipped', 'delivered'],
          description: 'Status da entrega',
          example: 'acepted',
        },
  
        // ============================================
        // USER SCHEMAS
        // ============================================
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do usuário',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            name: {
              type: 'string',
              description: 'Nome completo do usuário',
              example: 'João Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'joao@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Senha do usuário (apenas em requisições de criação)',
              example: 'senha123',
              minLength: 6,
            },
            role: {
              $ref: '#/components/schemas/UserRole',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do usuário',
              example: '2024-01-15T10:30:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Data da última atualização do usuário',
              example: '2024-01-15T10:30:00.000Z',
            },
          },
          required: ['id', 'name', 'email', 'role', 'createdAt'],
        },
        UserWithoutPassword: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do usuário',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            name: {
              type: 'string',
              description: 'Nome completo do usuário',
              example: 'João Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'joao@example.com',
            },
            role: {
              $ref: '#/components/schemas/UserRole',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do usuário',
              example: '2024-01-15T10:30:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Data da última atualização do usuário',
              example: '2024-01-15T10:30:00.000Z',
            },
          },
          required: ['id', 'name', 'email', 'role', 'createdAt'],
        },
        CreateUserRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nome completo do usuário',
              example: 'João Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'joao@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Senha do usuário (mínimo 6 caracteres)',
              example: 'senha123',
              minLength: 6,
            },
            role: {
              $ref: '#/components/schemas/UserRole',
              description: 'Papel do usuário (opcional, padrão: customer)',
              example: 'customer',
            },
          },
          required: ['name', 'email', 'password'],
        },
        CreateUserResponse: {
          type: 'object',
          properties: {
            newUser: {
              $ref: '#/components/schemas/User',
            },
          },
        },
  
        // ============================================
        // SESSION SCHEMAS
        // ============================================
        CreateSessionRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'joao@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Senha do usuário',
              example: 'senha123',
            },
          },
          required: ['email', 'password'],
        },
        CreateSessionResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Token JWT para autenticação nas requisições protegidas',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            userWithoutPassword: {
              $ref: '#/components/schemas/UserWithoutPassword',
            },
          },
          required: ['token', 'userWithoutPassword'],
        },
  
        // ============================================
        // DELIVERY SCHEMAS
        // ============================================
        Delivery: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único da entrega',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'ID do usuário que criou a entrega',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            description: {
              type: 'string',
              description: 'Descrição da entrega',
              example: 'Entrega de produtos eletrônicos',
            },
            status: {
              $ref: '#/components/schemas/DeliveryStatus',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação da entrega',
              example: '2024-01-15T10:30:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Data da última atualização da entrega',
              example: '2024-01-15T10:30:00.000Z',
            },
            user: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  example: 'João Silva',
                },
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'joao@example.com',
                },
              },
              description: 'Informações do usuário (quando incluído na resposta)',
            },
            logs: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/DeliveryLog',
              },
              description: 'Logs de rastreamento da entrega (quando incluído na resposta)',
            },
          },
          required: ['id', 'userId', 'description', 'status', 'createdAt'],
        },
        CreateDeliveryRequest: {
          type: 'object',
          properties: {
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID do usuário que está criando a entrega',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            description: {
              type: 'string',
              description: 'Descrição da entrega',
              example: 'Entrega de produtos eletrônicos',
            },
          },
          required: ['user_id', 'description'],
        },
        UpdateDeliveryStatusRequest: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID da entrega a ser atualizada',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            status: {
              $ref: '#/components/schemas/DeliveryStatus',
            },
          },
          required: ['id', 'status'],
        },
        DeliveriesListResponse: {
          type: 'object',
          properties: {
            deliveries: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Delivery',
              },
            },
          },
          required: ['deliveries'],
        },
  
        // ============================================
        // DELIVERY LOG SCHEMAS
        // ============================================
        DeliveryLog: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do log',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            description: {
              type: 'string',
              description: 'Descrição do evento/log',
              example: 'Pacote saiu para entrega',
            },
            deliveryId: {
              type: 'string',
              format: 'uuid',
              description: 'ID da entrega relacionada',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do log',
              example: '2024-01-15T10:30:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Data da última atualização do log',
              example: '2024-01-15T10:30:00.000Z',
            },
          },
          required: ['id', 'description', 'deliveryId', 'createdAt'],
        },
        DeliveryLogPartial: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'Descrição do evento/log',
              example: 'Pacote saiu para entrega',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Data da última atualização do log',
              example: '2024-01-15T10:30:00.000Z',
            },
          },
          required: ['description'],
          description: 'Versão parcial do log (usada quando incluído na resposta de Delivery)',
        },
        CreateDeliveryLogRequest: {
          type: 'object',
          properties: {
            delivery_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID da entrega para adicionar o log',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            description: {
              type: 'string',
              description: 'Descrição do evento/log',
              example: 'Pacote saiu para entrega',
            },
          },
          required: ['delivery_id', 'description'],
        },
        DeliveryWithLogsResponse: {
          $ref: '#/components/schemas/Delivery',
          description: 'Entrega completa com logs e informações do usuário',
        },
  
        // ============================================
        // ERROR SCHEMAS
        // ============================================
        ValidationError: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'validation error:',
            },
            issues: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Campo que falhou na validação',
                    example: 'email',
                  },
                  message: {
                    type: 'string',
                    description: 'Mensagem de erro específica',
                    example: 'Invalid email',
                  },
                  code: {
                    type: 'string',
                    description: 'Código do erro de validação',
                    example: 'invalid_string',
                  },
                },
                required: ['field', 'message', 'code'],
              },
            },
          },
          required: ['message', 'issues'],
          description: 'Erro de validação retornado quando os dados da requisição não passam na validação Zod',
        },
        AppError: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro personalizada',
              example: 'Invalid credentials',
            },
          },
          required: ['message'],
          description: 'Erro personalizado retornado pela aplicação (AppError)',
        },
        ServerError: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro do servidor',
              example: 'Internal server error',
            },
          },
          required: ['message'],
          description: 'Erro genérico do servidor (status 500)',
        },
      },
    },
  }