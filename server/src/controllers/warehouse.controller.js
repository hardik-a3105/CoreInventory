import prisma from '../utils/prisma.js'
import { success, error } from '../utils/apiResponse.js'

// GET /api/warehouses
export const getWarehouses = async (req, res, next) => {
  try {
    const warehouses = await prisma.warehouse.findMany({
      include: { locations: true },
      orderBy: { name: 'asc' },
    })
    return success(res, warehouses)
  } catch (err) { next(err) }
}

// GET /api/warehouses/:id
export const getWarehouse = async (req, res, next) => {
  try {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: req.params.id },
      include: { locations: { include: { stocks: { include: { product: true } } } } },
    })
    if (!warehouse) return error(res, 'Warehouse not found.', 404)
    return success(res, warehouse)
  } catch (err) { next(err) }
}

// POST /api/warehouses
export const createWarehouse = async (req, res, next) => {
  try {
    const { name, address } = req.body
    const warehouse = await prisma.warehouse.create({
      data: { name, address },
    })
    return success(res, warehouse, 'Warehouse created', 201)
  } catch (err) { next(err) }
}

// PUT /api/warehouses/:id
export const updateWarehouse = async (req, res, next) => {
  try {
    const warehouse = await prisma.warehouse.update({
      where: { id: req.params.id },
      data: req.body,
    })
    return success(res, warehouse, 'Warehouse updated')
  } catch (err) { next(err) }
}

// DELETE /api/warehouses/:id
export const deleteWarehouse = async (req, res, next) => {
  try {
    await prisma.warehouse.delete({ where: { id: req.params.id } })
    return success(res, null, 'Warehouse deleted')
  } catch (err) { next(err) }
}

// POST /api/warehouses/:id/locations
export const addLocation = async (req, res, next) => {
  try {
    const { name } = req.body
    const location = await prisma.location.create({
      data: { name, warehouseId: req.params.id },
    })
    return success(res, location, 'Location added', 201)
  } catch (err) { next(err) }
}

// DELETE /api/warehouses/:warehouseId/locations/:locationId
export const deleteLocation = async (req, res, next) => {
  try {
    await prisma.location.delete({ where: { id: req.params.locationId } })
    return success(res, null, 'Location deleted')
  } catch (err) { next(err) }
}
