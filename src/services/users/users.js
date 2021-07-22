import express from "express"
import { authenticateJWT, validateObjectId } from "../sharedMiddlewares.js"
import * as Controllers from "../../controllers/users.js"
import { usersImgParser, expImgParser } from "../../settings/cloudinary.js"

const router = express.Router()

// USERS
router.route("/").get(Controllers.getAllUsers).post(Controllers.addNewUser)
router.get("/me", authenticateJWT, Controllers.sendUser)
router
  .route("/:userId")
  .get(validateObjectId, Controllers.getSingleUser)
  .put(validateObjectId, authenticateJWT, Controllers.editUser)
  .delete(validateObjectId, Controllers.deleteUser)

// USER IMAGE UPLOAD
router.post("/:userId/uploadImage", validateObjectId, authenticateJWT, usersImgParser.single("userImg"), Controllers.uploadUserImage)
// DOWNLOAD CV PDF
router.get("/:userId/cv", validateObjectId, Controllers.downloadCvPdf)
// DOWNLOAD EXP CSV
router.get("/:userId/csv", validateObjectId, Controllers.downloadExpCsv)

// EXPERIENCES
router.route("/:userId/experiences").get(Controllers.getAllUserExperiences).post(validateObjectId, Controllers.addNewExperience)
router
  .route("/:userId/experiences/:expId")
  .get(Controllers.getSingleExperience)
  .put(Controllers.editExperience)
  .delete(Controllers.deleteExperience)

// USER IMAGE UPLOAD
router.post("/:userId/experiences/:expId/uploadImage", validateObjectId, expImgParser.single("expImg"), Controllers.uploadExpImage)

export default router
