import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import { errorHandler } from './middlewares/error-handler'
import { routes } from './routes'
import dotenv from 'dotenv'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './configs/swagger'

dotenv.config()

const app = express()

app.use(cors())

app.use(helmet())

app.use(express.json())

// Documentação Swagger (sem cache para tunnel/local sempre ver a spec atual)
app.use(
  '/',
  (_req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    res.set('Pragma', 'no-cache')
    res.set('Expires', '0')
    next()
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
)

app.use(routes)

app.use(errorHandler)

export { app }