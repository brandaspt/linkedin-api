import createError from "http-errors"
// import q2m from "query-to-mongo"

import UserModel from "../models/user.js"

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

// EXPERIENCES
export const getAllUserExperiences = async (req, res, next) => {
  try {
    const experiences = await UserModel.findById(req.params.userId, { experiences: 1, _id: 0 })
    if (!experiences) return next(createError(404, `User with id ${req.params.userId} not found.`))
    res.json(experiences.experiences)
  } catch (error) {
    next(createError(500, error))
  }
}

export const addNewExperience = async (req, res, next) => {
  const newExperience = req.body
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
    const experience = await UserModel.findById(req.params.userId, {
      experiences: {
        $elemMatch: { _id: req.params.experienceId },
      },
      _id: 0,
    })
    console.log(experience)
    res.json(experience)
  } catch (error) {
    console.log(error)
    next(createError(400, error))
  }
}
export const editExperience = async (req, res, next) => {
  try {
  } catch (error) {}
}
export const deleteExperience = async (req, res, next) => {
  try {
  } catch (error) {}
}

// IMAGE UPLOAD
export const uploadUserImage = async (req, res, next) => {
  try {
  } catch (error) {
    next(createError(500, error))
  }
}
