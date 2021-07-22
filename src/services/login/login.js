import { Router } from "express"

import { checkUser } from "./middlewares.js"
import { loginUser } from "../../controllers/login.js"

const router = Router()

router.post("/", checkUser, loginUser)

export default router
