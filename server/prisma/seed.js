import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@coreinventory.com' },
    update: {},
    create: {
      email: 'admin@coreinventory.com',
      password: adminPassword,
      name: 'System Administrator',
      role: 'ADMIN'
    }
  });

  // Create manager user
  const managerPassword = await bcrypt.hash('manager123', 12);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@coreinventory.com' },
    update: {},
    create: {
      email: 'manager@coreinventory.com',
      password: managerPassword,
      name: 'Warehouse Manager',
      role: 'MANAGER'
    }
  });

  // Create staff user
  const staffPassword = await bcrypt.hash('staff123', 12);
  const staff = await prisma.user.upsert({
    where: { email: 'staff@coreinventory.com' },
    update: {},
    create: {
      email: 'staff@coreinventory.com',
      password: staffPassword,
      name: 'Warehouse Staff',
      role: 'STAFF'
    }
  });

  console.log('👥 Created users');

  // Create warehouses
  const mainWarehouse = await prisma.warehouse.upsert({
    where: { id: 'main-wh' },
    update: {},
    create: {
      id: 'main-wh',
      name: 'Main Warehouse',
      location: 'Building A, Floor 1',
      capacity: 5000
    }
  });

  const productionWarehouse = await prisma.warehouse.upsert({
    where: { id: 'prod-wh' },
    update: {},
    create: {
      id: 'prod-wh',
      name: 'Production Floor',
      location: 'Building B, Production Area',
      capacity: 2000
    }
  });

  const coldStorage = await prisma.warehouse.upsert({
    where: { id: 'cold-wh' },
    update: {},
    create: {
      id: 'cold-wh',
      name: 'Cold Storage',
      location: 'Building C, Temperature Controlled',
      capacity: 1000
    }
  });

  console.log('🏭 Created warehouses');

  // Create products
  const products = [
    {
      name: 'Steel Rods 12mm',
      sku: 'STL-012-001',
      description: 'High-quality steel rods for construction',
      category: 'Metals',
      unit: 'kg',
      minStock: 50
    },
    {
      name: 'Aluminum Sheets',
      sku: 'ALU-001-001',
      description: 'Aluminum sheets for manufacturing',
      category: 'Metals',
      unit: 'kg',
      minStock: 100
    },
    {
      name: 'Copper Wire 2.5mm',
      sku: 'COP-0025-001',
      description: 'Electrical copper wire',
      category: 'Electrical',
      unit: 'm',
      minStock: 500
    },
    {
      name: 'PVC Pipe 20mm',
      sku: 'PVC-020-001',
      description: 'PVC pipes for plumbing',
      category: 'Plumbing',
      unit: 'pcs',
      minStock: 200
    },
    {
      name: 'M8 Bolts',
      sku: 'BLT-M08-001',
      description: 'M8 steel bolts set',
      category: 'Fasteners',
      unit: 'pcs',
      minStock: 1000
    }
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: productData
    });
  }

  console.log('📦 Created products');

  // Create stock levels
  const stockLevels = [
    { productSku: 'STL-012-001', warehouseId: 'main-wh', quantity: 320, location: 'Rack A3' },
    { productSku: 'ALU-001-001', warehouseId: 'main-wh', quantity: 180, location: 'Rack B1' },
    { productSku: 'COP-0025-001', warehouseId: 'main-wh', quantity: 215, location: 'Rack C4' },
    { productSku: 'PVC-020-001', warehouseId: 'main-wh', quantity: 150, location: 'Rack E1' },
    { productSku: 'BLT-M08-001', warehouseId: 'main-wh', quantity: 850, location: 'Rack F3' },
    { productSku: 'STL-012-001', warehouseId: 'prod-wh', quantity: 120, location: 'Prod Rack 1' },
    { productSku: 'PVC-020-001', warehouseId: 'prod-wh', quantity: 80, location: 'Prod Rack 2' }
  ];

  for (const stockData of stockLevels) {
    const product = await prisma.product.findUnique({
      where: { sku: stockData.productSku }
    });

    if (product) {
      await prisma.stockLevel.upsert({
        where: {
          productId_warehouseId: {
            productId: product.id,
            warehouseId: stockData.warehouseId
          }
        },
        update: {},
        create: {
          productId: product.id,
          warehouseId: stockData.warehouseId,
          quantity: stockData.quantity,
          location: stockData.location
        }
      });
    }
  }

  console.log('📊 Created stock levels');

  // Create some sample operations
  const steelRods = await prisma.product.findUnique({ where: { sku: 'STL-012-001' } });
  const aluminumSheets = await prisma.product.findUnique({ where: { sku: 'ALU-001-001' } });
  const copperWire = await prisma.product.findUnique({ where: { sku: 'COP-0025-001' } });
  const pvcPipe = await prisma.product.findUnique({ where: { sku: 'PVC-020-001' } });
  const bolts = await prisma.product.findUnique({ where: { sku: 'BLT-M08-001' } });

  const operations = [
    {
      type: 'RECEIPT',
      productId: steelRods.id,
      warehouseId: 'main-wh',
      userId: admin.id,
      quantity: 50,
      unit: 'kg',
      reference: 'PO-2026-001',
      status: 'COMPLETED'
    },
    {
      type: 'RECEIPT',
      productId: aluminumSheets.id,
      warehouseId: 'main-wh',
      userId: admin.id,
      quantity: 120,
      unit: 'kg',
      reference: 'PO-2026-002',
      status: 'COMPLETED'
    },
    {
      type: 'DELIVERY',
      productId: bolts.id,
      warehouseId: 'main-wh',
      userId: manager.id,
      quantity: 200,
      unit: 'pcs',
      reference: 'SO-2026-001',
      status: 'PENDING'
    },
    {
      type: 'TRANSFER',
      productId: steelRods.id,
      warehouseId: 'prod-wh',
      userId: staff.id,
      quantity: 100,
      unit: 'kg',
      reference: 'INT-2026-001',
      status: 'IN_PROGRESS'
    }
  ];

  for (const opData of operations) {
    await prisma.operation.create({
      data: opData
    });
  }

  console.log('📋 Created sample operations');

  console.log('✅ Database seeding completed!');
  console.log('\n🔐 Default login credentials:');
  console.log('Admin: admin@coreinventory.com / admin123');
  console.log('Manager: manager@coreinventory.com / manager123');
  console.log('Staff: staff@coreinventory.com / staff123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });