import { validationResult } from "express-validator";
import { errorResponse } from "../utils/apiResponse.js";


/*
 * Collects validation errors registered by express-validator
 * chains and short-circuits the request with a 422 response
 * if any are present.
 */
export const validateRequest = (request, response, next) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return errorResponse(response, 422, 'Validation failed', formattedErrors);
  }

  next();
};


