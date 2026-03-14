import prisma from '../utils/prisma.js'
import { ledgerEntry } from '../services/stockLedger.service.js'
import { success, error } from '../utils/apiResponse.js'

// GET /api/receipts
export const getReceipts = async (req, res, next) => {
  try {
    const { status } = req.query
    const receipts = await prisma.receipt.findMany({
      where: status ? { status } : {},
      include: { lines: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return success(res, receipts)
  } catch (err) { next(err) }
}

// GET /api/receipts/:id
export const getReceipt = async (req, res, next) => {
  try {
    const receipt = await prisma.receipt.findUnique({
      where: { id: req.params.id },
      include: { lines: { include: { product: true } } },
    })
    if (!receipt) return error(res, 'Receipt not found.', 404)
    return success(res, receipt)
  } catch (err) { next(err) }
}

// POST /api/receipts
export const createReceipt = async (req, res, next) => {
  try {
    const { supplier, notes, lines } = req.body
    // lines: [{ productId, quantity }]

    const receipt = await prisma.receipt.create({
      data: {
        supplier,
        notes,
        status: 'DRAFT',
        lines: {
          create: lines.map((l) => ({
            productId: l.productId,
            quantity: l.quantity,
            received: 0,
          })),
        },
      },
      include: { lines: { include: { product: true } } },
    })
    return success(res, receipt, 'Receipt created', 201)
  } catch (err) { next(err) }
}

// PUT /api/receipts/:id  — update status to WAITING or READY
export const updateReceiptStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const receipt = await prisma.receipt.update({
      where: { id: req.params.id },
      data: { status },
    })
    return success(res, receipt, 'Status updated')
  } catch (err) { next(err) }
}

// POST /api/receipts/:id/validate  — stock increases here
export const validateReceipt = async (req, res, next) => {
  try {
    const receipt = await prisma.receipt.findUnique({
      where: { id: req.params.id },
      include: { lines: true },
    })
    if (!receipt) return error(res, 'Receipt not found.', 404)
    if (receipt.status === 'DONE') return error(res, 'Receipt already validated.', 400)
    if (receipt.status === 'CANCELED') return error(res, 'Cannot validate a canceled receipt.', 400)

    const ledgerWrites = receipt.lines.flatMap((line) =>
      ledgerEntry({
        productId: line.productId,
        type: 'RECEIPT',
        quantity: line.quantity,
        reference: receipt.reference,
        description: `Receipt from ${receipt.supplier}`,
      })
    )

    const lineUpdates = receipt.lines.map((line) =>
      prisma.receiptLine.update({
        where: { id: line.id },
        data: { received: line.quantity },
      })
    )

    const statusUpdate = prisma.receipt.update({
      where: { id: receipt.id },
      data: { status: 'DONE' },
    })

    await prisma.$transaction([...ledgerWrites, ...lineUpdates, statusUpdate])

    return success(res, null, 'Receipt validated. Stock updated.')
  } catch (err) { next(err) }
}

// DELETE /api/receipts/:id
export const cancelReceipt = async (req, res, next) => {
  try {
    const receipt = await prisma.receipt.findUnique({ where: { id: req.params.id } })
    if (!receipt) return error(res, 'Receipt not found.', 404)
    if (receipt.status === 'DONE') return error(res, 'Cannot cancel a validated receipt.', 400)

    await prisma.receipt.update({ where: { id: req.params.id }, data: { status: 'CANCELED' } })
    return success(res, null, 'Receipt canceled')
  } catch (err) { next(err) }
}
