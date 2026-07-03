const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    return successResponse(res, 201, result);
  } catch (error) {
    if (error.status) {
      return errorResponse(res, error.status, error.message);
    }
    console.error('Register error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    return successResponse(res, 200, result);
  } catch (error) {
    if (error.status) {
      return errorResponse(res, error.status, error.message);
    }
    console.error('Login error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

module.exports = {
  register,
  login,
};
