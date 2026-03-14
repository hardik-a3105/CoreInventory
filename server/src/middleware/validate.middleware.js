/**
 * Validate request body against a Joi schema
 * Usage: app.post('/route', validateSchema('bodySchema'), handler)
 */
export const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }))
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors,
      })
    }

    req.body = value
    next()
  }
}

/**
 * Validate route parameters against a Joi schema
 */
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }))
      return res.status(422).json({
        success: false,
        message: 'Invalid parameters',
        errors,
      })
    }

    req.params = value
    next()
  }
}

/**
 * Validate query parameters against a Joi schema
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }))
      return res.status(422).json({
        success: false,
        message: 'Invalid query parameters',
        errors,
      })
    }

    req.query = value
    next()
  }
}
