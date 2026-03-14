import Adjustment from '../models/Adjustment.js'
import StockLedger from '../models/StockLedger.js'
import Product from '../models/Product.js'
import { success, error } from '../utils/apiResponse.js'

// GET /api/adjustments
export const getAdjustments = async (req, res, next) => {
  try {
    const adjustments = await Adjustment.find().populate('productId').populate('warehouseId').sort({ createdAt: -1 })
    return success(res, adjustments)
  } catch (err) { next(err) }
}

// GET /api/adjustments/:id
export const getAdjustment = async (req, res, next) => {
  try {
    const adjustment = await Adjustment.findById(req.params.id).populate('productId').populate('warehouseId')
    if (!adjustment) return error(res, 'Adjustment not found.', 404)
    return success(res, adjustment)
  } catch (err) { next(err) }
}

// POST /api/adjustments
// Body: { adjustmentNumber, productId, warehouseId, quantityDifference, reason }
export const createAdjustment = async (req, res, next) => {
  try {
    const { adjustmentNumber, productId, warehouseId, quantityDifference, reason } = req.body

    const adjustment = await Adjustment.create({
      adjustmentNumber,
      productId,
      warehouseId,
      quantityDifference,
      reason,
      status: 'DRAFT',
    })

    // Create stock ledger entry
    await StockLedger.create({
      productId,
      type: 'adjustment',
      quantity: quantityDifference,
      reference: adjustmentNumber,
      notes: reason || 'Manual stock adjustment',
    })

    // Update product stock
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { currentStock: quantityDifference } },
      { new: true }
    )

    await adjustment.populate('productId').populate('warehouseId')
    return success(res, adjustment, `Stock adjusted. ${quantityDifference >= 0 ? '+' : ''}${quantityDifference} units.`, 201)
  } catch (err) { next(err) }
}
