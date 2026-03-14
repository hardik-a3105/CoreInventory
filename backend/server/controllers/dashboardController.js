import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get dashboard KPIs
export const getKPIs = async (req, res) => {
  try {
    // Get total products in stock
    const totalProductsResult = await prisma.stockLevel.aggregate({
      _sum: { quantity: true }
    });
    const totalProducts = totalProductsResult._sum.quantity || 0;

    // Get low stock count (products below min stock)
    const lowStockProducts = await prisma.product.findMany({
      include: {
        stockLevels: true
      }
    });

    let lowStockCount = 0;
    let outOfStockCount = 0;

    lowStockProducts.forEach(product => {
      const totalStock = product.stockLevels.reduce((sum, level) => sum + level.quantity, 0);
      if (totalStock === 0) {
        outOfStockCount++;
      } else if (totalStock <= product.minStock) {
        lowStockCount++;
      }
    });

    // Get pending receipts (operations with status PENDING and type RECEIPT)
    const pendingReceipts = await prisma.operation.count({
      where: {
        type: 'RECEIPT',
        status: 'PENDING'
      }
    });

    // Get pending deliveries
    const pendingDeliveries = await prisma.operation.count({
      where: {
        type: 'DELIVERY',
        status: 'PENDING'
      }
    });

    // Get transfers today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const transfersToday = await prisma.operation.count({
      where: {
        type: 'TRANSFER',
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    res.json({
      totalProducts,
      lowStock: lowStockCount + outOfStockCount,
      pendingReceipts,
      pendingDeliveries,
      transfersToday
    });
  } catch (error) {
    console.error('Get KPIs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get recent operations
export const getRecentOperations = async (req, res) => {
  try {
    const operations = await prisma.operation.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { name: true, sku: true, unit: true } },
        warehouse: { select: { name: true } },
        destinationWarehouse: { select: { name: true } },
        user: { select: { name: true } }
      }
    });

    // Format operations for frontend
    const formattedOperations = operations.map(op => ({
      id: op.id,
      type: op.type,
      name: op.product.name,
      from: op.reference || 'System',
      qty: formatQuantity(op.quantity, op.product.unit, op.type),
      location: op.warehouse?.name || 'N/A',
      destination: op.destinationWarehouse?.name || 'N/A',
      status: op.status,
      time: formatTime(op.createdAt)
    }));

    res.json(formattedOperations);
  } catch (error) {
    console.error('Get recent operations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get stock health data
export const getStockHealth = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        stockLevels: true
      }
    });

    let healthy = 0;
    let runningLow = 0;
    let critical = 0;
    let outOfStock = 0;

    products.forEach(product => {
      const totalStock = product.stockLevels.reduce((sum, level) => sum + level.quantity, 0);

      if (totalStock === 0) {
        outOfStock++;
      } else if (totalStock <= product.minStock) {
        if (totalStock <= Math.max(1, product.minStock * 0.5)) {
          critical++;
        } else {
          runningLow++;
        }
      } else {
        healthy++;
      }
    });

    const total = healthy + runningLow + critical + outOfStock;
    const healthyPct = total > 0 ? Math.round((healthy / total) * 100) : 0;
    const lowPct = total > 0 ? Math.round((runningLow / total) * 100) : 0;
    const criticalPct = total > 0 ? Math.round((critical / total) * 100) : 0;
    const outOfStockPct = total > 0 ? Math.round((outOfStock / total) * 100) : 0;

    res.json([
      { label: 'Healthy', count: healthy, pct: healthyPct, color: '#16A34A' },
      { label: 'Running Low', count: runningLow, pct: lowPct, color: '#D97706' },
      { label: 'Critical', count: critical, pct: criticalPct, color: '#DC2626' },
      { label: 'Out of Stock', count: outOfStock, pct: outOfStockPct, color: '#6D28D9' }
    ]);
  } catch (error) {
    console.error('Get stock health error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get warehouse capacity
export const getWarehouseCapacity = async (req, res) => {
  try {
    const warehouses = await prisma.warehouse.findMany({
      include: {
        stockLevels: {
          include: {
            product: true
          }
        },
        _count: {
          select: { stockLevels: true }
        }
      }
    });

    const warehouseData = warehouses.map(warehouse => {
      const totalItems = warehouse.stockLevels.reduce((sum, level) => sum + level.quantity, 0);
      // Mock capacity calculation - in real app, this would be stored in DB
      const capacity = warehouse.capacity || 1000;
      const pct = Math.min(100, Math.round((totalItems / capacity) * 100));

      let status = 'Good — plenty of space';
      let color = '#2563EB';

      if (pct >= 90) {
        status = 'Almost full — plan ahead';
        color = '#D97706';
      } else if (pct >= 70) {
        status = 'Moderate — space available';
        color = '#D97706';
      } else if (pct <= 30) {
        status = 'Mostly empty';
        color = '#6D28D9';
      }

      return {
        id: warehouse.id,
        name: warehouse.name,
        pct,
        color,
        status
      };
    });

    res.json(warehouseData);
  } catch (error) {
    console.error('Get warehouse capacity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper functions
function formatQuantity(quantity, unit, type) {
  if (type === 'ADJUSTMENT') {
    const sign = quantity >= 0 ? '+' : '−';
    return `${sign}${Math.abs(quantity)} ${unit}`;
  }
  const sign = type === 'RECEIPT' ? '+' : '−';
  return `${sign}${Math.abs(quantity)} ${unit}`;
}

function formatTime(date) {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else {
    return `${days}d ago`;
  }
}