import Product from '../models/Product.js'
import Category from '../models/Category.js'
import StockLedger from '../models/StockLedger.js'
import { success, error } from '../utils/apiResponse.js'

// GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const { search, categoryId, lowStock } = req.query

    const filter = {}
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ]
    }
    if (categoryId) filter.categoryId = categoryId
    if (lowStock === 'true') filter.currentStock = { $lte: 10 }

    const products = await Product.find(filter).populate('category').sort({ createdAt: -1 })
    return success(res, products)
  } catch (err) { next(err) }
}

// GET /api/products/:id
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category')
    if (!product) return error(res, 'Product not found.', 404)
    
    // Fetch recent stock ledger entries
    const ledger = await StockLedger.find({ productId: product._id }).sort({ createdAt: -1 }).limit(20)
    
    return success(res, { ...product.toObject(), ledger })
  } catch (err) { next(err) }
}

// POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const { name, sku, categoryId, unit, minStock, initialStock } = req.body

    const product = await Product.create({
      name,
      sku,
      categoryId: categoryId || null,
      unit: unit || 'pcs',
      minimumStock: minStock || 10,
      currentStock: initialStock || 0,
    })

    await product.populate('category')

    if (initialStock && initialStock > 0) {
      await StockLedger.create({
        productId: product._id,
        type: 'receipt',
        quantity: initialStock,
        reference: 'INITIAL',
        notes: 'Initial stock on product creation',
      })
    }

    return success(res, product, 'Product created', 201)
  } catch (err) { next(err) }
}

// PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const { name, sku, categoryId, unit, minStock } = req.body
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, sku, categoryId, unit, minimumStock: minStock },
      { new: true }
    ).populate('category')
    
    if (!product) return error(res, 'Product not found.', 404)
    return success(res, product, 'Product updated')
  } catch (err) { next(err) }
}

// DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return error(res, 'Product not found.', 404)
    return success(res, null, 'Product deleted')
  } catch (err) { next(err) }
}

// GET /api/products/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    return success(res, categories)
  } catch (err) { next(err) }
}

// POST /api/products/categories
export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create({ name: req.body.name })
    return success(res, category, 'Category created', 201)
  } catch (err) { next(err) }
}
