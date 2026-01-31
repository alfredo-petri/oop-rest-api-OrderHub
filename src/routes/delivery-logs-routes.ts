import { DeliveryLogsController } from '@/controllers/delivery-logs-controller'
import { ensureAuthenticated } from '@/middlewares/ensure-authenticated'
import { verifyUserAuthorization } from '@/middlewares/verify-user-authorization'
import { Router } from 'express'

const deliveryLogsRoutes = Router()
const deliveryLogsController = new DeliveryLogsController()

// authentication verify to all users
deliveryLogsRoutes.use(ensureAuthenticated)

/**
 * @swagger
 * /delivery-logs/{delivery_id}:
 *   get:
 *     summary: Obter detalhes de uma entrega com logs
 *     description: |
 *       Retorna os detalhes completos de uma entrega (dados da entrega, usuário e logs de rastreamento).
 *       Requer autenticação via token JWT.
 *
 *       **Regra:** Usuários com role "customer" só podem visualizar entregas das quais são donos.
 *       Usuários com role "sale" podem visualizar qualquer entrega.
 *
 *       **Autenticação:** Bearer token obrigatório.
 *     tags: [Delivery Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: delivery_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da entrega
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Detalhes da entrega com logs retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryWithLogsResponse'
 *             example:
 *               id: "123e4567-e89b-12d3-a456-426614174000"
 *               userId: "123e4567-e89b-12d3-a456-426614174001"
 *               description: "Entrega de produtos eletrônicos"
 *               status: "shipped"
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *               updatedAt: null
 *               user:
 *                 name: "João Silva"
 *                 email: "joao@example.com"
 *               logs:
 *                 - description: "Pacote saiu para entrega"
 *                   updatedAt: "2024-01-15T11:00:00.000Z"
 *       401:
 *         description: Não autenticado ou não autorizado a visualizar esta entrega.
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
 *               userView:
 *                 summary: Cliente tentando ver entrega de outro usuário
 *                 value:
 *                   message: "the user can only view their deliveries"
 *       404:
 *         description: Entrega não encontrada com o id informado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: "delivery with the provided identifier not founded"
 */
deliveryLogsRoutes.get('/:delivery_id', deliveryLogsController.show)

// only sale user can do this
deliveryLogsRoutes.use(verifyUserAuthorization(['sale']))

/**
 * @swagger
 * /delivery-logs:
 *   post:
 *     summary: Criar log de rastreamento em uma entrega
 *     description: |
 *       Adiciona um novo log (evento de rastreamento) a uma entrega. A entrega **deve** estar
 *       com status **shipped** (enviada). Requer autenticação e permissão de usuário com role **sale** (vendedor).
 *
 *       **Autenticação:** Bearer token obrigatório.
 *       **Autorização:** Apenas usuários com role "sale".
 *     tags: [Delivery Logs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDeliveryLogRequest'
 *           examples:
 *             log:
 *               summary: Adicionar log de rastreamento
 *               value:
 *                 delivery_id: "123e4567-e89b-12d3-a456-426614174000"
 *                 description: "Pacote saiu para entrega"
 *     responses:
 *       201:
 *         description: Log criado com sucesso (corpo vazio).
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
 *                 - field: "delivery_id"
 *                   message: "Invalid uuid"
 *                   code: "invalid_string"
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
 *       404:
 *         description: Entrega não encontrada com o id informado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: "delivery with the provided identifier not founded"
 *       422:
 *         description: Entrega não está em status "shipped". Só é possível adicionar logs quando a entrega está enviada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *             example:
 *               message: "invalid delivery status, the order must be marked as shipped before logging the shipping details."
 */
deliveryLogsRoutes.post('/', deliveryLogsController.create)

export { deliveryLogsRoutes }
