const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    return res.status(400).json({
      error: 'Validation Error',
      details: error.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
    });
  }
};

module.exports = {
  registerSchema,
  loginSchema,
  validateRequest,
};
