import app from './app.js'
import { connectDB, disconnectDB } from './src/utils/prisma.js'

const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'

// Start server
const server = app.listen(PORT, () => {
  console.clear()
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║            🏭 CoreInventory API Server 🏭             ║
║                                                        ║
║  Environment: ${NODE_ENV.toUpperCase().padEnd(36)}║
║  Port: ${PORT.toString().padEnd(44)}║
║  URL: http://localhost:${PORT}${' '.repeat(Math.max(0, 32 - PORT.toString().length))}║
║  Status: ✅ Running                                   ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `)
  
  // Initialize MongoDB connection
  connectDB().then(() => {
    console.log('✅ MongoDB connected successfully\n')
  }).catch(err => {
    console.log('⚠️  MongoDB connection failed:', err.message)
    console.log('ℹ️  Using mock database for offline development\n')
  })
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down gracefully...')
  server.close(async () => {
    await disconnectDB()
    console.log('✅ Server and database connections closed')
    process.exit(0)
  })
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason)
  process.exit(1)
})

export default server
