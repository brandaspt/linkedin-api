import express from "express"
import { validateObjectId } from "../sharedMiddlewares.js"
import * as Controllers from "../../controllers/users.js"
import { usersImgParser } from "../../settings/cloudinary.js"

const router = express.Router()

router.get("/", Controllers.getAllUsers)
router.get("/:userId", validateObjectId, Controllers.getSingleUser)
router.post("/", Controllers.addNewUser)
router.put("/:userId", validateObjectId, Controllers.editUser)
router.delete("/:userId", validateObjectId, Controllers.deleteUser)
router.post("/:userId/uploadImage", validateObjectId, usersImgParser.single("userImg"), Controllers.uploadUserImage)

export default router
