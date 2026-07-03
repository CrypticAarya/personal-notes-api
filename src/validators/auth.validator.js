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

const { errorResponse } = require('../utils/response');

const validateRequest = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.body = validated.body;
    req.query = validated.query;
    req.params = validated.params;
    next();
  } catch (error) {
    let details;
    if (error && error.issues) {
      details = error.issues.map((e) => ({ path: e.path.join('.'), message: e.message }));
    } else if (error && error.errors) {
      details = error.errors.map((e) => ({ path: e.path.join('.'), message: e.message }));
    }
    return errorResponse(res, 400, 'Validation Error', details || [error.message]);
  }
};

module.exports = {
  registerSchema,
  loginSchema,
  validateRequest,
};
