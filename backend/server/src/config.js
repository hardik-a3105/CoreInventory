/**
 * Application Configuration
 * Central place for all configuration constants
 */

const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Email
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || 'noreply@coreinventory.com',
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
  },

  // Pagination
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },

  // Stock management
  stock: {
    defaultMinStock: 10,
    lowStockThreshold: 10,
  },

  // OTP
  otp: {
    length: 6,
    expiresInMinutes: 10,
  },

  // Password hashing
  bcrypt: {
    rounds: 10,
  },
}

export default config
