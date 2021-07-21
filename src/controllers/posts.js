import createError from "http-errors"
import q2m from "query-to-mongo"

import PostModel from "../models/post.js"
import UserModel from "../models/user.js"
import CommentModel from "../models/comment.js"

// POSTS
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

  try {
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

// COMMENTS
export const getPostComments = async (req, res, next) => {
  try {
    const comments = await CommentModel.find({ postId: req.params.postId })
    res.json(comments)
  } catch (error) {
    next(createError(500, error))
  }
}
export const addNewComment = async (req, res, next) => {
  const postId = req.params.postId
  const newComment = new CommentModel({ ...req.body, postId })
  try {
    const createdComment = await newComment.save()
    res.status(201).json(createdComment)
  } catch (error) {
    next(createError(400, error))
  }
}
export const deleteComment = async (req, res, next) => {
  try {
    const resp = await CommentModel.findByIdAndDelete(req.params.commId)
    if (!resp) return next(createError(404, `Comment with id ${req.params.commId} not found`))
    res.json({ ok: true, message: "User deleted successfully" })
  } catch (error) {
    next(createError(500, error))
  }
}
export const editComment = async (req, res, next) => {
  try {
    const updatedComment = await CommentModel.findByIdAndUpdate(req.params.commId, { comment: req.body.comment })
    if (!updatedComment) return next(createError(404, `Comment with id ${req.params.commId} not found`))
    res.json(updatedComment)
  } catch (error) {
    next(createError(500, error))
  }
}
