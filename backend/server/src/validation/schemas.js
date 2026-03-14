import Joi from 'joi'

export const authValidation = {
  signup: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).max(50).required(),
    role: Joi.string().valid('STAFF', 'MANAGER', 'ADMIN').optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required(),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().lowercase().required(),
  }),

  verifyOtp: Joi.object({
    email: Joi.string().email().lowercase().required(),
    otp: Joi.string().length(6).required(),
  }),

  resetPassword: Joi.object({
    newPassword: Joi.string().min(6).max(50).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
  }),
}

export const productValidation = {
  createProduct: Joi.object({
    name: Joi.string().min(1).max(255).required(),
    sku: Joi.string().min(1).max(50).required(),
    categoryId: Joi.string().uuid().optional().allow(null),
    unit: Joi.string().max(20).optional(),
    minStock: Joi.number().integer().min(0).optional(),
    initialStock: Joi.number().integer().min(0).optional(),
  }),

  updateProduct: Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    sku: Joi.string().min(1).max(50).optional(),
    categoryId: Joi.string().uuid().optional().allow(null),
    unit: Joi.string().max(20).optional(),
    minStock: Joi.number().integer().min(0).optional(),
  }),

  createCategory: Joi.object({
    name: Joi.string().min(1).max(100).required(),
  }),
}

export const receiptValidation = {
  createReceipt: Joi.object({
    supplier: Joi.string().min(1).max(255).required(),
    notes: Joi.string().max(1000).optional().allow(''),
    lines: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().uuid().required(),
          quantity: Joi.number().integer().min(1).required(),
        })
      )
      .min(1)
      .required(),
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('DRAFT', 'WAITING', 'READY', 'DONE', 'CANCELED').required(),
  }),
}

export const deliveryValidation = {
  createDelivery: Joi.object({
    customer: Joi.string().min(1).max(255).required(),
    notes: Joi.string().max(1000).optional().allow(''),
    lines: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().uuid().required(),
          quantity: Joi.number().integer().min(1).required(),
        })
      )
      .min(1)
      .required(),
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('DRAFT', 'WAITING', 'READY', 'DONE', 'CANCELED').required(),
  }),
}

export const transferValidation = {
  createTransfer: Joi.object({
    fromLocation: Joi.string().uuid().required(),
    toLocation: Joi.string().uuid().required(),
    notes: Joi.string().max(1000).optional().allow(''),
    lines: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().uuid().required(),
          quantity: Joi.number().integer().min(1).required(),
        })
      )
      .min(1)
      .required(),
  }),
}

export const adjustmentValidation = {
  createAdjustment: Joi.object({
    productId: Joi.string().uuid().required(),
    newQty: Joi.number().integer().min(0).required(),
    locationId: Joi.string().uuid().optional(),
    reason: Joi.string().max(500).optional(),
  }),
}

export const warehouseValidation = {
  createWarehouse: Joi.object({
    name: Joi.string().min(1).max(255).required(),
    address: Joi.string().min(1).max(500).optional(),
  }),

  updateWarehouse: Joi.object({
    name: Joi.string().min(1).max(255).optional(),
    address: Joi.string().min(1).max(500).optional(),
  }),

  addLocation: Joi.object({
    name: Joi.string().min(1).max(255).required(),
  }),
}
