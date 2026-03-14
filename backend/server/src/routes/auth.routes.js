import { Router } from 'express'
import { signup, login, forgotPassword, verifyOtpHandler, resetPassword, getMe } from '../controllers/auth.controller.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/signup',           signup)
router.post('/login',            login)
router.post('/forgot-password',  forgotPassword)
router.post('/verify-otp',       verifyOtpHandler)
router.post('/reset-password',   protect, resetPassword)
router.get('/me',                protect, getMe)

export default router
