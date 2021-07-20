import createError from "http-errors"
import q2m from "query-to-mongo"
import mongoose from "mongoose"

import PostModel from "../models/post.js"
import UserModel from "../models/user.js"

export const getAllPosts = async (req, res, next) => {
  try {
    const query = q2m(req.query)
    const totalPosts = await PostModel.countDocuments(query.criteria)
    const posts = await PostModel.find()
    res.send({ links: query.links("/posts", totalPosts), totalPosts, posts })
  } catch (error) {
    next(createError(500, "An error occurred while getting posts "))
  }
}
export const getSinglePost = async (req, res, next) => {
  try {
    const postId = req.params.postId

    const post = await PostModel.findById(postId)
    if (post) {
      res.send(post)
    } else {
      next(createError(404, `Post not found!`))
    }
  } catch (error) {
    next(createError(500, "An error occurred while getting post "))
  }
}
export const addNewPost = async (req, res, next) => {
  const userId = req.body.userId
  try {
    const user = await UserModel.findById(userId)
    if (!user) return next(createError(404, `User with id ${userId} not found`))

    const newPostData = { text: req.body.text, username: user.username, userId: userId }

    const newPost = new PostModel(newPostData)
    const createdPost = await newPost.save()

    res.status(201).send(createdPost)
  } catch (error) {
    if (error.name === "ValidationError") {
      next(createError(400, error))
    } else {
      next(createError(500, error))
    }
  }
}
export const editPost = async (req, res, next) => {
  try {
    const postId = req.params.postId

    const updatedPost = await PostModel.findByIdAndUpdate(postId, req.body, {
      new: true,
      runValidators: true,
    })
    if (updatedPost) {
      res.send(updatedPost)
    } else {
      next(createError(404, `Post with _id ${postId} not found!`))
    }
  } catch (error) {
    next(createError(500, `An error occurred while updating post ${req.params.postId}`))
  }
}
export const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId
    const deletedPost = await PostModel.findByIdAndDelete(postId)

    if (deletedPost) {
      res.status(204).send(`🚮 Post with _id ${postId}, successfully deleted`)
    } else {
      next(createError(404, `Post with _id ${postId} not found!`))
    }
  } catch (error) {
    next(createError(500, error))
  }
}
export const uploadPostImage = async (req, res, next) => {
  try {
    let image
    if (req.body.url) {
      image = req.body.url
    } else {
      image = req.file.path
    }
    const updatedPost = await PostModel.findByIdAndUpdate(req.params.postId, { image: image }, { new: true })
    if (!updatedPost) return next(createError(404, `Post with id ${req.params.postId} not found`))
    res.json(updatedPost)
  } catch (error) {
    next(error)
  }
}

// LIKES

export const likedPost = async (req, res, next) => {
  const userId = req.body.userId
  if (!mongoose.isValidObjectId(userId)) return next(createError(400, "Invalid user ID"))

  try {
    // Check if post exists in db
    const postExists = await PostModel.exists({ _id: req.params.postId })
    if (!postExists) return next(createError(404, `Post with id ${req.params.postId} not found`))

    // Check if user exists in db
    const userExists = await UserModel.exists({ _id: userId })
    if (!userExists) return next(createError(404, `User with id ${userId} not found`))

    // Check if user already likes the post
    const isUserInLikesArr = await PostModel.findOne({ _id: req.params.postId, likes: userId })
    let updatedPost
    // If so, dislike
    if (isUserInLikesArr) updatedPost = await PostModel.findByIdAndUpdate(req.params.postId, { $pull: { likes: userId } }, { new: true })
    // If not, like
    else updatedPost = await PostModel.findByIdAndUpdate(req.params.postId, { $push: { likes: userId } }, { new: true })
    res.json(updatedPost)
  } catch (error) {
    next(error)
  }
}
