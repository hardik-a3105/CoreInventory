import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all warehouses
export const getWarehouses = async (req, res) => {
  try {
    const warehouses = await prisma.warehouse.findMany({
      include: {
        stockLevels: {
          include: {
            product: true
          }
        },
        _count: {
          select: { operations: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate capacity usage for each warehouse
    const warehousesWithCapacity = warehouses.map(warehouse => {
      const totalItems = warehouse.stockLevels.reduce((sum, level) => sum + level.quantity, 0);
      const capacityUsage = warehouse.capacity > 0 ? (totalItems / warehouse.capacity) * 100 : 0;

      return {
        ...warehouse,
        totalItems,
        capacityUsage: Math.round(capacityUsage * 100) / 100, // Round to 2 decimal places
        availableCapacity: warehouse.capacity - totalItems
      };
    });

    res.json({
      warehouses: warehousesWithCapacity
    });
  } catch (error) {
    console.error('Get warehouses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single warehouse
export const getWarehouse = async (req, res) => {
  try {
    const { id } = req.params;

    const warehouse = await prisma.warehouse.findUnique({
      where: { id: parseInt(id) },
      include: {
        stockLevels: {
          include: {
            product: true
          }
        },
        operations: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            product: true,
            user: { select: { name: true } }
          }
        }
      }
    });

    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    // Calculate capacity usage
    const totalItems = warehouse.stockLevels.reduce((sum, level) => sum + level.quantity, 0);
    const capacityUsage = warehouse.capacity > 0 ? (totalItems / warehouse.capacity) * 100 : 0;

    res.json({
      warehouse: {
        ...warehouse,
        totalItems,
        capacityUsage: Math.round(capacityUsage * 100) / 100,
        availableCapacity: warehouse.capacity - totalItems
      }
    });
  } catch (error) {
    console.error('Get warehouse error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create warehouse
export const createWarehouse = async (req, res) => {
  try {
    const { name, location, capacity } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: 'Name and location are required' });
    }

    const warehouse = await prisma.warehouse.create({
      data: {
        name,
        location,
        capacity: capacity || 0
      }
    });

    res.status(201).json({
      message: 'Warehouse created successfully',
      warehouse
    });
  } catch (error) {
    console.error('Create warehouse error:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Warehouse name already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update warehouse
export const updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, capacity } = req.body;

    const warehouse = await prisma.warehouse.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(location && { location }),
        ...(capacity !== undefined && { capacity })
      }
    });

    res.json({
      message: 'Warehouse updated successfully',
      warehouse
    });
  } catch (error) {
    console.error('Update warehouse error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Warehouse name already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete warehouse
export const deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if warehouse has stock levels
    const stockCount = await prisma.stockLevel.count({
      where: { warehouseId: parseInt(id) }
    });

    if (stockCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete warehouse with existing stock. Please transfer or remove all stock first.'
      });
    }

    await prisma.warehouse.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      message: 'Warehouse deleted successfully'
    });
  } catch (error) {
    console.error('Delete warehouse error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};