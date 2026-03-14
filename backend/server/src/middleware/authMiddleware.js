import jwt from 'jsonwebtoken'
import { error } from '../utils/apiResponse.js'

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Not authorized. No token provided.', 401)
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return error(res, 'Not authorized. Token is invalid or expired.', 401)
  }
}

export const isManager = (req, res, next) => {
  if (!['MANAGER', 'ADMIN'].includes(req.user?.role)) {
    return error(res, 'Access denied. Managers and Admins only.', 403)
  }
  next()
}
