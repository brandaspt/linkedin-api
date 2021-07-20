import { error } from "console"
import createError from "http-errors"
import { pipeline } from "stream"
// import q2m from "query-to-mongo"

import UserModel from "../models/user.js"
import { cvPDFStream } from "../utils/pdf.js"

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find()
    res.json(users)
  } catch (error) {
    next(createError(500, error))
  }
}

export const getSingleUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId)
    if (!user) return next(createError(404, `User with id ${req.params.userId} not found.`))
    res.json(user)
  } catch (error) {
    next(createError(500, error))
  }
}
export const addNewUser = async (req, res, next) => {
  const newUser = new UserModel(req.body)
  try {
    await newUser.save()
    res.status(201).json(newUser)
  } catch (error) {
    res.json(error)
  }
}
export const editUser = async (req, res, next) => {
  const update = { ...req.body }
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.userId, update, { new: true, runValidators: true })
    if (!updatedUser) return next(createError(404, `User with id ${req.params.userId} not found.`))
    res.json(updatedUser)
  } catch (error) {
    next(createError(400, error))
  }
}
export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.userId)
    if (!deletedUser) return next(createError(404, `User with id ${req.params.userId} not found.`))
    res.json({ ok: true, message: "User deleted successfully" })
  } catch (error) {
    next(createError(500, error))
  }
}

// USER IMAGE UPLOAD
export const uploadUserImage = async (req, res, next) => {
  const update = { image: req.file.path }
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.userId, update, { new: true, runValidators: true })
    if (!updatedUser) return next(createError(404, `User with id ${req.params.userId} not found.`))
    res.json(updatedUser)
  } catch (error) {
    next(createError(500, error))
  }
}

// DOWNLOAD CV PDF
export const downloadCvPdf = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId)
    res.setHeader("Content-Disposition", `attachment; filename=${user.name}-${user.surname}-CV.pdf`)

    const source = await cvPDFStream(user)
    const destination = res
    pipeline(source, destination, err => {
      if (err) next(createError(500, err))
    })
  } catch (error) {
    next(createError(500, error))
  }
}

// EXPERIENCES
export const getAllUserExperiences = async (req, res, next) => {
  try {
    const data = await UserModel.findById(req.params.userId, { experiences: 1, _id: 0 })
    if (!data) return next(createError(404, `User with id ${req.params.userId} not found.`))
    res.json(data.experiences)
  } catch (error) {
    next(createError(500, error))
  }
}

export const addNewExperience = async (req, res, next) => {
  const newExperience = { ...req.body, createdAt: new Date(), updatedAt: new Date() }
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.userId,
      { $push: { experiences: newExperience } },
      { new: true, runValidators: true }
    )
    if (!updatedUser) return next(createError(404, `User with id ${req.params.userId} not found.`))
    res.json(updatedUser)
  } catch (error) {
    next(createError(400, error))
  }
}
export const getSingleExperience = async (req, res, next) => {
  try {
    const data = await UserModel.findById(req.params.userId, {
      experiences: {
        $elemMatch: { _id: req.params.expId },
      },
      _id: 0,
    })
    if (!data) return next(createError(404, `User with id ${req.params.userId} not found.`))
    if (!data.experiences[0]) return next(createError(404, `Experience with id ${req.params.expId} not found.`))
    res.json(data.experiences[0])
  } catch (error) {
    next(createError(400, error))
  }
}
export const editExperience = async (req, res, next) => {
  try {
    const data = await UserModel.findById(req.params.userId, {
      experiences: {
        $elemMatch: { _id: req.params.expId },
      },
      _id: 0,
    })
    if (!data) return next(createError(404, `User with id ${req.params.userId} not found.`))
    if (!data.experiences[0]) return next(createError(404, `Experience with id ${req.params.expId} not found.`))
    const oldExperience = data.experiences[0].toObject()

    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: req.params.userId,
        "experiences._id": req.params.expId,
      },
      {
        $set: { "experiences.$": { ...oldExperience, ...req.body, updatedAt: new Date() } },
      },
      { new: true, runValidators: true }
    )
    res.json(updatedUser)
  } catch (error) {
    next(createError(500, error))
  }
}
export const deleteExperience = async (req, res, next) => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: req.params.userId,
        "experiences._id": req.params.expId,
      },
      {
        $pull: { experiences: { _id: req.params.expId } },
      },
      { new: true }
    )
    if (!updatedUser) return next(createError(404, `Not found.`))
    res.json({ ok: true, message: "Experience deleted successfully" })
  } catch (error) {
    next(createError(500, error))
  }
}

// EXP IMAGE UPLOAD
export const uploadExpImage = async (req, res, next) => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      {
        _id: req.params.userId,
        "experiences._id": req.params.expId,
      },
      {
        $set: { "experiences.$.image": req.file.path, "experiences.$.updatedAt": new Date() },
      },
      { new: true }
    )
    if (!updatedUser) return next(createError(404, `Not found.`))
    res.json(updatedUser)
  } catch (error) {
    next(createError(500, error))
  }
}
