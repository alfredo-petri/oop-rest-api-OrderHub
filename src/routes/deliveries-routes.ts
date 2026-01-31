import { DeliveriesController } from '@/controllers/deliveries-controller'
import { DeliveryStatusController } from '@/controllers/delivery-status-controller'
import { ensureAuthenticated } from '@/middlewares/ensure-authenticated'
import { verifyUserAuthorization } from '@/middlewares/verify-user-authorization'
import { Router } from 'express'

const deliveriesRoutes = Router()
const deliveriesController = new DeliveriesController()
const deliveriesStatusController = new DeliveryStatusController()

deliveriesRoutes.use(ensureAuthenticated)

/**
 * @swagger
 * /deliveries:
 *   post:
 *     summary: Criar nova entrega
 *     description: |
 *       Cria uma nova entrega associada a um usuário. Requer autenticação via token JWT
 *       no header Authorization (Bearer {token}). O token é obtido no endpoint POST /sessions.
 *
 *       **Autenticação:** Bearer token obrigatório.
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDeliveryRequest'
 *           examples:
 *             delivery:
 *               summary: Criar entrega
 *               value:
 *                 user_id: "123e4567-e89b-12d3-a456-426614174000"
 *                 description: "Entrega de produtos eletrônicos"
 *     responses:
 *       201:
 *         description: Entrega criada com sucesso (corpo vazio).
 *         content:
 *           application/json: {}
 *       400:
 *         description: Erro de validação dos dados fornecidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               message: "validation error:"
 *               issues:
 *                 - field: "user_id"
 *                   message: "Invalid uuid"
 *                   code: "invalid_string"
 *       401:
 *         description: Não autenticado. Token ausente ou inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             examples:
 *               tokenRequired:
 *                 summary: Token não informado
 *                 value:
 *                   message: "token is required"
 *               invalidToken:
 *                 summary: Token inválido ou expirado
 *                 value:
 *                   message: "invalid token, unauthorized"
 */
// all user types
deliveriesRoutes.post('/', deliveriesController.create)

deliveriesRoutes.use(verifyUserAuthorization(['sale']))

/**
 * @swagger
 * /deliveries:
 *   get:
 *     summary: Listar todas as entregas
 *     description: |
 *       Retorna a lista de todas as entregas com detalhes (usuário, logs). Requer autenticação
 *       via token JWT e permissão de usuário com role **sale** (vendedor).
 *
 *       **Autenticação:** Bearer token obrigatório.
 *       **Autorização:** Apenas usuários com role "sale".
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de entregas retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveriesListResponse'
 *             example:
 *               deliveries:
 *                 - id: "123e4567-e89b-12d3-a456-426614174000"
 *                   userId: "123e4567-e89b-12d3-a456-426614174001"
 *                   description: "Entrega de produtos eletrônicos"
 *                   status: "acepted"
 *                   createdAt: "2024-01-15T10:30:00.000Z"
 *                   updatedAt: null
 *                   user:
 *                     name: "João Silva"
 *                     email: "joao@example.com"
 *                   logs: []
 *       401:
 *         description: Não autenticado ou não autorizado (requer role "sale").
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             examples:
 *               tokenRequired:
 *                 summary: Token não informado
 *                 value:
 *                   message: "token is required"
 *               invalidToken:
 *                 summary: Token inválido ou expirado
 *                 value:
 *                   message: "invalid token, unauthorized"
 *               unauthorized:
 *                 summary: Usuário sem permissão (role diferente de "sale")
 *                 value:
 *                   message: "unauthorized"
 */
// only sale user
deliveriesRoutes.get('/', deliveriesController.get)
deliveriesRoutes.patch('/status', deliveriesStatusController.updateStatus)
export { deliveriesRoutes }
