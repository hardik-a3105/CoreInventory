import { Router } from 'express'
import {
  getReceipts, getReceipt, createReceipt,
  updateReceiptStatus, validateReceipt, cancelReceipt,
} from '../controllers/receipt.controller.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.use(protect)

router.get('/',                  getReceipts)
router.post('/',                 createReceipt)
router.get('/:id',               getReceipt)
router.put('/:id/status',        updateReceiptStatus)
router.post('/:id/validate',     validateReceipt)
router.put('/:id/cancel',        cancelReceipt)

export default router
