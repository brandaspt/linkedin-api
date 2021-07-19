import express from "express"
import { validateObjectId } from "../sharedMiddlewares.js"
import * as Controllers from "../../controllers/posts.js"
import { postsImgParser } from "../../settings/cloudinary.js"

const router = express.Router()

router.get("/", Controllers.getAllPosts)
router.get("/:postId", validateObjectId, Controllers.getSinglePost)
router.post("/", Controllers.addNewPost)
router.put("/:postId", validateObjectId, Controllers.editPost)
router.delete("/:postId", validateObjectId, Controllers.deletePost)
router.post("/:postId/uploadImage", validateObjectId, postsImgParser.single("postImg"), Controllers.uploadPostImage)
router.post("/:postId/like", validateObjectId, Controllers.likedPost)


export default router
