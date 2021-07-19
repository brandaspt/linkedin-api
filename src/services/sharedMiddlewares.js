import mongoose from "mongoose"
import createError from "http-errors"

export const validateObjectId = async (req, res, next) => {
  if (req.params.userId) {
    if (!mongoose.isValidObjectId(req.params.prodId)) return next(createError(400, "Invalid product ID"))
  }
  if (req.params.postId) {
    if (!mongoose.isValidObjectId(req.params.reviewId)) return next(createError(400, "Invalid review ID"))
  }
  next()
}
