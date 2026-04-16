import { buildApp } from './app.js'
import { startServer, setupGracefulShutdown } from './server.js'

async function main() {
  const app = await buildApp()
  const ctx = await startServer(app)
  setupGracefulShutdown(ctx)
}

main().catch((err) => {
  console.error('❌ Failed to start server:', err)
  process.exit(1)
})
