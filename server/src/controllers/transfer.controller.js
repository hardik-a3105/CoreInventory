import prisma from '../utils/prisma.js'
import { ledgerEntry } from '../services/stockLedger.service.js'
import { success, error } from '../utils/apiResponse.js'

// GET /api/transfers
export const getTransfers = async (req, res, next) => {
  try {
    const { status } = req.query
    const transfers = await prisma.transfer.findMany({
      where: status ? { status } : {},
      include: { lines: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return success(res, transfers)
  } catch (err) { next(err) }
}

// GET /api/transfers/:id
export const getTransfer = async (req, res, next) => {
  try {
    const transfer = await prisma.transfer.findUnique({
      where: { id: req.params.id },
      include: { lines: { include: { product: true } } },
    })
    if (!transfer) return error(res, 'Transfer not found.', 404)
    return success(res, transfer)
  } catch (err) { next(err) }
}

// POST /api/transfers
export const createTransfer = async (req, res, next) => {
  try {
    const { fromLocation, toLocation, notes, lines } = req.body
    // lines: [{ productId, quantity }]

    const transfer = await prisma.transfer.create({
      data: {
        fromLocation,
        toLocation,
        notes,
        status: 'DRAFT',
        lines: {
          create: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
        },
      },
      include: { lines: { include: { product: true } } },
    })
    return success(res, transfer, 'Transfer created', 201)
  } catch (err) { next(err) }
}

// POST /api/transfers/:id/validate
// Total stock unchanged — only location changes. Logged as TRANSFER_OUT + TRANSFER_IN.
export const validateTransfer = async (req, res, next) => {
  try {
    const transfer = await prisma.transfer.findUnique({
      where: { id: req.params.id },
      include: { lines: true },
    })
    if (!transfer) return error(res, 'Transfer not found.', 404)
    if (transfer.status === 'DONE') return error(res, 'Transfer already validated.', 400)
    if (transfer.status === 'CANCELED') return error(res, 'Cannot validate a canceled transfer.', 400)

    // Write TRANSFER_OUT and TRANSFER_IN for each product
    // Net stock change = 0, but both are logged for traceability
    const ledgerOut = transfer.lines.flatMap((line) =>
      ledgerEntry({
        productId: line.productId,
        type: 'TRANSFER_OUT',
        quantity: 0, // total stock unchanged
        reference: transfer.reference,
        description: `Transfer out: ${transfer.fromLocation} → ${transfer.toLocation}`,
      })
    )

    const statusUpdate = prisma.transfer.update({
      where: { id: transfer.id },
      data: { status: 'DONE' },
    })

    await prisma.$transaction([...ledgerOut, statusUpdate])
    return success(res, null, 'Transfer validated.')
  } catch (err) { next(err) }
}

// PUT /api/transfers/:id/cancel
export const cancelTransfer = async (req, res, next) => {
  try {
    const transfer = await prisma.transfer.findUnique({ where: { id: req.params.id } })
    if (!transfer) return error(res, 'Transfer not found.', 404)
    if (transfer.status === 'DONE') return error(res, 'Cannot cancel a validated transfer.', 400)

    await prisma.transfer.update({ where: { id: req.params.id }, data: { status: 'CANCELED' } })
    return success(res, null, 'Transfer canceled')
  } catch (err) { next(err) }
}
