import prisma from '../utils/prisma.js'
import { success, error } from '../utils/apiResponse.js'

// GET /api/adjustments
export const getAdjustments = async (req, res, next) => {
  try {
    const adjustments = await prisma.adjustment.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    })
    return success(res, adjustments)
  } catch (err) { next(err) }
}

// GET /api/adjustments/:id
export const getAdjustment = async (req, res, next) => {
  try {
    const adjustment = await prisma.adjustment.findUnique({
      where: { id: req.params.id },
      include: { product: true },
    })
    if (!adjustment) return error(res, 'Adjustment not found.', 404)
    return success(res, adjustment)
  } catch (err) { next(err) }
}

// POST /api/adjustments
// Body: { productId, newQty, locationId?, reason }
export const createAdjustment = async (req, res, next) => {
  try {
    const { productId, newQty, locationId, reason } = req.body

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) return error(res, 'Product not found.', 404)

    const oldQty = product.totalStock
    const delta = newQty - oldQty

    const adjustment = await prisma.$transaction(async (tx) => {
      const adj = await tx.adjustment.create({
        data: { productId, locationId, oldQty, newQty, delta, reason },
      })

      await tx.stockLedger.create({
        data: {
          productId,
          type: 'ADJUSTMENT',
          quantity: delta,
          reference: adj.reference,
          description: reason || 'Manual stock adjustment',
        },
      })

      await tx.product.update({
        where: { id: productId },
        data: { totalStock: newQty },
      })

      return adj
    })

    return success(res, adjustment, `Stock adjusted. ${delta >= 0 ? '+' : ''}${delta} units.`, 201)
  } catch (err) { next(err) }
}
