import express from 'express'
import { createUserValidator, getUsersQueryValidator, updateUserValidator, userIdValidator } from '../validators/useValidator.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createUser, deleteUser, getUserById, getUsers, updateUser } from '../controller/userController.js';

const userRouter =express.Router();

// POST /api/v1/users
userRouter.post('/', createUserValidator, validateRequest, createUser);

// GET /api/v1/users
userRouter.get('/', getUsersQueryValidator, validateRequest, getUsers);

// GET /api/v1/users/:id
userRouter.get('/:id', userIdValidator, validateRequest, getUserById);

// PUT /api/v1/users/:id
userRouter.put(
  '/:id',
  userIdValidator,
  updateUserValidator,
  validateRequest,
  updateUser
);

// DELETE /api/v1/users/:id
userRouter.delete('/:id', userIdValidator, validateRequest, deleteUser);


export default userRouter