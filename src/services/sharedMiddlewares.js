import mongoose from "mongoose"
import createError from "http-errors"
import jwt from "jsonwebtoken"

import UserModel from "../models/user.js"
import PostModel from "../models/post.js"

export const validateObjectId = async (req, res, next) => {
  if (req.params.userId) {
    if (!mongoose.isValidObjectId(req.params.userId)) return next(createError(400, "Invalid user ID"))
  }
  if (req.params.postId) {
    if (!mongoose.isValidObjectId(req.params.postId)) return next(createError(400, "Invalid post ID"))
  }
  if (req.params.expId) {
    if (!mongoose.isValidObjectId(req.params.expId)) return next(createError(400, "Invalid experience ID"))
  }
  if (req.params.commId) {
    if (!mongoose.isValidObjectId(req.params.commId)) return next(createError(400, "Invalid comment ID"))
  }
  next()
}

export const userExists = field => {
  return async (req, res, next) => {
    const userId = req[field].userId
    if (!mongoose.isValidObjectId(userId)) return next(createError(400, "Invalid user ID"))
    const user = await UserModel.findById(userId)
    if (!user) next(createError(404, `User with id ${userId} not found`))
    else next()
  }
}

export const postExists = field => {
  return async (req, res, next) => {
    const postId = req[field].postId
    if (!mongoose.isValidObjectId(postId)) return next(createError(400, "Invalid post ID"))
    const post = await PostModel.findById(postId)
    if (!post) next(createError(404, `Post with id ${postId} not found`))
    else next()
  }
}

export const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return next(createError(401, "Authorization header missing"))
  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await UserModel.findById(decoded._id)
    req.user = user

    next()
  } catch (error) {
    next(createError(403, error))
  }
}
