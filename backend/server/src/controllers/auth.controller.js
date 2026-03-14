import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { mockUser } from '../utils/mockDB.js'
import { generateToken } from '../utils/generateToken.js'
import { createAndSendOtp, verifyOtp } from '../services/otp.service.js'
import { success, error } from '../utils/apiResponse.js'

// Use mock database if real one fails
const getDB = (useReal = true) => useReal ? User : mockUser

// POST /api/auth/signup
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    // Try real DB first, fallback to mock
    let UserModel = User
    let exists = null
    try {
      exists = await User.findOne({ email })
    } catch (dbErr) {
      console.log('ℹ️  Using mock database (MongoDB offline)')
      UserModel = mockUser
      exists = await mockUser.findOne({ email })
    }

    if (exists) return error(res, 'Email already registered.', 400)

    const hashed = await bcrypt.hash(password, 10)
    const normalizedRole = (role || 'STAFF').toUpperCase()
    const user = await UserModel.create({ name, email, password: hashed, role: normalizedRole })

    const token = generateToken({ id: user._id, email: user.email, role: user.role })
    return success(res, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Account created', 201)
  } catch (err) { next(err) }
}

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    let UserModel = User
    let user = null
    try {
      user = await User.findOne({ email })
    } catch (dbErr) {
      UserModel = mockUser
      user = await mockUser.findOne({ email })
    }

    if (!user) return error(res, 'Invalid email or password.', 401)

    const match = await bcrypt.compare(password, user.password)
    if (!match) return error(res, 'Invalid email or password.', 401)

    const token = generateToken({ id: user._id, email: user.email, role: user.role })
    return success(res, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Login successful')
  } catch (err) { next(err) }
}

// POST /api/auth/forgot-password  { email }
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return error(res, 'No account found with that email.', 404)

    await createAndSendOtp(user)
    return success(res, null, 'OTP sent to your email.')
  } catch (err) { next(err) }
}

// POST /api/auth/verify-otp  { email, otp }
export const verifyOtpHandler = async (req, res, next) => {
  try {
    const { email, otp } = req.body
    const user = await User.findOne({ email })
    if (!user) return error(res, 'User not found.', 404)

    const valid = await verifyOtp(user._id, otp)
    if (!valid) return error(res, 'Invalid or expired OTP.', 400)

    const token = generateToken({ id: user._id, email: user.email, role: user.role, resetAllowed: true })
    return success(res, { token }, 'OTP verified. Use token to reset password.')
  } catch (err) { next(err) }
}

// POST /api/auth/reset-password  { newPassword }  (requires token from verify-otp)
export const resetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body
    if (!req.user?.resetAllowed) return error(res, 'Not authorized for password reset.', 403)

    const hashed = await bcrypt.hash(newPassword, 10)
    await User.findByIdAndUpdate(req.user.id, { password: hashed }, { new: true })
    return success(res, null, 'Password reset successfully.')
  } catch (err) { next(err) }
}

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('id name email role createdAt')
    return success(res, user)
  } catch (err) { next(err) }
}
