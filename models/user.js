import mongoose from "mongoose"

const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required!"],
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, "Password is required!"],
            select: false
        },
        name: {
            type: String,
            required: [true, "Name is required!"],
        },
        username: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
            default: Date.now()
        },
        timezone: {
            type: Number,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isOnline: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false,
            select: false
        },
        joiningDate: {
            type: Date,
            default: Date.now,
        },
        lastLogin: {
            type: Date,
            default: null
        },
        resetToken: {
            type: Number,
            default: null,
            select: false
        },
        resetTokenExpiration: {
            type: Date,
            default: null,
            select: false
        },
        userType: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        createdAt: {
            type: Date,
            select: false
        },
        updatedAt: {
            type: Date,
            select: false
        }
    },
    { timestamps: true }
)

const User = mongoose.model("users", userSchema)
export default User