import { getDetail } from "../middlewares/checkAuth.js"
import User from "../models/user.js"

export const getUserDetail = async (req, res, next) => {
  try {
    const authData = await getDetail(req, res, next)
    const result = await User.findById(authData._id)
    return res.status(200).json({
      message: "Successfully get the details!",
      result
    })
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error
    })
  }
}

export const updateUsername = async (req, res, next) => {
  try {
    const { username } = req.body
    const authData = await getDetail(req, res, next)
    const isFind = await User.findOne({ username })
    if (isFind) {
      return res.status(409).json({
        message: "Username exists already, Please pick a different one"
      })
    }
    await User.updateOne({ _id: authData._id }, { username })
    const result = await User.findById(authData._id)
    return res.status(201).json({
      message: "Username updated successfully!",
      result
    })
  }
  catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error
    })
  }
}

export const updateTimezone = async (req, res, next) => {
  try {
    const { timezone } = req.body
    const authData = await getDetail(req, res, next)
    await User.updateOne({ _id: authData._id }, { timezone })
    const result = await User.findById(authData._id)
    return res.status(201).json({
      message: "Timezone updated successfully!",
      result
    })
  }
  catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error
    })
  }
}

export const checkUsername = async (req, res, next) => {
  try {
    const { username } = req.params
    const isFind = await User.findOne({ username })
    if (isFind) {
      return res.status(409).json({
        message: "Username exists already, Please pick a different one",
        result: false
      })
    } else {
      return res.status(200).json({
        message: "Username is available",
        result: true
      })
    }
  }
  catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error
    })
  }
}