/**
 * Project Structure Documentation
 * 
 * This document provides a detailed overview of the CoreInventory project structure,
 * development patterns, and best practices.
 */

# CoreInventory Project Structure

## Directory Organization

```
server/
├── app.js                          # Express app setup (middleware, routes)
├── server.js                       # Server entry point (startup, graceful shutdown)
├── package.json                    # Dependencies and npm scripts
├── .env.example                    # Environment variables template
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc.json                # Prettier code formatting config
├── .gitignore                      # Git ignore rules
├── README.md                       # Project documentation
├── openapi.yaml                    # API specification (Swagger/OpenAPI)
│
├── prisma/
│   └── schema.prisma              # Database schema definition
│
├── generated/
│   └── prisma/                    # Auto-generated Prisma client types
│
└── src/
    ├── config.js                   # Central configuration file
    │
    ├── controllers/                # Business logic layer (8 files)
    │   ├── auth.controller.js          # Authentication & user management
    │   ├── product.controller.js       # Product CRUD & categories
    │   ├── receipt.controller.js       # Inbound stock operations
    │   ├── delivery.controller.js      # Outbound stock operations
    │   ├── transfer.controller.js      # Inter-warehouse transfers
    │   ├── adjustment.controller.js    # Manual stock adjustments
    │   ├── warehouse.controller.js     # Warehouse & location management
    │   └── dashboard.controller.js     # Analytics & KPIs
    │
    ├── routes/                    # API endpoint definitions (8 files)
    │   ├── auth.routes.js
    │   ├── product.routes.js
    │   ├── receipt.routes.js
    │   ├── delivery.routes.js
    │   ├── transfer.routes.js
    │   ├── adjustment.routes.js
    │   ├── warehouse.routes.js
    │   └── dashboard.routes.js
    │
    ├── middleware/                # Express middleware (4 files)
    │   ├── authMiddleware.js       # JWT token verification & role checking
    │   ├── errorHandler.js         # Global error handling (Prisma mapping)
    │   ├── validateRequest.js      # Express-validator integration
    │   └── validate.middleware.js  # Joi schema validation middleware
    │
    ├── services/                  # Business logic & utilities (2 files)
    │   ├── otp.service.js          # OTP generation, verification & email
    │   └── stockLedger.service.js  # Stock tracking & location management
    │
    ├── utils/                     # Utility functions (6 files)
    │   ├── apiResponse.js          # Standard response formatters
    │   ├── generateOtp.js          # OTP generation logic
    │   ├── generateToken.js        # JWT token generation
    │   ├── mailer.js               # Email service (Nodemailer)
    │   └── prisma.js               # Prisma client singleton
    │
    └── validation/                # Input validation (1 file)
        └── schemas.js              # Joi validation schemas (centralized)
```

## File Purposes & Responsibilities

### Controllers (`src/controllers/`)
**Pattern**: Each controller contains async handler functions for a feature domain.

```javascript
// Template pattern:
export const functionName = async (req, res, next) => {
  try {
    // logic here
    const data = await prisma.model.method()
    return success(res, data, 'Message', 201)
  } catch (err) { 
    next(err) // Error handling middleware picks this up
  }
}
```

**Key Controllers**:
- **auth.controller.js**: Signup, login, password reset (OTP flow), profile retrieval
- **product.controller.js**: CRUD for products/categories
- **receipt.controller.js**: Inbound stock (supplier → warehouse)
- **delivery.controller.js**: Outbound stock (warehouse → customer)
- **transfer.controller.js**: Stock movement between locations
- **adjustment.controller.js**: Manual quantity corrections
- **warehouse.controller.js**: Location/warehouse hierarchy management
- **dashboard.controller.js**: KPI aggregation, stock movement history

### Routes (`src/routes/`)
**Pattern**: One router file per feature with protected/role-enforced endpoints.

```javascript
import { Router } from 'express'
import { protect, isManager } from '../middleware/authMiddleware.js'
import { validateSchema } from '../middleware/validate.middleware.js'
import { productValidation } from '../validation/schemas.js'

const router = Router()
router.use(protect) // All routes below require auth

router.get('/', getProducts)
router.post('/', validateSchema(productValidation.createProduct), createProduct)
router.put('/:id', isManager, validateSchema(productValidation.updateProduct), updateProduct)

export default router
```

### Middleware (`src/middleware/`)
- **authMiddleware.js**: JWT token extraction & verification, role-based access control
- **errorHandler.js**: Centralized error handling with Prisma-specific mappings
- **validate.middleware.js**: Joi schema validation for request body/params/query

### Services (`src/services/`)
- **otp.service.js**: 
  - Generates 6-digit OTP codes
  - Validates OTP + expiry
  - Marks old OTPs as used
  - Sends OTP via email
  
