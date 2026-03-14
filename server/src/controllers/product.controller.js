import prisma from '../utils/prisma.js'
import { success, error } from '../utils/apiResponse.js'

// GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const { search, categoryId, lowStock } = req.query

    const where = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (categoryId) where.categoryId = categoryId
    if (lowStock === 'true') where.totalStock = { lte: 10 }

    const products = await prisma.product.findMany({
      where,
      include: { category: true, stockLevels: { include: { location: { include: { warehouse: true } } } } },
      orderBy: { createdAt: 'desc' },
    })
    return success(res, products)
  } catch (err) { next(err) }
}

// GET /api/products/:id
export const getProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true, stockLevels: { include: { location: { include: { warehouse: true } } } }, ledger: { orderBy: { createdAt: 'desc' }, take: 20 } },
    })
    if (!product) return error(res, 'Product not found.', 404)
    return success(res, product)
  } catch (err) { next(err) }
}

// POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const { name, sku, categoryId, unit, minStock, initialStock } = req.body

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        categoryId: categoryId || null,
        unit: unit || 'pcs',
        minStock: minStock || 10,
        totalStock: initialStock || 0,
      },
      include: { category: true },
    })

    if (initialStock && initialStock > 0) {
      await prisma.stockLedger.create({
        data: {
          productId: product.id,
          type: 'RECEIPT',
          quantity: initialStock,
          reference: 'INITIAL',
          description: 'Initial stock on product creation',
        },
      })
    }

    return success(res, product, 'Product created', 201)
  } catch (err) { next(err) }
}

// PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const { name, sku, categoryId, unit, minStock } = req.body
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { name, sku, categoryId, unit, minStock },
      include: { category: true },
    })
    return success(res, product, 'Product updated')
  } catch (err) { next(err) }
}

// DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } })
    return success(res, null, 'Product deleted')
  } catch (err) { next(err) }
}

// GET /api/products/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    return success(res, categories)
  } catch (err) { next(err) }
}

// POST /api/products/categories
export const createCategory = async (req, res, next) => {
  try {
    const category = await prisma.category.create({ data: { name: req.body.name } })
    return success(res, category, 'Category created', 201)
  } catch (err) { next(err) }
}
