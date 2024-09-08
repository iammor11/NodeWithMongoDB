import express from "express"
import { getUserDetail, updateUsername, updateTimezone, checkUsername } from "../controllers/user.js"
import { verifyJWT } from "../middlewares/checkAuth.js"
import { check, validationResult } from "express-validator"

const router = express.Router()

router.get("/detail", verifyJWT, getUserDetail)

router.get("/username/:username", verifyJWT, checkUsername)

router.patch("/username", verifyJWT,
    check("username", "username is required!").notEmpty().trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array().length === 2 ? errors.array()[1].msg : errors.array()[0].msg, error: errors.array() })
        }
        next()
    },
    updateUsername)

router.patch("/timezone", verifyJWT,
    check("timezone", "timezone is required!").isNumeric().notEmpty().escape(),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array().length === 2 ? errors.array()[1].msg : errors.array()[0].msg, error: errors.array() })
        }
        next()
    },
    updateTimezone)

export default router