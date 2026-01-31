import { SessionsController } from '@/controllers/sessions-controller'
import { Router } from 'express'

const sessionsRoutes = Router()
const sessionsController = new SessionsController()

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Autenticar usuário (login)
 *     description: |
 *       Realiza o login do usuário com email e senha. Retorna um token JWT e os dados
 *       do usuário (sem a senha). O token deve ser enviado no header Authorization
 *       (Bearer {token}) nas requisições que exigem autenticação.
 *
 *       **Nota:** Esta rota não requer autenticação.
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSessionRequest'
 *           examples:
 *             login:
 *               summary: Login com credenciais
 *               value:
 *                 email: joao@example.com
 *                 password: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso. Retorna token JWT e dados do usuário.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateSessionResponse'
 *             examples:
 *               success:
 *                 summary: Login bem-sucedido
 *                 value:
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   userWithoutPassword:
 *                     id: "123e4567-e89b-12d3-a456-426614174000"
 *                     name: "João Silva"
 *                     email: "joao@example.com"
 *                     role: "customer"
 *                     createdAt: "2024-01-15T10:30:00.000Z"
 *                     updatedAt: null
 *       400:
 *         description: Erro de validação dos dados ou credenciais inválidas (senha incorreta).
 *         content:
 *           application/json:
 *             examples:
 *               validationError:
 *                 summary: Erro de validação (campos inválidos)
 *                 value:
 *                   message: "validation error:"
 *                   issues:
 *                     - field: "email"
 *                       message: "Invalid email"
 *                       code: "invalid_string"
 *               invalidCredentials:
 *                 summary: Email ou senha inválidos
 *                 value:
 *                   message: "email or password invalid"
 *       404:
 *         description: Usuário não encontrado (email não cadastrado).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: "email or password invalid"
 */
sessionsRoutes.post('/', sessionsController.create)

export { sessionsRoutes }
