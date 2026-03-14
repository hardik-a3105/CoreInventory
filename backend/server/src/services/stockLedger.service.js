import StockLedger from '../models/StockLedger.js'
import StockLevel from '../models/StockLevel.js'
import Product from '../models/Product.js'

/**
 * Creates a ledger entry for stock movement.
 */
export const createLedgerEntry = async ({ productId, type, quantity, reference, notes }) => {
  return StockLedger.create({
    productId,
    type,
    quantity,
    reference,
    notes,
  })
}

/**
 * Update stock at a specific location (StockLevel table).
 * Creates the row if it doesn't exist yet.
 */
export const updateLocationStock = async (productId, locationId, warehouseId, delta) => {
  try {
    const existing = await StockLevel.findOne({ productId, locationId })
    if (existing) {
      existing.quantity += delta
      await existing.save()
    } else {
      await StockLevel.create({
        productId,
        locationId,
        warehouseId,
        quantity: Math.max(0, delta),
      })
    }
  } catch (error) {
    // Handle duplicate key error for unique index
    if (error.code === 11000) {
      const updated = await StockLevel.findOneAndUpdate(
        { productId, locationId },
        { $inc: { quantity: delta } },
        { new: true }
      )
      return updated
    }
    throw error
  }
}

/**
 * Get current stock of a product across all locations.
 */
export const getProductStock = async (productId) => {
  return StockLevel.find({ productId }).populate('location', 'name type warehouseId')
}

/**
 * Returns products whose currentStock is below their minimumStock.
 */
export const getLowStockProducts = async () => {
  return Product.find({
    $expr: { $lte: ['$currentStock', '$minimumStock'] },
  })
}
