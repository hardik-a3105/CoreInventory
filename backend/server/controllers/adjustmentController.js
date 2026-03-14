import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all adjustments
export const getAdjustments = async (req, res) => {
  try {
    const { page = 1, limit = 20, productId, warehouseId } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (productId) where.productId = productId;
    if (warehouseId) where.warehouseId = warehouseId;

    const [adjustments, total] = await Promise.all([
      prisma.adjustment.findMany({
        where,
        include: {
          product: { select: { name: true, sku: true } },
          warehouse: { select: { name: true } },
          user: { select: { name: true } }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.adjustment.count({ where })
    ]);

    res.json({
      adjustments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get adjustments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single adjustment
export const getAdjustment = async (req, res) => {
  try {
    const { id } = req.params;

    const adjustment = await prisma.adjustment.findUnique({
      where: { id: id },
      include: {
        product: true,
        warehouse: true,
        user: { select: { name: true, email: true } }
      }
    });

    if (!adjustment) {
      return res.status(404).json({ error: 'Adjustment not found' });
    }

    res.json({ adjustment });
  } catch (error) {
    console.error('Get adjustment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create adjustment
export const createAdjustment = async (req, res) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    try {
      const { productId, warehouseId, quantity, reason, notes } = req.body;
      const userId = req.user.id;

      if (!productId || !warehouseId || quantity === undefined || !reason) {
        throw new Error('ProductId, warehouseId, quantity, and reason are required');
      }

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });
      if (!product) {
        throw new Error('Product not found');
      }

      // Check if warehouse exists
      const warehouse = await prisma.warehouse.findUnique({
        where: { id: warehouseId }
      });
      if (!warehouse) {
        throw new Error('Warehouse not found');
      }

      // Get current stock level
      const currentStockLevel = await prisma.stockLevel.findUnique({
        where: {
          productId_warehouseId: {
            productId: productId,
            warehouseId: warehouseId
          }
        }
      });

      const currentQuantity = currentStockLevel ? currentStockLevel.quantity : 0;
      const newQuantity = currentQuantity + parseInt(quantity);

      if (newQuantity < 0) {
        throw new Error('Adjustment would result in negative stock');
      }

      // Create adjustment record
      const adjustment = await prisma.adjustment.create({
        data: {
          productId: productId,
          warehouseId: warehouseId,
          quantity: parseInt(quantity),
          reason,
          notes,
          userId,
          previousQuantity: currentQuantity,
          newQuantity
        },
        include: {
          product: { select: { name: true, sku: true } },
          warehouse: { select: { name: true } },
          user: { select: { name: true } }
        }
      });

      // Update stock level
      if (newQuantity === 0) {
        // Remove stock level if quantity becomes 0
        if (currentStockLevel) {
          await prisma.stockLevel.delete({
            where: {
              productId_warehouseId: {
                productId: productId,
                warehouseId: warehouseId
              }
            }
          });
        }
      } else if (currentStockLevel) {
        // Update existing stock level
        await prisma.stockLevel.update({
          where: {
            productId_warehouseId: {
              productId: productId,
              warehouseId: warehouseId
            }
          },
          data: { quantity: newQuantity }
        });
      } else {
        // Create new stock level
        await prisma.stockLevel.create({
          data: {
            productId: productId,
            warehouseId: warehouseId,
            quantity: newQuantity
          }
        });
      }

      return adjustment;
    } catch (error) {
      throw error;
    }
  });

  try {
    res.status(201).json({
      message: 'Adjustment created successfully',
      adjustment: transaction
    });
  } catch (error) {
    console.error('Create adjustment error:', error);
    if (error.message.includes('required')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('negative stock')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};