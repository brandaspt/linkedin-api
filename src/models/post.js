import mongoose from "mongoose"

const { Schema, model } = mongoose

const reqString = { type: String, required: true }

const PostSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      default: "https://www.cornerstone-business.com/wp-content/uploads/2019/09/placeholder.png",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
)

export default model("Post", PostSchema)
