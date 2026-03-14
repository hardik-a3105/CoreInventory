import app from './app.js'

// Lazy load Prisma to avoid initialization issues
let prisma = null

const initPrisma = async () => {
  if (!prisma) {
    const { default: prismaClient } = await import('./src/utils/prisma.js')
    prisma = prismaClient
  }
  return prisma
}

const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   CoreInventory API Server              ║
║   Environment: ${NODE_ENV.padEnd(24)}║
║   Port: ${PORT.toString().padEnd(28)}║
║   Running at: http://localhost:${PORT}  ${' '.repeat(Math.max(0, 13 - PORT.toString().length))}║
╚════════════════════════════════════════╝
  `)
  
  // Initialize Prisma in background
  initPrisma().then(() => {
    console.log('✅ Database connected')
  }).catch(err => {
    console.error('⚠️  Database connection issue:', err.message)
    console.log('ℹ️  API server is still running without database')
  })
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down gracefully...')
  server.close(async () => {
    if (prisma) {
      await prisma.$disconnect()
    }
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
