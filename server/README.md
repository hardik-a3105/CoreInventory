# CoreInventory API Documentation

## Project Overview

CoreInventory is a comprehensive inventory management system API built with Node.js, Express, and Prisma ORM. It handles stock management, warehousing, receipts, deliveries, transfers, and analytics for businesses.

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Email**: Nodemailer
- **Security**: bcryptjs for password hashing

## Project Structure

```
server/
├── app.js                          # Express app configuration
├── server.js                       # Server entry point
├── package.json                    # Dependencies and scripts
├── prisma/
│   └── schema.prisma              # Database schema
├── generated/prisma/              # Prisma auto-generated client
├── src/
│   ├── controllers/               # Business logic
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── receipt.controller.js
│   │   ├── delivery.controller.js
│   │   ├── transfer.controller.js
│   │   ├── adjustment.controller.js
│   │   ├── warehouse.controller.js
│   │   └── dashboard.controller.js
│   ├── routes/                    # API endpoint definitions
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── receipt.routes.js
│   │   ├── delivery.routes.js
│   │   ├── transfer.routes.js
│   │   ├── adjustment.routes.js
│   │   ├── warehouse.routes.js
│   │   └── dashboard.routes.js
│   ├── middleware/                # Express middleware
│   │   ├── authMiddleware.js      # JWT verification & role checking
│   │   ├── errorHandler.js        # Error handling
│   │   ├── validateRequest.js     # Request validation
│   │   └── validate.middleware.js # Joi schema validation
│   ├── services/                  # Reusable business logic
│   │   ├── otp.service.js         # OTP generation & verification
│   │   └── stockLedger.service.js # Stock transaction logging
│   ├── utils/                     # Utility functions
│   │   ├── apiResponse.js         # Standard response formatters
│   │   ├── generateOtp.js         # OTP generation
│   │   ├── generateToken.js       # JWT token generation
│   │   ├── mailer.js              # Email sending
│   │   └── prisma.js              # Prisma client
│   └── validation/
│       └── schemas.js             # Joi validation schemas
├── .env.example                   # Environment variables template
└── .gitignore                     # Git ignore rules
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env
# Edit .env with your database and email credentials

# 3. Setup database
npx prisma migrate dev

# 4. Start development server
npm run dev
```

## Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run start        # Start production server
npm run build        # Build project
npm run lint         # Run ESLint
npm test             # Run tests
npx prisma studio   # Open Prisma Studio (database GUI)
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST   /signup` - Create new account
- `POST   /login` - Login with email/password
- `POST   /forgot-password` - Request password reset OTP
- `POST   /verify-otp` - Verify OTP for password reset
- `POST   /reset-password` - Reset password (requires verified token)
- `GET    /me` - Get current user profile (protected)

### Products (`/api/products`)
- `GET    /` - List all products (with filters)
- `POST   /` - Create product
- `GET    /:id` - Get product details
- `PUT    /:id` - Update product
- `DELETE /:id` - Delete product
- `GET    /categories` - List all categories
- `POST   /categories` - Create category

### Receipts (`/api/receipts`) - Inbound Stock
- `GET    /` - List receipts
- `POST   /` - Create receipt
- `GET    /:id` - Get receipt details
- `PUT    /:id/status` - Update receipt status
- `POST   /:id/validate` - Validate receipt (updates stock)
- `PUT    /:id/cancel` - Cancel receipt

### Deliveries (`/api/deliveries`) - Outbound Stock
- `GET    /` - List deliveries
- `POST   /` - Create delivery order
- `GET    /:id` - Get delivery details
- `PUT    /:id/status` - Update delivery status
- `POST   /:id/validate` - Validate delivery (updates stock)
- `PUT    /:id/cancel` - Cancel delivery

### Transfers (`/api/transfers`) - Inter-warehouse
- `GET    /` - List transfers
- `POST   /` - Create transfer
- `GET    /:id` - Get transfer details
- `POST   /:id/validate` - Validate transfer
- `PUT    /:id/cancel` - Cancel transfer

### Adjustments (`/api/adjustments`) - Manual Stock Adjustments
- `GET    /` - List adjustments
- `POST   /` - Create adjustment
- `GET    /:id` - Get adjustment details

### Warehouses (`/api/warehouses`) - Protected (Managers Only)
- `GET    /` - List warehouses
- `POST   /` - Create warehouse
- `GET    /:id` - Get warehouse details
- `PUT    /:id` - Update warehouse
- `DELETE /:id` - Delete warehouse
- `POST   /:id/locations` - Add location to warehouse
- `DELETE /:id/locations/:locationId` - Delete location

### Dashboard (`/api/dashboard`)
- `GET    /` - Get dashboard KPIs & recent activity
- `GET    /move-history` - Get stock movement history with filters

## Authentication

All endpoints (except signup/login) require JWT authentication via `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles
- `STAFF` - Regular employee (default)
- `MANAGER` - Can manage warehouses and locations  
- `ADMIN` - Full system access

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

