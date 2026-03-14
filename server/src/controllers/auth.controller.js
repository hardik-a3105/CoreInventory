import bcrypt from 'bcryptjs'
import prisma from '../utils/prisma.js'
import { generateToken } from '../utils/generateToken.js'
import { createAndSendOtp, verifyOtp } from '../services/otp.service.js'
import { success, error } from '../utils/apiResponse.js'

// POST /api/auth/signup
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return error(res, 'Email already registered.', 400)

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || 'STAFF' },
    })

    const token = generateToken({ id: user.id, email: user.email, role: user.role })
    return success(res, { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, 'Account created', 201)
  } catch (err) { next(err) }
}

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return error(res, 'Invalid email or password.', 401)

    const match = await bcrypt.compare(password, user.password)
    if (!match) return error(res, 'Invalid email or password.', 401)

    const token = generateToken({ id: user.id, email: user.email, role: user.role })
    return success(res, { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, 'Login successful')
  } catch (err) { next(err) }
}

// POST /api/auth/forgot-password  { email }
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return error(res, 'No account found with that email.', 404)

    await createAndSendOtp(user)
    return success(res, null, 'OTP sent to your email.')
  } catch (err) { next(err) }
}

// POST /api/auth/verify-otp  { email, otp }
export const verifyOtpHandler = async (req, res, next) => {
  try {
    const { email, otp } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return error(res, 'User not found.', 404)

    const valid = await verifyOtp(user.id, otp)
    if (!valid) return error(res, 'Invalid or expired OTP.', 400)

    const token = generateToken({ id: user.id, email: user.email, role: user.role, resetAllowed: true })
    return success(res, { token }, 'OTP verified. Use token to reset password.')
  } catch (err) { next(err) }
}

// POST /api/auth/reset-password  { newPassword }  (requires token from verify-otp)
export const resetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body
    if (!req.user?.resetAllowed) return error(res, 'Not authorized for password reset.', 403)

    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } })
    return success(res, null, 'Password reset successfully.')
  } catch (err) { next(err) }
}

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    return success(res, user)
  } catch (err) { next(err) }
}
