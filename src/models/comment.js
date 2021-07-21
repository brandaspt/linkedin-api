import mongoose from "mongoose"

const { Schema, model } = mongoose

const reqString = { type: String, required: true }

const CommentSchema = new Schema(
  {
    comment: reqString,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
)

export default model("Comment", CommentSchema)
