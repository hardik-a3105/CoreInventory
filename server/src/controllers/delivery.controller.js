import Delivery from '../models/Delivery.js'
import StockLedger from '../models/StockLedger.js'
import Product from '../models/Product.js'
import { success, error } from '../utils/apiResponse.js'

// GET /api/deliveries
export const getDeliveries = async (req, res, next) => {
  try {
    const { status } = req.query
    const filter = status ? { status } : {}
    const deliveries = await Delivery.find(filter).populate('productId').populate('createdBy').sort({ createdAt: -1 })
    return success(res, deliveries)
  } catch (err) { next(err) }
}

// GET /api/deliveries/:id
export const getDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id).populate('productId').populate('createdBy')
    if (!delivery) return error(res, 'Delivery not found.', 404)
    return success(res, delivery)
  } catch (err) { next(err) }
}

// POST /api/deliveries
export const createDelivery = async (req, res, next) => {
  try {
    const { deliveryNumber, customerId, customerName, productId, quantity } = req.body

    // Check stock availability before creating
    const product = await Product.findById(productId)
    if (!product) return error(res, 'Product not found.', 404)
    if (product.currentStock < quantity) {
      return error(res, `Insufficient stock for "${product.name}". Available: ${product.currentStock}`, 400)
    }

    const delivery = await Delivery.create({
      deliveryNumber,
      customerId,
      customerName,
      productId,
      quantity,
      status: 'DRAFT',
      createdBy: req.user.id,
    })

    await delivery.populate('productId').populate('createdBy')
    return success(res, delivery, 'Delivery order created', 201)
  } catch (err) { next(err) }
}

// PUT /api/deliveries/:id
export const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!delivery) return error(res, 'Delivery not found.', 404)
    return success(res, delivery, 'Status updated')
  } catch (err) { next(err) }
}

// POST /api/deliveries/:id/validate  — stock decreases here
export const validateDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
    if (!delivery) return error(res, 'Delivery not found.', 404)
    if (delivery.status === 'DELIVERED') return error(res, 'Delivery already validated.', 400)
    if (delivery.status === 'CANCELLED') return error(res, 'Cannot validate a canceled delivery.', 400)

    // Re-check stock at validation time
    const product = await Product.findById(delivery.productId)
    if (product.currentStock < delivery.quantity) {
      return error(res, `Insufficient stock for "${product.name}". Available: ${product.currentStock}`, 400)
    }

    // Decrease product stock
    await Product.findByIdAndUpdate(
      delivery.productId,
      { $inc: { currentStock: -delivery.quantity } },
      { new: true }
    )

    // Create stock ledger entry (negative for outgoing)
    await StockLedger.create({
      productId: delivery.productId,
      type: 'delivery',
      quantity: -delivery.quantity,
      reference: delivery.deliveryNumber,
      notes: `Delivery to ${delivery.customerName || 'Customer'}`,
    })

    // Update delivery status
    delivery.status = 'DELIVERED'
    await delivery.save()

    return success(res, null, 'Delivery validated. Stock updated.')
  } catch (err) { next(err) }
}

// DELETE /api/deliveries/:id  — cancel
export const cancelDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
    if (!delivery) return error(res, 'Delivery not found.', 404)
    if (delivery.status === 'DELIVERED') return error(res, 'Cannot cancel a validated delivery.', 400)

    delivery.status = 'CANCELLED'
    await delivery.save()
    return success(res, null, 'Delivery canceled')
  } catch (err) { next(err) }
}
