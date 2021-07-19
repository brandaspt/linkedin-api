import express from "express"
import { validateObjectId } from "../sharedMiddlewares.js"
import * as Controllers from "../../controllers/users.js"
import { usersImgParser } from "../../settings/cloudinary.js"

const router = express.Router()

router.route("/").get(Controllers.getAllUsers).post(Controllers.addNewUser)
router
  .route("/:userId")
  .get(validateObjectId, Controllers.getSingleUser)
  .put(validateObjectId, Controllers.editUser)
  .delete(validateObjectId, Controllers.deleteUser)

// IMAGE UPLOAD
router.post("/:userId/uploadImage", validateObjectId, usersImgParser.single("userImg"), Controllers.uploadUserImage)

// EXPERIENCES
router.route("/:userId/experiences").get(Controllers.getAllUserExperiences).post(validateObjectId, Controllers.addNewExperience)
router
  .route("/:userId/experiences/:experienceId")
  .get(Controllers.getSingleExperience)
  .put(Controllers.editExperience)
  .delete(Controllers.deleteExperience)

export default router
