import { Router } from 'express'
import {
  getDeliveries, getDelivery, createDelivery,
  updateDeliveryStatus, validateDelivery, cancelDelivery,
} from '../controllers/delivery.controller.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.use(protect)

router.get('/',                  getDeliveries)
router.post('/',                 createDelivery)
router.get('/:id',               getDelivery)
router.put('/:id/status',        updateDeliveryStatus)
router.post('/:id/validate',     validateDelivery)
router.put('/:id/cancel',        cancelDelivery)

export default router
