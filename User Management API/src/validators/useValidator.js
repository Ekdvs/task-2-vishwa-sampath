import { body, param, query }  from'express-validator';

export const createUserValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('age')
    .notEmpty()
    .withMessage('Age is required')
    .isInt({ min: 18, max: 100 })
    .withMessage('Age must be a number between 18 and 100'),

  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either "user" or "admin"'),
];

export const updateUserValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('age')
    .optional()
    .isInt({ min: 18, max: 100 })
    .withMessage('Age must be a number between 18 and 100'),

  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either "user" or "admin"'),
];

export const userIdValidator = [
  param('id').isMongoId().withMessage('Invalid user ID format'),
];

export const getUsersQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be a positive integer (max 100)'),

  query('sortBy')
    .optional()
    .isIn(['name', 'email', 'age', 'createdAt', 'updatedAt'])
    .withMessage('sortBy must be one of: name, email, age, createdAt, updatedAt'),

  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('order must be either "asc" or "desc"'),
];
