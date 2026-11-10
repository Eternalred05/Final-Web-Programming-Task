import 'dotenv/config'
import { app } from './app'
import { closePool } from './config/db'
import { env } from './config/env'

const port = env.port

const server = app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})

function shutdown(signal: string): void {
  console.log(`${signal} recibido, cerrando servidor...`)

  server.close(() => {
    void closePool().finally(() => process.exit(0))
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
