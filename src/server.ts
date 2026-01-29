import { app } from './app'
import { env } from './utils/env'

const PORT = env.PORT

// app.listen(PORT, () => console.log(`server running on ${PORT} port`))
app.listen(PORT, '0.0.0.0', () => console.log(`server running on ${PORT} port`))
