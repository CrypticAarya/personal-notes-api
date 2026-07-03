const successResponse = (res, statusCode, data = null, meta = undefined) => {
  const response = { success: true };
  if (data !== null) response.data = data;
  if (meta !== undefined) response.meta = meta;
  return res.status(statusCode).json(response);
};

const errorResponse = (res, statusCode, message, details = undefined) => {
  const response = {
    success: false,
    error: { message },
  };
  if (details !== undefined) response.error.details = details;
  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
};
