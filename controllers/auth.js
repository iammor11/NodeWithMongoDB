import User from "../models/user.js"
import { getDetail } from "../middlewares/checkAuth.js"
import { JWTKEY } from "../config.js"
import sendEmail from "../utils/sendEmail.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const logout = async (req, res, next) => {
  try {
    const authData = await getDetail(req, res, next)
    await User.updateOne({ _id: authData?._id }, { isOnline: false })
    return res.status(200).json({
      message: "Successfully logged out!"
    })
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error
    })
  }
}

export const signup = async (req, res, next) => {
  try {
    const { email, password, name, timezone, isSkorboardUser } = req.body
    const checkUser = await User.findOne({ email })
    if (checkUser) {
      return res.status(401).json({
        message: "Email exists already, Please pick a different one"
      })
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    let otp = Math.floor(Math.random() * 10000 + 1)
    const user = new User({
      name,
      email,
      timezone,
      username: email?.split("@")[0],
      password: hashedPassword,
      isSkorboardUser,
      resetToken: otp
    })
    await user.save()
    const description = `
    <h2>Verify your email address</h2>
    <p>You are requested to verify your email.</p>
    <p>Here is your one time OTP to verify your email: ${otp}</p>`
    const subject = "Verify your email address"
    const sendMail = await sendEmail(email, subject, description)
    if (sendMail.isSend === true) {
      return res.status(200).json({
        message: `Signup successfully and email has been sent to ${email} for verification OTP`,
        result: true
      })
    } else {
      return res.status(500).json({
        message: `Something went wrong while sending verification email to the ${email}`
      })
    }
  }
  catch (error) {
    return res.status(500).json({
      message: "Something went wrong, Please try again",
      error
    })
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password, username } = req.body
    if (!username && !email) {
      return res.status(422).json({
        message: "Email or username is required!"
      })
    }
    const user = await User.findOne(email ? { email } : { username }).select("isVerified password _id email name username timezone")
    if (!user) {
      return res.status(404).json({
        message: `${email ? "Email" : "Username"} not found!`
      })
    }
    if (!user.isVerified) {
      return res.status(422).json({
        message: "Please verify your email!"
      })
    }
    const matchPass = await bcrypt.compare(password, user.password)
    if (!matchPass) {
      return res.status(422).json({
        message: "Wrong password!"
      })
    }
    if (matchPass) {
      const token = await jwt.sign({
        _id: user._id,
        email: user.email,
        name: user.name,
        username: user.username,
        tz: user.timezone
      }, JWTKEY, { expiresIn: "24h" })
      await User.updateOne({ email: user.email }, { isOnline: true, lastLogin: new Date() })
      return res.status(200).json({
        message: "Login successfully",
        token
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
      error
    })
  }
}

export const verifyEmail = async (req, res, next) => {
  try {
    const token = req.params.token
    const user = await User.findOne({ resetToken: token }).select("_id")
    if (!user) {
      return res.status(422).json({
        message: "Invalid otp!"
      })
    }
    await User.updateOne({ _id: user._id }, { isVerified: true, resetToken: null })
    return res.status(201).json({
      message: "Email address is verified successfully!",
      result: true
    })
  }
  catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error
    })
  }
}

export const changePassword = async (req, res, next) => {
  try {
    const token = req.params.token
    const newPassword = req.body.password
    const user = await User.findOne({ resetToken: token }).select("_id")
    if (!user) {
      return res.status(422).json({
        message: "Invalid otp!"
      })
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await User.updateOne({ _id: user._id }, { password: hashedPassword, resetToken: null })
    return res.status(201).json({
      message: "Password has been changed successfully!",
      result: true
    })
  }
  catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error
    })
  }
}

export const resetPasswordLink = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email }).select("resetToken")
    if (!user) {
      return res.status(404).json({
        message: "There is no account with that email address!"
      })
    }
    let otp = Math.floor(Math.random() * 10000 + 1)
    user.resetToken = otp
    await user.save()
    const description = `<p>Here is your one time password reset OTP ${otp}</p>`
    const subject = "Reset your password"
    const sendMail = await sendEmail(email, subject, description)
    if (sendMail.isSend === true) {
      return res.status(201).json({
        message: `Email send successfully to ${email} to change the password!`,
        result: true
      })
    }
  }
  catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error
    })
  }
}