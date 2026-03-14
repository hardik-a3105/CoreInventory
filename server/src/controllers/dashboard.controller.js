import Product from '../models/Product.js'
import Receipt from '../models/Receipt.js'
import Delivery from '../models/Delivery.js'
import Transfer from '../models/Transfer.js'
import StockLedger from '../models/StockLedger.js'
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
      Product.countDocuments(),

      // Low stock: currentStock > 0 but <= minimumStock
      Product.countDocuments({
        currentStock: { $gt: 0, $lte: 10 },
      }),

      // Out of stock
      Product.countDocuments({ currentStock: { $lte: 0 } }),

      // Pending receipts (DRAFT or SUBMITTED or IN_TRANSIT)
      Receipt.countDocuments({
        status: { $in: ['DRAFT', 'SUBMITTED', 'IN_TRANSIT'] },
      }),

      // Pending deliveries
      Delivery.countDocuments({
        status: { $in: ['DRAFT', 'PENDING', 'PACKING', 'SHIPPED'] },
      }),

      // Scheduled transfers
      Transfer.countDocuments({
        status: { $in: ['DRAFT', 'PENDING', 'IN_TRANSIT'] },
      }),

      // Last 10 stock movements
      StockLedger.find().populate('productId', 'name sku').sort({ createdAt: -1 }).limit(10),
    ])

    // Recent operations (mixed list for dashboard table)
    const [recentReceipts, recentDeliveries, recentTransfers] = await Promise.all([
      Receipt.find().populate('productId').sort({ createdAt: -1 }).limit(5),
      Delivery.find().populate('productId').sort({ createdAt: -1 }).limit(5),
      Transfer.find().populate('productId').sort({ createdAt: -1 }).limit(5),
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
        receipts: recentReceipts,
        deliveries: recentDeliveries,
        transfers: recentTransfers,
      },
    })
  } catch (err) { next(err) }
}

// GET /api/dashboard/move-history?productId=&type=&from=&to=
export const getMoveHistory = async (req, res, next) => {
  try {
    const { productId, type, from, to, page = 1, limit = 20 } = req.query

    const filter = {}
    if (productId) filter.productId = productId
    if (type) filter.type = type
    if (from || to) {
      filter.createdAt = {}
      if (from) filter.createdAt.$gte = new Date(from)
      if (to) filter.createdAt.$lte = new Date(to)
    }

    const skip = (Number(page) - 1) * Number(limit)
    const total = await StockLedger.countDocuments(filter)

    const ledger = await StockLedger.find(filter)
      .populate('productId', 'name sku unit')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    return success(res, {
      data: ledger,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    })
  } catch (err) { next(err) }
}
