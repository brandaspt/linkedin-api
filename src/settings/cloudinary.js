import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import multer from "multer"

// USERS
const usersImgStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "LinkedIn/Img/Users",
  },
})
export const usersImgParser = multer({ storage: usersImgStorage })

// EXPERIENCES
const expImgStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "LinkedIn/Img/Experiences",
  },
})
export const expImgParser = multer({ storage: expImgStorage })

// POSTS
const postsImgStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "LinkedIn/Img/Posts",
  },
})
export const postsImgParser = multer({ storage: postsImgStorage })
