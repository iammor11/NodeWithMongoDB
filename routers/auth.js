import express from "express"
import { body, check, validationResult } from "express-validator"
import { logout, signup, login, changePassword, verifyEmail, resetPasswordLink } from "../controllers/auth.js"
import { verifyJWT } from "../middlewares/checkAuth.js"

const router = express.Router()

router.get("/logout", verifyJWT, logout)

router.post("/signup",
    check("name", "name is required!").notEmpty().escape(),
    check("timezone", "timezone is required!").isNumeric().notEmpty().escape(),
    check("email", "email is required!").isEmail().notEmpty().escape(),
    check("password", "password is required!").notEmpty().escape(),
    body("email").isEmail().trim().withMessage("Not an email"),
    body("timezone").isNumeric().withMessage("Timezone should be a number"),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array().length === 2 ? errors.array()[1].msg : errors.array()[0].msg, error: errors.array() })
        }
        next()
    },
    signup)

router.post("/login",
    check("password", "password is required!").notEmpty(),
    body("email").isEmail().optional().trim().withMessage("Not an email"),
    body("username").optional().trim(),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array().length === 2 ? errors.array()[1].msg : errors.array()[0].msg, error: errors.array() })
        }
        next()
    },
    login)

router.post("/resetPassword",
    check("email", "email is required!").isEmail().notEmpty().escape(),
    body("email").isEmail().trim().withMessage("Not an email"),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array().length === 2 ? errors.array()[1].msg : errors.array()[0].msg, error: errors.array() })
        }
        next()
    }, resetPasswordLink)

router.patch("/updatePassword/:token",
    check("password", "Password is required!").notEmpty().escape(),
    body("password").notEmpty().withMessage("Password is required!"),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array().length === 2 ? errors.array()[1].msg : errors.array()[0].msg, error: errors.array() })
        }
        next()
    },
    changePassword)

router.patch("/verify/:token", verifyEmail)

export default router