## Stock Management Flow

1. **Receipt** (Inbound): Supplier → Warehouse
   - Create receipt with product lines
   - Validate receipt to increase totalStock

2. **Delivery** (Outbound): Warehouse → Customer
   - Create delivery order
   - Stock is checked for availability
   - Validate delivery to decrease totalStock

3. **Transfer**: Warehouse A → Warehouse B
   - Stock remains same, only location changes
   - Both TRANSFER_OUT and TRANSFER_IN logged

4. **Adjustment**: Manual stock correction
   - Direct stock quantity update
   - Captured in stock ledger for audit

## Error Handling

The API uses comprehensive error handling:

- **400 Bad Request** - Validation errors, insufficient stock
- **401 Unauthorized** - Invalid/missing authentication token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **422 Unprocessable Entity** - Validation errors
- **500 Internal Server Error** - Server errors

Prisma-specific errors are automatically mapped:
- `P2002` - Unique constraint violation
- `P2025` - Record not found

## Database Design

Key tables:
- `User` - User accounts with roles
- `Product` - Product master data
- `Category` - Product categories
- `Warehouse` - Warehouse master
- `Location` - Storage locations within warehouses
- `StockLevel` - Current stock at each location
- `StockLedger` - Audit trail of all stock movements
- `Receipt`, `Delivery`, `Transfer`, `Adjustment` - Operations
- `ReceiptLine`, `DeliveryLine`, `TransferLine` - Operation line items
- `OTP` - One-time passwords for password reset

## Development Tips

### Database Migrations
```bash
# Create new migration
npx prisma migrate dev --name migration_name

# View database in GUI
npx prisma studio

# Reset database (development only)
npx prisma migrate reset
```

### Testing an Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

### Common Issues

**"Token is invalid or expired"**
- Check JWT_SECRET matches in .env
- Ensure token hasn't expired (default 7 days)

**"Database connection failed"**
- Verify PostgreSQL is running
- Check DATABASE_URL is correct
- Run `npx prisma db push` to sync schema

**"Port already in use"**
- Change PORT in .env
- Or kill process on current port

## Security Considerations

1. **Passwords**: Hashed with bcryptjs (10 rounds)
2. **JWT**: Signed with strong secret (change in production)
3. **CORS**: Restricted to configured origins
4. **Input Validation**: All inputs validated with Joi
5. **Error Messages**: Don't expose sensitive info
6. **Rate Limiting**: Consider implementing for production

## Performance Notes

- Stock ledger queries paginated (20 items/page default)
- Dashboard uses Promise.all() for parallel queries
- Transactions ensure data consistency
- Indexes recommended on: productId, warehouseId, createdAt

## Future Enhancements

- [ ] API rate limiting
- [ ] Advanced analytics and reporting
- [ ] Batch operations
- [ ] Stock forecasting
- [ ] Multi-currency support
- [ ] Mobile app integration
- [ ] Real-time notifications via WebSockets
- [ ] Advanced permission model (ACL)

## Support & Contributing

For issues or contributions, please follow the standard git workflow:
1. Create feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/name`
4. Create Pull Request

## License

ISC
