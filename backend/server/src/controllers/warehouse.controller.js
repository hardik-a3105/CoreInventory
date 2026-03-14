import Warehouse from '../models/Warehouse.js'
import Location from '../models/Location.js'
import { success, error } from '../utils/apiResponse.js'

// GET /api/warehouses
export const getWarehouses = async (req, res, next) => {
  try {
    const warehouses = await Warehouse.find().sort({ name: 1 })
    return success(res, warehouses)
  } catch (err) { next(err) }
}

// GET /api/warehouses/:id
export const getWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id)
    if (!warehouse) return error(res, 'Warehouse not found.', 404)
    
    const locations = await Location.find({ warehouseId: warehouse._id })
    return success(res, { ...warehouse.toObject(), locations })
  } catch (err) { next(err) }
}

// POST /api/warehouses
export const createWarehouse = async (req, res, next) => {
  try {
    const { name, location, capacity } = req.body
    const warehouse = await Warehouse.create({ name, location, capacity })
    return success(res, warehouse, 'Warehouse created', 201)
  } catch (err) { next(err) }
}

// PUT /api/warehouses/:id
export const updateWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!warehouse) return error(res, 'Warehouse not found.', 404)
    return success(res, warehouse, 'Warehouse updated')
  } catch (err) { next(err) }
}

// DELETE /api/warehouses/:id
export const deleteWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id)
    if (!warehouse) return error(res, 'Warehouse not found.', 404)
    return success(res, null, 'Warehouse deleted')
  } catch (err) { next(err) }
}

// POST /api/warehouses/:id/locations
export const addLocation = async (req, res, next) => {
  try {
    const { name, type } = req.body
    const location = await Location.create({ warehouseId: req.params.id, name, type })
    return success(res, location, 'Location added', 201)
  } catch (err) { next(err) }
}

// DELETE /api/warehouses/:warehouseId/locations/:locationId
export const deleteLocation = async (req, res, next) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.locationId)
    if (!location) return error(res, 'Location not found.', 404)
    return success(res, null, 'Location deleted')
  } catch (err) { next(err) }
}
