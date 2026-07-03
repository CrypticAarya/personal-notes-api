const { verifyToken } = require('../utils/jwt');
const prisma = require('../lib/prisma');
const { errorResponse } = require('../utils/response');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Authentication token is required');
    }

    const token = authHeader.split(' ')[1];
    
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return errorResponse(res, 401, 'Invalid or expired token');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return errorResponse(res, 401, 'User no longer exists');
    }

    if (!user.isActive) {
      return errorResponse(res, 403, 'User account is inactive');
    }

    const { password: _, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

module.exports = {
  authenticate,
};
