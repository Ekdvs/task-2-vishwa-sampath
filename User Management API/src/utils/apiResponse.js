
/**
 * Standardized success response.
 */
export const successResponse = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standardized error response.
 */
export const errorResponse = (response, statusCode, message, errors = []) => {
  return response.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};