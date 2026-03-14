import Receipt from '../models/Receipt.js'
import StockLedger from '../models/StockLedger.js'
import Product from '../models/Product.js'
import { success, error } from '../utils/apiResponse.js'

// GET /api/receipts
export const getReceipts = async (req, res, next) => {
  try {
    const { status } = req.query
    const filter = status ? { status } : {}
    const receipts = await Receipt.find(filter).populate('productId').populate('createdBy').sort({ createdAt: -1 })
    return success(res, receipts)
  } catch (err) { next(err) }
}

// GET /api/receipts/:id
export const getReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params.id).populate('productId').populate('createdBy')
    if (!receipt) return error(res, 'Receipt not found.', 404)
    return success(res, receipt)
  } catch (err) { next(err) }
}

// POST /api/receipts
export const createReceipt = async (req, res, next) => {
  try {
    const { receiptNumber, supplierId, supplierName, productId, quantity } = req.body

    const receipt = await Receipt.create({
      receiptNumber,
      supplierId,
      supplierName,
      productId,
      quantity,
      status: 'DRAFT',
      createdBy: req.user.id,
    })

    await receipt.populate('productId').populate('createdBy')
    return success(res, receipt, 'Receipt created', 201)
  } catch (err) { next(err) }
}

// PUT /api/receipts/:id  — update status
export const updateReceiptStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const receipt = await Receipt.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!receipt) return error(res, 'Receipt not found.', 404)
    return success(res, receipt, 'Status updated')
  } catch (err) { next(err) }
}

// POST /api/receipts/:id/validate  — stock increases here
export const validateReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
    if (!receipt) return error(res, 'Receipt not found.', 404)
    if (receipt.status === 'VALIDATED') return error(res, 'Receipt already validated.', 400)
    if (receipt.status === 'REJECTED') return error(res, 'Cannot validate a rejected receipt.', 400)

    // Update product stock
    const product = await Product.findByIdAndUpdate(
      receipt.productId,
      { $inc: { currentStock: receipt.quantity } },
      { new: true }
    )

    // Create stock ledger entry
    await StockLedger.create({
      productId: receipt.productId,
      type: 'receipt',
      quantity: receipt.quantity,
      reference: receipt.receiptNumber,
      notes: `Receipt from ${receipt.supplierName || 'Supplier'}`,
    })

    // Update receipt status
    receipt.status = 'VALIDATED'
    await receipt.save()

    return success(res, null, 'Receipt validated. Stock updated.')
  } catch (err) { next(err) }
}

// DELETE /api/receipts/:id
export const cancelReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
    if (!receipt) return error(res, 'Receipt not found.', 404)
    if (receipt.status === 'VALIDATED') return error(res, 'Cannot cancel a validated receipt.', 400)

    receipt.status = 'REJECTED'
    await receipt.save()
    return success(res, null, 'Receipt canceled')
  } catch (err) { next(err) }
}
