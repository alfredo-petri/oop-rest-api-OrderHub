import { UsersController } from '@/controllers/users-controller'
import { Router } from 'express'

const usersRoutes = Router()
const usersController = new UsersController()


/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar novo usuário
 *     description: |
 *       Cria um novo usuário no sistema. O usuário pode ser criado como "customer" (padrão) 
 *       ou "sale" (vendedor). A senha deve ter no mínimo 6 caracteres.
 *       
 *       **Nota:** Esta rota não requer autenticação.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *           examples:
 *             customer:
 *               summary: Criar usuário cliente
 *               value:
 *                 name: João Silva
 *                 email: joao@example.com
 *                 password: senha123
 *             sale:
 *               summary: Criar usuário vendedor
 *               value:
 *                 name: Maria Santos
 *                 email: maria@example.com
 *                 password: senha456
 *                 role: sale
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponse'
 *             examples:
 *               success:
 *                 summary: Usuário criado
 *                 value:
 *                   newUser:
 *                     id: "123e4567-e89b-12d3-a456-426614174000"
 *                     name: "João Silva"
 *                     email: "joao@example.com"
 *                     role: "customer"
 *                     createdAt: "2024-01-15T10:30:00.000Z"
 *                     updatedAt: null
 *       400:
 *         description: Erro de validação dos dados fornecidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               invalidEmail:
 *                 summary: Email inválido
 *                 value:
 *                   message: "validation error:"
 *                   issues:
 *                     - field: "email"
 *                       message: "Invalid email"
 *                       code: "invalid_string"
 *               shortPassword:
 *                 summary: Senha muito curta
 *                 value:
 *                   message: "validation error:"
 *                   issues:
 *                     - field: "password"
 *                       message: "String must contain at least 6 character(s)"
 *                       code: "too_small"
 *               missingFields:
 *                 summary: Campos obrigatórios faltando
 *                 value:
 *                   message: "validation error:"
 *                   issues:
 *                     - field: "name"
 *                       message: "Required"
 *                       code: "invalid_type"
 *                     - field: "email"
 *                       message: "Required"
 *                       code: "invalid_type"
 */
usersRoutes.post('/', usersController.create)

export { usersRoutes }
