import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all products with stock levels
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (category) {
      where.category = category;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          stockLevels: {
            include: {
              warehouse: true
            }
          },
          _count: {
            select: { operations: true }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    // Calculate total stock for each product
    const productsWithTotals = products.map(product => ({
      ...product,
      totalStock: product.stockLevels.reduce((sum, level) => sum + level.quantity, 0),
      stockStatus: getStockStatus(product)
    }));

    res.json({
      products: productsWithTotals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        stockLevels: {
          include: {
            warehouse: true
          }
        },
        operations: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { name: true } },
            warehouse: { select: { name: true } }
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const totalStock = product.stockLevels.reduce((sum, level) => sum + level.quantity, 0);

    res.json({
      ...product,
      totalStock,
      stockStatus: getStockStatus(product)
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    const { name, sku, description, category, unit, minStock, maxStock } = req.body;

    if (!name || !sku) {
      return res.status(400).json({ error: 'Name and SKU are required' });
    }

    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku }
    });

    if (existingProduct) {
      return res.status(409).json({ error: 'SKU already exists' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description,
        category,
        unit: unit || 'pcs',
        minStock: minStock || 0,
        maxStock
      },
      include: {
        stockLevels: true
      }
    });

    res.status(201).json({
      message: 'Product created successfully',
      product: {
        ...product,
        totalStock: 0,
        stockStatus: 'out_of_stock'
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, description, category, unit, minStock, maxStock } = req.body;

    // Check if SKU conflicts with another product
    if (sku) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          sku,
          NOT: { id }
        }
      });

      if (existingProduct) {
        return res.status(409).json({ error: 'SKU already exists' });
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        sku,
        description,
        category,
        unit,
        minStock,
        maxStock
      },
      include: {
        stockLevels: {
          include: {
            warehouse: true
          }
        }
      }
    });

    const totalStock = product.stockLevels.reduce((sum, level) => sum + level.quantity, 0);

    res.json({
      message: 'Product updated successfully',
      product: {
        ...product,
        totalStock,
        stockStatus: getStockStatus(product)
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to determine stock status
function getStockStatus(product) {
  const totalStock = product.stockLevels.reduce((sum, level) => sum + level.quantity, 0);

  if (totalStock === 0) return 'out_of_stock';
  if (totalStock <= product.minStock) return 'low_stock';
  if (product.maxStock && totalStock >= product.maxStock) return 'overstock';
  return 'healthy';
}