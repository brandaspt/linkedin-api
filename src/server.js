import express from "express"
import mongoose from "mongoose"
import cors from "cors"

import usersRouter from "./services/users/users.js"
import postsRouter from "./services/posts/posts.js"
import loginRouter from "./services/login/login.js"
import { errorHandler } from "./errorHandlers.js"

const server = express()
const PORT = process.env.PORT || 3001
const DB_STRING = process.env.DB_STRING

// ### MIDDLEWARES ###
server.use(cors())
server.use(express.json())

// ### ENDPOINTS ###

server.use("/users", usersRouter)
server.use("/posts", postsRouter)
server.use("/login", loginRouter)

// ### ERROR HANDLERS ###
server.use(errorHandler)

// ### DATABSE ###
mongoose
  .connect(DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => server.listen(PORT, () => console.log("Server listening on port " + PORT)))
  .catch(err => console.log(err))
