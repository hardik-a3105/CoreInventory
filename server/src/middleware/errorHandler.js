export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message)
  console.error('Error Stack:', err.stack)

  // Mongoose Duplicate Key Error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({
      success: false,
      message: `${field} already exists.`,
    })
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
    })
  }

  // Mongoose Cast Error
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format.',
    })
  }

  // Prisma errors (legacy)
  if (err.code === 'P2002') {
    return res.status(400).json({
      success: false,
      message: `Duplicate value: ${err.meta?.target?.join(', ')} already exists.`,
    })
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found.' })
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
}
