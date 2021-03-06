import jwt from "jsonwebtoken"

export const loginUser = async (req, res, next) => {
  const user = req.user
  const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" })
  res.json({ accessToken })
}
