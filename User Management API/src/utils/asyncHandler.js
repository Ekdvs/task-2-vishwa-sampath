/**
 * Wraps async route handlers so any thrown error or rejected promise
 * is automatically forwarded to Express's error-handling middleware,
 * removing the need for repetitive try/catch blocks in controllers.
 */
const asyncHandler = (fn) => (request, response, next) => {
  Promise.resolve(fn(request, response, next)).catch(next);
};

export default asyncHandler;