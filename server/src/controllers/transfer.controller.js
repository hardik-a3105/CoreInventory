import Transfer from '../models/Transfer.js'
import StockLedger from '../models/StockLedger.js'
import { success, error } from '../utils/apiResponse.js'

// GET /api/transfers
export const getTransfers = async (req, res, next) => {
  try {
    const { status } = req.query
    const filter = status ? { status } : {}
    const transfers = await Transfer.find(filter).populate('productId').populate('fromWarehouseId').sort({ createdAt: -1 })
    return success(res, transfers)
  } catch (err) { next(err) }
}

// GET /api/transfers/:id
export const getTransfer = async (req, res, next) => {
  try {
    const transfer = await Transfer.findById(req.params.id).populate('productId').populate('fromWarehouseId')
    if (!transfer) return error(res, 'Transfer not found.', 404)
    return success(res, transfer)
  } catch (err) { next(err) }
}

// POST /api/transfers
export const createTransfer = async (req, res, next) => {
  try {
    const { transferNumber, productId, fromWarehouseId, toWarehouseId, quantity } = req.body

    const transfer = await Transfer.create({
      transferNumber,
      productId,
      fromWarehouseId,
      toWarehouseId,
      quantity,
      status: 'DRAFT',
    })

    await transfer.populate('productId').populate('fromWarehouseId')
    return success(res, transfer, 'Transfer created', 201)
  } catch (err) { next(err) }
}

// POST /api/transfers/:id/validate
export const validateTransfer = async (req, res, next) => {
  try {
    const transfer = await Transfer.findById(req.params.id)
    if (!transfer) return error(res, 'Transfer not found.', 404)
    if (transfer.status === 'COMPLETED') return error(res, 'Transfer already validated.', 400)
    if (transfer.status === 'CANCELLED') return error(res, 'Cannot validate a canceled transfer.', 400)

    // Create stock ledger entry for transfer
    await StockLedger.create({
      productId: transfer.productId,
      type: 'transfer',
      quantity: transfer.quantity,
      reference: transfer.transferNumber,
      notes: `Transfer: Warehouse ${transfer.fromWarehouseId} → ${transfer.toWarehouseId}`,
    })

    // Update transfer status
    transfer.status = 'COMPLETED'
    await transfer.save()

    return success(res, null, 'Transfer validated.')
  } catch (err) { next(err) }
}

// PUT /api/transfers/:id/cancel
export const cancelTransfer = async (req, res, next) => {
  try {
    const transfer = await Transfer.findById(req.params.id)
    if (!transfer) return error(res, 'Transfer not found.', 404)
    if (transfer.status === 'COMPLETED') return error(res, 'Cannot cancel a validated transfer.', 400)

    transfer.status = 'CANCELLED'
    await transfer.save()
    return success(res, null, 'Transfer canceled')
  } catch (err) { next(err) }
}
