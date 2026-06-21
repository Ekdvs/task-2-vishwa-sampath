import { errorResponse } from "../utils/apiResponse.js";

/**
 * Centralized error-handling middleware.
 * Normalizes Mongoose errors, custom ApiErrors, and any
 * unexpected errors into the application's standard error
 * response shape. This is the single place where errors are
 * translated into HTTP responses, so the app never crashes
 * due to an unhandled error in a route.
 */

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, request, response, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
  }

  // Mongoose invalid ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field "${err.path}"`;
    errors = [{ field: err.path, message: `Invalid ${err.kind}: ${err.value}` }];
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value error`;
    errors = [
      {
        field,
        message: `${field} "${err.keyValue[field]}" already exists`,
      },
    ];
  }

  // Log full error in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  return errorResponse(response, statusCode, message, errors);
};


