import { Router } from 'express'
import {
  getWarehouses, getWarehouse, createWarehouse,
  updateWarehouse, deleteWarehouse, addLocation, deleteLocation,
} from '../controllers/warehouse.controller.js'
import { protect, isManager } from '../middleware/authMiddleware.js'

const router = Router()

router.use(protect)

router.get('/',                                          getWarehouses)
router.post('/',                         isManager,      createWarehouse)
router.get('/:id',                                       getWarehouse)
router.put('/:id',                        isManager,     updateWarehouse)
router.delete('/:id',                     isManager,     deleteWarehouse)
router.post('/:id/locations',             isManager,     addLocation)
router.delete('/:warehouseId/locations/:locationId', isManager, deleteLocation)

export default router
