import express from "express"
import { postExists, userExists, validateObjectId } from "../sharedMiddlewares.js"
import * as Controllers from "../../controllers/posts.js"
import { postsImgParser } from "../../settings/cloudinary.js"

const router = express.Router()

// POSTS
router.get("/", Controllers.getAllPosts)
router.get("/:postId", validateObjectId, Controllers.getSinglePost)
router.post("/", Controllers.addNewPost)
router.put("/:postId", validateObjectId, Controllers.editPost)
router.delete("/:postId", validateObjectId, Controllers.deletePost)
router.post("/:postId/uploadImage", validateObjectId, postsImgParser.single("postImg"), Controllers.uploadPostImage)
router.post("/:postId/like", validateObjectId, userExists("body"), postExists("params"), Controllers.likedPost)

// COMMENTS
router.get("/:postId/comments", validateObjectId, Controllers.getPostComments)
router.post("/:postId/comments", validateObjectId, userExists("body"), postExists("params"), Controllers.addNewComment)
router.delete("/:postId/comments/:commId", validateObjectId, Controllers.deleteComment)
router.put("/:postId/comments/:commId", validateObjectId, Controllers.editComment)

export default router
