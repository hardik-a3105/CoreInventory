import { Router } from 'express'
import { getDashboard, getMoveHistory } from '../controllers/dashboard.controller.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.use(protect)

router.get('/',             getDashboard)
router.get('/move-history', getMoveHistory)

export default router
