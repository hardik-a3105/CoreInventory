import prisma from '../utils/prisma.js'
import { ledgerEntry } from '../services/stockLedger.service.js'
import { success, error } from '../utils/apiResponse.js'

// GET /api/deliveries
export const getDeliveries = async (req, res, next) => {
  try {
    const { status } = req.query
    const deliveries = await prisma.delivery.findMany({
      where: status ? { status } : {},
      include: { lines: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return success(res, deliveries)
  } catch (err) { next(err) }
}

// GET /api/deliveries/:id
export const getDelivery = async (req, res, next) => {
  try {
    const delivery = await prisma.delivery.findUnique({
      where: { id: req.params.id },
      include: { lines: { include: { product: true } } },
    })
    if (!delivery) return error(res, 'Delivery not found.', 404)
    return success(res, delivery)
  } catch (err) { next(err) }
}

// POST /api/deliveries
export const createDelivery = async (req, res, next) => {
  try {
    const { customer, notes, lines } = req.body
    // lines: [{ productId, quantity }]

    // Check stock availability before creating
    for (const line of lines) {
      const product = await prisma.product.findUnique({ where: { id: line.productId } })
      if (!product) return error(res, `Product not found: ${line.productId}`, 404)
      if (product.totalStock < line.quantity) {
        return error(res, `Insufficient stock for "${product.name}". Available: ${product.totalStock}`, 400)
      }
    }

    const delivery = await prisma.delivery.create({
      data: {
        customer,
        notes,
        status: 'DRAFT',
        lines: {
          create: lines.map((l) => ({
            productId: l.productId,
            quantity: l.quantity,
            delivered: 0,
          })),
        },
      },
      include: { lines: { include: { product: true } } },
    })
    return success(res, delivery, 'Delivery order created', 201)
  } catch (err) { next(err) }
}

// PUT /api/deliveries/:id
export const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const delivery = await prisma.delivery.update({
      where: { id: req.params.id },
      data: { status },
    })
    return success(res, delivery, 'Status updated')
  } catch (err) { next(err) }
}

// POST /api/deliveries/:id/validate  — stock decreases here
export const validateDelivery = async (req, res, next) => {
  try {
    const delivery = await prisma.delivery.findUnique({
      where: { id: req.params.id },
      include: { lines: { include: { product: true } } },
    })
    if (!delivery) return error(res, 'Delivery not found.', 404)
    if (delivery.status === 'DONE') return error(res, 'Delivery already validated.', 400)
    if (delivery.status === 'CANCELED') return error(res, 'Cannot validate a canceled delivery.', 400)

    // Re-check stock at validation time
    for (const line of delivery.lines) {
      if (line.product.totalStock < line.quantity) {
        return error(res, `Insufficient stock for "${line.product.name}". Available: ${line.product.totalStock}`, 400)
      }
    }

    // Quantity is negative because stock leaves warehouse
    const ledgerWrites = delivery.lines.flatMap((line) =>
      ledgerEntry({
        productId: line.productId,
        type: 'DELIVERY',
        quantity: -line.quantity,
        reference: delivery.reference,
        description: `Delivery to ${delivery.customer}`,
      })
    )

    const lineUpdates = delivery.lines.map((line) =>
      prisma.deliveryLine.update({
        where: { id: line.id },
        data: { delivered: line.quantity },
      })
    )

    const statusUpdate = prisma.delivery.update({
      where: { id: delivery.id },
      data: { status: 'DONE' },
    })

    await prisma.$transaction([...ledgerWrites, ...lineUpdates, statusUpdate])

    return success(res, null, 'Delivery validated. Stock updated.')
  } catch (err) { next(err) }
}

// DELETE /api/deliveries/:id  — cancel
export const cancelDelivery = async (req, res, next) => {
  try {
    const delivery = await prisma.delivery.findUnique({ where: { id: req.params.id } })
    if (!delivery) return error(res, 'Delivery not found.', 404)
    if (delivery.status === 'DONE') return error(res, 'Cannot cancel a validated delivery.', 400)

    await prisma.delivery.update({ where: { id: req.params.id }, data: { status: 'CANCELED' } })
    return success(res, null, 'Delivery canceled')
  } catch (err) { next(err) }
}
