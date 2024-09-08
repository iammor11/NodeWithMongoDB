import jwt from 'jsonwebtoken'
import { JWTKEY } from '../config.js'
import User from '../models/user.js'

export const verifyJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({
                message: "Auth failed, There is no authorization header!"
            })
        }
        const token = authHeader.split(" ")[1]
        let decodedToken
        try {
            decodedToken = jwt.verify(token, JWTKEY)
        }
        catch (error) {
            return res.status(500).json({
                message: "Can't verify authentication token, Please login again",
                error
            })
        }
        req.id = decodedToken
        next()
    }
    catch (error) {
        return res.status(401).json({
            message: 'Auth failed',
            error
        })
    }
}

export const getDetail = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({
                message: "Auth failed, There is no authorization header!"
            })
        }
        const token = authHeader.split(" ")[1]
        let decodedToken
        try {
            decodedToken = await jwt.verify(token, JWTKEY)
        } catch (error) {
            return res.status(500).json({
                message: "Can't verify authentication token, Please login again",
                error
            })
        }
        const user = await User.findById(decodedToken._id)
        if (!user) {
            return res.status(404).json({
                message: "Token not found!"
            })
        }
        return {
            ...decodedToken,
        }
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed',
            error
        })
    }
}