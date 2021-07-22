// import bcrypt from "bcrypt"
import UserModel from "../../models/user.js"
import createError from "http-errors"

export const checkUser = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await UserModel.findOne({ email: email })
    if (!user) return next(createError(404, `User with email ${email} not found`))
    // const match = await bcrypt.compare(password, user.password)

    if (password !== user.password) return next(createError(401, "Wrong password"))
    req.user = user
    next()
  } catch (error) {
    next(createError(500, error))
  }
}