- **stockLedger.service.js**:
  - Creates audit trail entries
  - Updates product totalStock
  - Location-based stock tracking
  - Low stock product queries

### Utils (`src/utils/`)
- **apiResponse.js**: Two functions for consistent JSON responses
  ```javascript
  success(res, data, message, status)
  error(res, message, status)
  ```

- **generateToken.js**: JWT signing with expiry
- **generateOtp.js**: 6-digit code gen, 10-min expiry calculation
- **mailer.js**: Nodemailer transporter + OTP email template
- **prisma.js**: Singleton PrismaClient instance

### Validation (`src/validation/`)
- **schemas.js**: Centralized Joi validation schemas for all features
  - Auth: signup, login, password reset
  - Products: CRUD operations
  - Operations: receipts, deliveries, transfers, adjustments
  - Warehouses: creation, location management

## Request Flow Example

### Creating a Receipt:
```
POST /api/receipts
  ↓
  app.js routes mounting → /receipts route
  ↓
  receipt.routes.js (protect middleware checks JWT)
  ↓
  validate.middleware.js (Joi schema validation)
  ↓
  receipt.controller.js::createReceipt()
    ├─ Validates input
    ├─ Checks product existence
    ├─ Creates Receipt with lines
    └─ Returns success response
  ↓
  Response to client
```

### Error Handling Flow:
```
Any throw/error in controller
  ↓
  Caught by try/catch → next(err)
  ↓
  errorHandler.js middleware
    ├─ Checks for Prisma-specific errors (P2002, P2025)
    ├─ Maps to appropriate HTTP status
    └─ Returns formatted error response
  ↓
  Client receives error JSON
```

## Stock Management Flow

### Receipt Workflow:
1. **Create** (`POST /receipts`) - Creates receipt in DRAFT status
2. **Update Status** (`PUT /receipts/:id`) - Changes to WAITING, READY
3. **Validate** (`POST /receipts/:id/validate`) - Increases product.totalStock, logs in ledger
4. **Cancel** (`PUT /receipts/:id/cancel`) - Only if not DONE

### Delivery Workflow:
1. **Create** (`POST /deliveries`) - Stock availability checked immediately
2. **Validate** (`POST /deliveries/:id/validate`) - Decreases product.totalStock, logs in ledger

### Transfer Workflow:
- Net totalStock change = 0
- Both TRANSFER_OUT and TRANSFER_IN logged for audit trail

### Adjustment Workflow:
- Direct stock quantity change
- Manual correction reason captured

## Database Relationships

Key Prisma relations:
```
User 1 → M OTP (for password reset)
Product 1 → M StockLedger (audit trail)
Product 1 → M StockLevel (per location)
Product M → 1 Category
Warehouse 1 → M Location
Location 1 → M StockLevel
Receipt 1 → M ReceiptLine → M Product
Delivery 1 → M DeliveryLine → M Product
Transfer 1 → M TransferLine → M Product
Adjustment 1 → M Product
```

## Security Patterns

1. **Authentication**: JWT tokens in Authorization headers
2. **Role-Based Access**: `protect` → check `req.user.role`
3. **Input Validation**: Joi schemas prevent injection, type errors
4. **Error Messages**: Avoid exposing internal details in responses
5. **Password Hashing**: bcryptjs with 10 rounds
6. **Transactions**: Prisma $transaction() for data consistency

## Development Conventions

### Naming
- Controllers: `{feature}.controller.js` - exports named functions
- Routes: `{feature}.routes.js` - exports default router
- Middleware: `{purpose}.middleware.js`
- Services: `{domain}.service.js`

### Async/Await Pattern
```javascript
// All controllers are async
export const handler = async (req, res, next) => {
  try {
    // await operations
  } catch (err) {
    next(err) // Delegated to errorHandler
  }
}
```

### Response Format
```javascript
// Success
success(res, data, message, status)
// Error
error(res, message, status)
```

### Error Propagation
- Controllers wrap in try/catch
- Catch errors delegated to errorHandler middleware
- Middleware returns formatted JSON error

## Running Locally

```bash
# Setup
npm install
cp .env.example .env

# Environment initialization
npx prisma migrate dev
npx prisma generate

# Development
npm run dev  # With nodemon auto-reload

# Production
npm run build
npm start
```

## API Documentation

Full OpenAPI/Swagger specification in `openapi.yaml`
Can be imported into Swagger UI, Postman, or tools like swagger-editor.com

## Performance Considerations

1. Dashboard uses `Promise.all()` for parallel queries
2. Ledger endpoint paginates (20 items/page default)
3. Database indexes recommended on: productId, warehouseId, createdAt
4. Transactions ensure consistency in multi-step operations

## Future Extensibility

The structure supports:
- New features by adding feature/{controller, routes, validation schemas}
- New middleware can be added to auth.middleware.js
- New services for new domains (e.g., reports.service.js)
- Additional utils for shared utilities
