export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message)

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
