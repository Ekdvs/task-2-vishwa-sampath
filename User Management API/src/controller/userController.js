import { User } from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc    Create a new user
 * @route   POST /api/v1/users
 * @access  Public
 */
export const createUser = asyncHandler(async (request, response) => {
  const { name, email, age, role } = request.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({ name, email, age, role });

  return successResponse(response, 201, "User created successfully", user);
});

/**
 * @desc    Get all users with pagination, search, and sorting
 * @route   GET /api/v1/users?page=1&limit=10&search=john&sortBy=name&order=asc
 * @access  Public
 */
export const getUsers = asyncHandler(async (request, response) => {
  const page = parseInt(request.query.page, 10) || 1;
  const limit = parseInt(request.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const sortBy = request.query.sortBy || 'createdAt';
  const order = request.query.order === 'asc' ? 1 : -1;

  const filter = {};
  if (request.query.search) {
    const searchRegex = new RegExp(request.query.search, 'i');
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  if (request.query.role) {
    filter.role = req.query.role;
  }

  const [users, totalUsers] = await Promise.all([
    User.find(filter)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalUsers / limit) || 1;

  return successResponse(response, 200, 'Users fetched successfully', {
    users,
    pagination: {
      totalUsers,
      totalPages,
      currentPage: page,
      pageSize: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});

/**
 * @desc    Get a single user by ID
 * @route   GET /api/v1/users/:id
 * @access  Public
 */
export const getUserById = asyncHandler(async (request, response) => {
  const user = await User.findById(request.params.id);

  if (!user) {
    throw new ApiError(404, `User not found with id: ${request.params.id}`);
  }

  return successResponse(response, 200, 'User fetched successfully', user);
});

/**
 * @desc    Update a user by ID
 * @route   PUT /api/v1/users/:id
 * @access  Public
 */
export const updateUser = asyncHandler(async (request, response) => {
  const { name, email, age, role } = request.body;

  const user = await User.findById(request.params.id);

  if (!user) {
    throw new ApiError(404, `User not found with id: ${request.params.id}`);
  }

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (age !== undefined) user.age = age;
  if (role !== undefined) user.role = role;

  const updatedUser = await user.save();

  return successResponse(response, 200, 'User updated successfully', updatedUser);
});

/**
 * @desc    Delete a user by ID
 * @route   DELETE /api/v1/users/:id
 * @access  Public
 */
export const deleteUser = asyncHandler(async (request, response) => {
  const user = await User.findByIdAndDelete(request.params.id);

  if (!user) {
    throw new ApiError(404, `User not found with id: ${request.params.id}`);
  }

  return successResponse(response, 200, 'User deleted successfully', { id: request.params.id });
});
