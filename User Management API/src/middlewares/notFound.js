import ApiError from "../utils/ApiError.js";



/**
 * Catches any request that does not match a defined route
 * and forwards a 404 ApiError to the global error handler.
 */
export const notFound = (request, response, next) => {
  const error = new ApiError(404, `Route not found - ${request.originalUrl}`);
  next(error);
};
