import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Initialize environment variables
dotenv.config()

// Configuration
import config from './src/config.js'

// Controller routes
import authRoutes from './src/routes/auth.routes.js'
import productRoutes from './src/routes/product.routes.js'
import receiptRoutes from './src/routes/receipt.routes.js'
import deliveryRoutes from './src/routes/delivery.routes.js'
import transferRoutes from './src/routes/transfer.routes.js'
import adjustmentRoutes from './src/routes/adjustment.routes.js'
import warehouseRoutes from './src/routes/warehouse.routes.js'
import dashboardRoutes from './src/routes/dashboard.routes.js'

// Middleware
import { errorHandler } from './src/middleware/errorHandler.js'

const app = express()

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors(config.cors))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware
app.use((req, res, next) => {
  const method = req.method.padEnd(6)
  const path = req.path.padEnd(30)
  console.log(`  ${method} ${path} ← ${req.ip}`)
  next()
})

// ============================================
// HEALTH CHECK
// ============================================
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'CoreInventory API Server is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

// ============================================
// API ROUTES
// ============================================
const apiPrefix = '/api'

app.use(`${apiPrefix}/auth`,       authRoutes)
app.use(`${apiPrefix}/products`,   productRoutes)
app.use(`${apiPrefix}/receipts`,   receiptRoutes)
app.use(`${apiPrefix}/deliveries`, deliveryRoutes)
app.use(`${apiPrefix}/transfers`,  transferRoutes)
app.use(`${apiPrefix}/adjustments`, adjustmentRoutes)
app.use(`${apiPrefix}/warehouses`, warehouseRoutes)
app.use(`${apiPrefix}/dashboard`,  dashboardRoutes)

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.path} not found`,
  })
})

// ============================================
// ERROR HANDLER (must be last)
// ============================================
app.use(errorHandler)

export default app
