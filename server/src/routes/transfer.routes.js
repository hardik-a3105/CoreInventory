import { Router } from 'express'
import {
  getTransfers, getTransfer, createTransfer,
  validateTransfer, cancelTransfer,
} from '../controllers/transfer.controller.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.use(protect)

router.get('/',                  getTransfers)
router.post('/',                 createTransfer)
router.get('/:id',               getTransfer)
router.post('/:id/validate',     validateTransfer)
router.put('/:id/cancel',        cancelTransfer)

export default router
