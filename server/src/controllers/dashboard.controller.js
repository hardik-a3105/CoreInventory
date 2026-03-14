import prisma from '../utils/prisma.js'
import { success } from '../utils/apiResponse.js'

// GET /api/dashboard
export const getDashboard = async (req, res, next) => {
  try {
    const [
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      pendingReceipts,
      pendingDeliveries,
      scheduledTransfers,
      recentLedger,
    ] = await Promise.all([
      // Total distinct products
      prisma.product.count(),

      // Low stock: totalStock > 0 but <= minStock
      prisma.product.count({
        where: { totalStock: { gt: 0 }, AND: [{ totalStock: { lte: 10 } }] },
      }),

      // Out of stock
      prisma.product.count({ where: { totalStock: { lte: 0 } } }),

      // Pending receipts (DRAFT or WAITING or READY)
      prisma.receipt.count({
        where: { status: { in: ['DRAFT', 'WAITING', 'READY'] } },
      }),

      // Pending deliveries
      prisma.delivery.count({
        where: { status: { in: ['DRAFT', 'WAITING', 'READY'] } },
      }),

      // Scheduled transfers
      prisma.transfer.count({
        where: { status: { in: ['DRAFT', 'WAITING', 'READY'] } },
      }),

      // Last 10 stock movements
      prisma.stockLedger.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { product: { select: { name: true, sku: true } } },
      }),
    ])

    // Recent operations (mixed list for dashboard table)
    const [recentReceipts, recentDeliveries, recentTransfers] = await Promise.all([
      prisma.receipt.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { lines: true },
      }),
      prisma.delivery.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { lines: true },
      }),
      prisma.transfer.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { lines: true },
      }),
    ])

    return success(res, {
      kpis: {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        pendingReceipts,
        pendingDeliveries,
        scheduledTransfers,
      },
      recentActivity: recentLedger,
      recentOperations: {
        receipts:  recentReceipts,
        deliveries: recentDeliveries,
        transfers:  recentTransfers,
      },
    })
  } catch (err) { next(err) }
}

// GET /api/dashboard/move-history?productId=&type=&from=&to=
export const getMoveHistory = async (req, res, next) => {
  try {
    const { productId, type, from, to, page = 1, limit = 20 } = req.query

    const where = {}
    if (productId) where.productId = productId
    if (type)      where.type      = type
    if (from || to) {
      where.createdAt = {}
      if (from) where.createdAt.gte = new Date(from)
      if (to)   where.createdAt.lte = new Date(to)
    }

    const skip  = (Number(page) - 1) * Number(limit)
    const total = await prisma.stockLedger.count({ where })

    const ledger = await prisma.stockLedger.findMany({
      where,
      include: { product: { select: { name: true, sku: true, unit: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    })

    return success(res, {
      data: ledger,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    })
  } catch (err) { next(err) }
}
