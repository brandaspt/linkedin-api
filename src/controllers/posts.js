import createError from "http-errors"
import q2m from "query-to-mongo"

import PostModel from "../models/post.js"

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await PostModel.find()
    res.send(posts)
  } catch (error) {
    next(createError(500, "An error occurred while getting posts "));
  }
}
export const getSinglePost = async (req, res, next) => {
  try {
    const postId = req.params.postId
    
    const post = await PostModel.findById(postId)
    if(post){
      res.send(post)
    }else{
      next(createError(404, `Post not found!`));
    }
  } catch (error) {
    next(createError(500, "An error occurred while getting post "));
  }
}
export const addNewPost = async (req, res, next) => {
  try {
    const newPost = new PostModel(req.body);
    const { _id } = await newPost.save();

    res.status(201).send({ _id })
  } catch (error) {
    if (error.name === "ValidationError") {
      next(createError(400, error))
    } else {
      console.log(error)
      next(createError(500, "An error occurred while creating new post"))
    }
    next(createError(500, error))
  }
}
export const editPost = async (req, res, next) => {
  try {
    const postId = req.params.postId

    const updatedPost = await PostModel.findByIdAndUpdate(postId,req.body,{
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
    const updatedPost = await PostModel.findByIdAndUpdate(req.params.postId, {image: req.file.path }, { new: true })
    if (!updatedPost) return next(createError(404, `Post with id ${req.params.postId} not found`))
    res.json(updatedPost)
  } catch (error) {
    next(error)
  }
}


//likes NOT SURE😰

export const likedPost = async (req, res, next) => {
  const userId = req.body.userId
  if (!mongoose.isValidObjectId(userId)) return next(createError(400, "Invalid user ID"))

  try {

    // Check if post exists in db
    const postExists = await PostModel.exists({ _id: req.params.postId })
    if (!postExists) return next(createError(404, `Post with id ${req.params.postId} not found`))

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