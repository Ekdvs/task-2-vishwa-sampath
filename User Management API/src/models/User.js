import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [3, 'Name must be at least 3 characters long'],

        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$/,
                'Please provide a valid email address',
            ],
        },
        age: {
            type: Number,
            required: [true, 'Age is required'],
            min: [18, 'Age must be at least 18'],
            max: [100, 'Age must not exceed 100'],
        },
        role: {
            type: String,
            enum: {
                values: ['user', 'admin'],
                message: 'Role must be either "user" or "admin"',
            },
            default: 'user',
        },

    },
    {
        timestamps: true,
    }
)

// Index for faster search/sort on commonly queried fields
userSchema.index({ name: 'text', email: 'text' });

export const User =mongoose.model('User',userSchema)