import { Router } from 'express'
import { getAdjustments, getAdjustment, createAdjustment } from '../controllers/adjustment.controller.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.use(protect)

router.get('/',      getAdjustments)
router.post('/',     createAdjustment)
router.get('/:id',   getAdjustment)

export default router
