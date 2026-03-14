# CoreInventory Backend API

A comprehensive inventory management system backend built with Node.js, Express, and Prisma.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Product Management** - CRUD operations for inventory items
- **Warehouse Management** - Multi-warehouse support with capacity tracking
- **Operations Tracking** - Receipts, deliveries, transfers, and adjustments
- **Stock Level Monitoring** - Real-time inventory tracking across warehouses
- **Dashboard Analytics** - KPIs, stock health, and warehouse capacity metrics
- **Database ORM** - Prisma with PostgreSQL for type-safe database operations

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Development**: nodemon

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## 🔧 Installation & Setup

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your database connection and other settings:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/coreinventory?schema=public"
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   BCRYPT_ROUNDS=12
   ```

4. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run database migrations
   npm run db:migrate

   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Products
- `GET /api/products` - Get all products (with pagination, search, filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Manager/Admin)
- `PUT /api/products/:id` - Update product (Manager/Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Warehouses
- `GET /api/warehouses` - Get all warehouses
- `GET /api/warehouses/:id` - Get single warehouse
- `POST /api/warehouses` - Create warehouse (Manager/Admin)
- `PUT /api/warehouses/:id` - Update warehouse (Manager/Admin)
- `DELETE /api/warehouses/:id` - Delete warehouse (Admin)

### Operations
- `GET /api/operations` - Get all operations
- `GET /api/operations/:id` - Get single operation
- `POST /api/operations` - Create operation
- `PATCH /api/operations/:id/status` - Update operation status (Manager/Admin)

### Adjustments
- `GET /api/adjustments` - Get all adjustments
- `GET /api/adjustments/:id` - Get single adjustment
- `POST /api/adjustments` - Create adjustment

### Dashboard
- `GET /api/dashboard/kpis` - Get dashboard KPIs
- `GET /api/dashboard/operations` - Get recent operations
- `GET /api/dashboard/stock-health` - Get stock health data
- `GET /api/dashboard/warehouses` - Get warehouse capacity

### Health Check
- `GET /api/health` - API health check

## 🔐 User Roles & Permissions

- **ADMIN**: Full access to all features
- **MANAGER**: Can manage products, warehouses, operations, and view all data
- **STAFF**: Can view data and create operations/adjustments

## 🗄 Database Schema

The database includes the following main entities:

- **Users** - System users with roles
- **Products** - Inventory items with SKUs and categories
- **Warehouses** - Storage locations with capacity
- **StockLevels** - Current stock quantities per product per warehouse
- **Operations** - Receipts, deliveries, transfers, and adjustments
- **Adjustments** - Stock count corrections and write-offs

## 🧪 Testing the API

### Using cURL

```bash
# Register a new user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@coreinventory.com",
    "password": "admin123"
  }'

# Get products (use token from login response)
curl -X GET http://localhost:3001/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Default Test Accounts

After running the seed script, you can use these accounts:

- **Admin**: `admin@coreinventory.com` / `admin123`
- **Manager**: `manager@coreinventory.com` / `manager123`
- **Staff**: `staff@coreinventory.com` / `staff123`

## 📜 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with sample data

## 🔄 Development Workflow

1. Make changes to `prisma/schema.prisma`
2. Run `npm run db:push` to update database schema
3. Update controllers and routes as needed
4. Test API endpoints
5. Commit changes

## 🚀 Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations: `npm run db:migrate`
4. Seed database: `npm run db:seed`
5. Build and start: `npm start`

## 🤝 API Response Format

All API responses follow this format:

```json
{
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... }
}
```

Error responses:
```json
{
  "error": "Error message"
}
```

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions, please create an issue in the repository or contact the development team.