import mongoose from "mongoose"
import createError from "http-errors"

export const validateObjectId = async (req, res, next) => {
  if (req.params.userId) {
    if (!mongoose.isValidObjectId(req.params.userId)) return next(createError(400, "Invalid user ID"))
  }
  if (req.params.postId) {
    if (!mongoose.isValidObjectId(req.params.postId)) return next(createError(400, "Invalid review ID"))
  }
  next()
}
