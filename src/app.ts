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

// Documentação Swagger
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(routes)

app.use(errorHandler)

export { app }