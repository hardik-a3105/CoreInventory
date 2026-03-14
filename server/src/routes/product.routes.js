import { Router } from 'express'
import {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
  getCategories, createCategory,
} from '../controllers/product.controller.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.use(protect)

router.get('/',              getProducts)
router.post('/',             createProduct)
router.get('/categories',    getCategories)
router.post('/categories',   createCategory)
router.get('/:id',           getProduct)
router.put('/:id',           updateProduct)
router.delete('/:id',        deleteProduct)

export default router
