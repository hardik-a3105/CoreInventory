import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all operations
export const getOperations = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status, warehouseId, productId } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (warehouseId) where.warehouseId = parseInt(warehouseId);
    if (productId) where.productId = parseInt(productId);

    const [operations, total] = await Promise.all([
      prisma.operation.findMany({
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
      prisma.operation.count({ where })
    ]);

    res.json({
      operations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get operations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single operation
export const getOperation = async (req, res) => {
  try {
    const { id } = req.params;

    const operation = await prisma.operation.findUnique({
      where: { id: parseInt(id) },
      include: {
        product: true,
        warehouse: true,
        user: { select: { name: true, email: true } }
      }
    });

    if (!operation) {
      return res.status(404).json({ error: 'Operation not found' });
    }

    res.json({ operation });
  } catch (error) {
    console.error('Get operation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create operation
export const createOperation = async (req, res) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    try {
      const { type, productId, warehouseId, quantity, unit, reference, notes } = req.body;
      const userId = req.user.id;

      if (!type || !productId || !warehouseId || !quantity) {
        throw new Error('Type, productId, warehouseId, and quantity are required');
      }

      // Validate operation type
      const validTypes = ['RECEIPT', 'DELIVERY', 'TRANSFER'];
      if (!validTypes.includes(type)) {
        throw new Error('Invalid operation type');
      }

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) }
      });
      if (!product) {
        throw new Error('Product not found');
      }

      // Check if warehouse exists
      const warehouse = await prisma.warehouse.findUnique({
        where: { id: parseInt(warehouseId) }
      });
      if (!warehouse) {
        throw new Error('Warehouse not found');
      }

      // For deliveries, check if sufficient stock exists
      if (type === 'DELIVERY') {
        const stockLevel = await prisma.stockLevel.findUnique({
          where: {
            productId_warehouseId: {
              productId: parseInt(productId),
              warehouseId: parseInt(warehouseId)
            }
          }
        });

        if (!stockLevel || stockLevel.quantity < quantity) {
          throw new Error('Insufficient stock for delivery');
        }
      }

      // Create operation
      const operation = await prisma.operation.create({
        data: {
          type,
          productId: parseInt(productId),
          warehouseId: parseInt(warehouseId),
          quantity: parseInt(quantity),
          unit: unit || product.unit,
          reference,
          notes,
          userId,
          status: 'COMPLETED' // Auto-complete for now
        },
        include: {
          product: { select: { name: true, sku: true } },
          warehouse: { select: { name: true } },
          user: { select: { name: true } }
        }
      });

      // Update stock levels
      await updateStockLevel(prisma, productId, warehouseId, type, quantity);

      return operation;
    } catch (error) {
      throw error;
    }
  });

  try {
    res.status(201).json({
      message: 'Operation created successfully',
      operation: transaction
    });
  } catch (error) {
    console.error('Create operation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update operation status
export const updateOperationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['PENDING', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const operation = await prisma.operation.findUnique({
      where: { id: parseInt(id) }
    });

    if (!operation) {
      return res.status(404).json({ error: 'Operation not found' });
    }

    // If changing from PENDING to COMPLETED, update stock levels
    if (operation.status === 'PENDING' && status === 'COMPLETED') {
      await updateStockLevel(prisma, operation.productId, operation.warehouseId, operation.type, operation.quantity);
    }

    // If changing from COMPLETED to CANCELLED, reverse stock levels
    if (operation.status === 'COMPLETED' && status === 'CANCELLED') {
      const reverseType = operation.type === 'RECEIPT' ? 'DELIVERY' : 'RECEIPT';
      await updateStockLevel(prisma, operation.productId, operation.warehouseId, reverseType, operation.quantity);
    }

    const updatedOperation = await prisma.operation.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        product: { select: { name: true, sku: true } },
        warehouse: { select: { name: true } },
        user: { select: { name: true } }
      }
    });

    res.json({
      message: 'Operation status updated successfully',
      operation: updatedOperation
    });
  } catch (error) {
    console.error('Update operation status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to update stock levels
async function updateStockLevel(prisma, productId, warehouseId, type, quantity) {
  const stockLevel = await prisma.stockLevel.findUnique({
    where: {
      productId_warehouseId: {
        productId: parseInt(productId),
        warehouseId: parseInt(warehouseId)
      }
    }
  });

  if (type === 'RECEIPT') {
    if (stockLevel) {
      await prisma.stockLevel.update({
        where: {
          productId_warehouseId: {
            productId: parseInt(productId),
            warehouseId: parseInt(warehouseId)
          }
        },
        data: {
          quantity: stockLevel.quantity + quantity
        }
      });
    } else {
      await prisma.stockLevel.create({
        data: {
          productId: parseInt(productId),
          warehouseId: parseInt(warehouseId),
          quantity
        }
      });
    }
  } else if (type === 'DELIVERY') {
    if (stockLevel) {
      const newQuantity = stockLevel.quantity - quantity;
      if (newQuantity <= 0) {
        await prisma.stockLevel.delete({
          where: {
            productId_warehouseId: {
              productId: parseInt(productId),
              warehouseId: parseInt(warehouseId)
            }
          }
        });
      } else {
        await prisma.stockLevel.update({
          where: {
            productId_warehouseId: {
              productId: parseInt(productId),
              warehouseId: parseInt(warehouseId)
            }
          },
          data: { quantity: newQuantity }
        });
      }
    }
  }
}